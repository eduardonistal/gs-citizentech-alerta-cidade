import assert from 'node:assert/strict';
import test from 'node:test';
import { summarizeBenchmark } from '../avaliacao/metrics.mjs';

test('counts invalid outputs as incorrect decisions in the per-mode accuracy', () => {
  const rows = [
    { mode: 'baseline', valid_json: true, abstention_decision_correct: true },
    { mode: 'baseline', valid_json: true, abstention_decision_correct: false },
    { mode: 'rag', valid_json: true, abstention_decision_correct: true, answer_citation_recall: 1 },
    { mode: 'rag', valid_json: true, abstention_decision_correct: true, answer_citation_recall: 0.5 },
    { mode: 'agent', valid_json: true, abstention_decision_correct: true, answer_citation_recall: 1, expected_citations: ['source'] },
    { mode: 'agent', valid_json: false, expected_citations: ['source'] }
  ];

  const scoreboard = summarizeBenchmark(rows);

  assert.equal(scoreboard.baseline.abstention_decision_accuracy, 0.5);
  assert.equal(scoreboard.baseline.valid_output_rate, 1);
  assert.equal(scoreboard.rag.abstention_decision_accuracy, 1);
  assert.equal(scoreboard.rag.answer_citation_recall, 0.75);
  assert.equal(scoreboard.agent.abstention_decision_accuracy, 0.5);
  assert.equal(scoreboard.agent.valid_output_rate, 0.5);
  assert.equal(scoreboard.agent.answer_citation_recall, 0.5);
});

test('returns null mode metrics when there are no evaluated cases', () => {
  const scoreboard = summarizeBenchmark([]);

  assert.equal(scoreboard.agent.abstention_decision_accuracy, null);
  assert.equal(scoreboard.agent.valid_output_rate, null);
});
