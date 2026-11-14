import { readFile, writeFile } from 'node:fs/promises';
import { askLocalModel, recallAtK, retrieveKnowledge } from '../src/rag.mjs';
import { summarizeBenchmark } from './metrics.mjs';

const docs = (await readFile(new URL('../base/knowledge.jsonl', import.meta.url), 'utf8'))
  .trim().split(/\r?\n/).map(line => JSON.parse(line));
const tests = (await readFile(new URL('./test_cases.jsonl', import.meta.url), 'utf8'))
  .trim().split(/\r?\n/).map(line => JSON.parse(line));
const rows = [];

for (const mode of ['baseline', 'rag', 'agent']) {
  for (const testCase of tests) {
    const ranking = retrieveKnowledge(testCase.question, docs, 3).map(doc => doc.id);
    try {
      const result = await askLocalModel({ question: testCase.question, docs, mode });
      const cited = new Set(result.citations);
      rows.push({
        id: testCase.id,
        mode,
        answer: result.answer,
        citations: result.citations,
        abstained: result.abstained,
        expected_abstain: testCase.must_abstain,
        expected_citations: testCase.expected_citations,
        abstention_decision_correct: result.abstained === testCase.must_abstain,
        retrieval_recall_at_1: recallAtK(ranking, testCase.expected_citations, 1),
        retrieval_recall_at_3: recallAtK(ranking, testCase.expected_citations, 3),
        answer_citation_recall: testCase.expected_citations.length === 0
          ? null
          : testCase.expected_citations.filter(id => cited.has(id)).length / testCase.expected_citations.length,
        valid_json: true
      });
    } catch (error) {
      rows.push({
        id: testCase.id,
        mode,
        valid_json: false,
        error: `${error.name}: ${error.message}`,
        expected_abstain: testCase.must_abstain,
        expected_citations: testCase.expected_citations,
        retrieval_recall_at_1: recallAtK(ranking, testCase.expected_citations, 1),
        retrieval_recall_at_3: recallAtK(ranking, testCase.expected_citations, 3)
      });
    }
  }
}

const scoreboard = summarizeBenchmark(rows);

await writeFile(new URL('./results.json', import.meta.url), `${JSON.stringify({
  generated_at: new Date().toISOString(),
  model: process.env.OLLAMA_MODEL ?? 'qwen2.5:0.5b',
  retrieval_threshold: 'ao menos 1 termo lexical coincidente após expansão de sinônimos; no conjunto atual recall@3=1.0; recalibrar se a base crescer',
  scoreboard,
  note: 'Resultados gerados localmente; revisar cada saída antes de qualquer alegação.',
  rows
}, null, 2)}\n`);
console.log(`Gravadas ${rows.length} avaliações em avaliacao/results.json.`);
