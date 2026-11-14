import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { recallAtK, retrieveKnowledge } from '../src/rag.mjs';

export function buildSyntheticRetrievalReport(docs, testCases) {
  const cases = testCases.map(testCase => {
    const rankedIds = retrieveKnowledge(testCase.question, docs, 3).map(doc => doc.id);
    return {
      id: testCase.id,
      relevant_ids: [...testCase.expected_citations],
      ranked_ids: rankedIds,
      retrieval_recall_at_1: recallAtK(rankedIds, testCase.expected_citations, 1),
      retrieval_recall_at_3: recallAtK(rankedIds, testCase.expected_citations, 3)
    };
  });
  const average = key => {
    const values = cases.map(testCase => testCase[key]).filter(Number.isFinite);
    return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : null;
  };

  return {
    benchmark: 'offline-synthetic-retrieval',
    synthetic: true,
    model_evaluated: false,
    fixture_ids: {
      document_ids: docs.map(doc => doc.id).sort(),
      test_case_ids: testCases.map(testCase => testCase.id)
    },
    metrics: {
      retrieval_recall_at_1: average('retrieval_recall_at_1'),
      retrieval_recall_at_3: average('retrieval_recall_at_3'),
      scored_case_count: cases.filter(testCase => testCase.retrieval_recall_at_1 !== null).length,
      unanswerable_case_count: cases.filter(testCase => testCase.retrieval_recall_at_1 === null).length
    },
    cases,
    note: 'Resultados sintéticos de recuperação lexical, aplicáveis somente a estes fixtures; não avaliam respostas de modelo, baseline, RAG ou agente.'
  };
}

async function writeSyntheticRetrievalReport() {
  const readJsonl = async url => (await readFile(url, 'utf8'))
    .trim().split(/\r?\n/).map(line => JSON.parse(line));
  const docs = await readJsonl(new URL('../base/knowledge.jsonl', import.meta.url));
  const testCases = await readJsonl(new URL('./test_cases.jsonl', import.meta.url));
  const report = buildSyntheticRetrievalReport(docs, testCases);
  await writeFile(new URL('./retrieval-results.synthetic.json', import.meta.url), `${JSON.stringify(report, null, 2)}\n`);
  console.log('Relatório sintético offline salvo em avaliacao/retrieval-results.synthetic.json.');
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await writeSyntheticRetrievalReport();
}
