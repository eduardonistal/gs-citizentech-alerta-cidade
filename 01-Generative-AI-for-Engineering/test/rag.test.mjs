import test from 'node:test';
import assert from 'node:assert/strict';
import { askLocalModel, localModelEndpoint, recallAtK, retrieveKnowledge, validateBaselineAnswer, validateGroundedAnswer } from '../src/rag.mjs';
import { buildSyntheticRetrievalReport } from '../avaliacao/retrieval-benchmark.mjs';

const docs = [
  { id: 'meteo', text: 'Open-Meteo fornece previsão pública de precipitação.', source: 'https://open-meteo.com/' },
  { id: 'civil', text: 'A Defesa Civil publica orientações oficiais de emergência.', source: 'https://www.gov.br/mdr/' }
];

test('retrieves a relevant source and does not invent a source for an unrelated query', () => {
  assert.equal(retrieveKnowledge('previsão precipitação', docs)[0].id, 'meteo');
  assert.deepEqual(retrieveKnowledge('horário do cinema', docs), []);
});

test('accepts only citations present in the retrieved context', () => {
  assert.doesNotThrow(() => validateGroundedAnswer({
    answer: 'Consulte a previsão.',
    citations: ['meteo'],
    abstained: false
  }, [docs[0]]));
  assert.throws(() => validateGroundedAnswer({
    answer: 'Resposta sem qualquer fonte citada.',
    citations: ['inventada'],
    abstained: false
  }, [docs[0]]), /citation/);
  assert.throws(() => validateGroundedAnswer({
    answer: 'meteo',
    citations: ['meteo'],
    abstained: false
  }, [docs[0]]), /20 caracteres/);
});

test('instructs the model to return no citations when abstaining', async () => {
  const originalFetch = globalThis.fetch;
  let prompt = '';
  let request;
  globalThis.fetch = async (_url, options) => {
    request = JSON.parse(options.body);
    prompt = request.prompt;
    return {
      ok: true,
      json: async () => ({
        response: JSON.stringify({
          answer: 'Não consta na base disponível.',
          citations: [],
          abstained: true
        })
      })
    };
  };

  try {
    const answer = await askLocalModel({ question: 'previsão de precipitação', docs, mode: 'rag' });
    assert.equal(answer.abstained, true);
    assert.match(prompt, /Quando abstained for true, citations deve ser \[\]/);
    assert.equal(request.options.temperature, 0);
    assert.deepEqual(request.format, {
      type: 'object',
      properties: {
        answer: { type: 'string', minLength: 20 },
        citations: { type: 'array', items: { type: 'string' } },
        abstained: { type: 'boolean' }
      },
      required: ['answer', 'citations', 'abstained'],
      additionalProperties: false
    });
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('measures retrieval recall at one and three without scoring unanswerable cases', () => {
  const ranking = ['meteo', 'civil', 'ibge'];
  assert.equal(recallAtK(ranking, ['meteo', 'ibge'], 1), 0.5);
  assert.equal(recallAtK(ranking, ['meteo', 'ibge'], 3), 1);
  assert.equal(recallAtK(ranking, [], 3), null);
});

test('keeps the no-context baseline uncited while allowing an answer to be measured', () => {
  assert.doesNotThrow(() => validateBaselineAnswer({
    answer: 'Não há fonte fornecida.',
    citations: [],
    abstained: false
  }));
  assert.throws(() => validateBaselineAnswer({
    answer: 'Resposta sem citação da fonte.',
    citations: ['inventada'],
    abstained: false
  }), /baseline/);
});

test('allows only local Ollama endpoints so questions cannot be forwarded to a public host', () => {
  assert.equal(localModelEndpoint('http://host.docker.internal:11434').hostname, 'host.docker.internal');
  assert.throws(() => localModelEndpoint('https://example.com'), /local/);
});

test('builds deterministic synthetic retrieval results without evaluating a model', () => {
  const testCases = [
    { id: 'T01', question: 'previsão precipitação', expected_citations: ['meteo'], must_abstain: false },
    { id: 'T04', question: 'horário do cinema', expected_citations: [], must_abstain: true }
  ];
  const originalFetch = globalThis.fetch;
  let fetchCalls = 0;
  globalThis.fetch = () => {
    fetchCalls += 1;
    throw new Error('fetch should not be called by the synthetic benchmark');
  };

  try {
    const report = buildSyntheticRetrievalReport(docs, testCases);
    const serialized = JSON.stringify(report);

    assert.equal(JSON.stringify(buildSyntheticRetrievalReport(docs, testCases)), serialized);
    assert.equal(JSON.parse(serialized).synthetic, true);
    assert.equal(JSON.parse(serialized).model_evaluated, false);
    assert.deepEqual(JSON.parse(serialized).fixture_ids, {
      document_ids: ['civil', 'meteo'],
      test_case_ids: ['T01', 'T04']
    });
    assert.equal(JSON.parse(serialized).cases[0].retrieval_recall_at_1, 1);
    assert.equal(JSON.parse(serialized).cases[1].retrieval_recall_at_1, null);
    assert.match(JSON.parse(serialized).note, /fixture/i);
    assert.equal(fetchCalls, 0);
  } finally {
    globalThis.fetch = originalFetch;
  }
});
