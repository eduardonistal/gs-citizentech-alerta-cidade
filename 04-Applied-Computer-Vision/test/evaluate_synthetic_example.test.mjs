import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { evaluateBinaryLabels } from '../src/evaluate_synthetic_example.mjs';

const fixture = JSON.parse(
  readFileSync(new URL('../data/metric-example.synthetic.json', import.meta.url), 'utf8'),
);

test('computes confusion counts and binary-label metrics for the toy example', () => {
  const result = evaluateBinaryLabels([1, 1, 1, 0, 0], [1, 0, 1, 1, 0]);

  assert.equal(result.true_positives, 2);
  assert.equal(result.false_positives, 1);
  assert.equal(result.false_negatives, 1);
  assert.equal(result.true_negatives, 1);
  assert.equal(result.precision, 2 / 3);
  assert.equal(result.recall, 2 / 3);
  assert.equal(result.f1, 2 / 3);
  assert.equal(result.synthetic, true);
  assert.equal(result.model_evaluated, false);
  assert.match(result.description, /toy binary-label metric example/i);
  assert.match(result.description, /not .*real image provenance/i);
  assert.match(result.description, /YOLO training/i);
  assert.match(result.description, /object-detection mAP/i);
  assert.match(result.description, /model performance/i);
});

test('labels the fixed example fixture as synthetic and not a model evaluation', () => {
  assert.deepEqual(fixture.ground_truth, [1, 1, 1, 0, 0]);
  assert.deepEqual(fixture.predictions, [1, 0, 1, 1, 0]);
  assert.equal(fixture.synthetic, true);
  assert.equal(fixture.model_evaluated, false);
  assert.match(fixture.description, /toy binary-label metric example/i);
  assert.match(fixture.description, /not .*real image provenance/i);
  assert.match(fixture.description, /YOLO training/i);
  assert.match(fixture.description, /object-detection mAP/i);
  assert.match(fixture.description, /model performance/i);
});

test('returns null precision when there are no predicted positives', () => {
  const result = evaluateBinaryLabels([1, 0], [0, 0]);

  assert.equal(result.precision, null);
  assert.equal(result.recall, 0);
  assert.equal(result.f1, 0);
});

test('returns null recall when there are no actual positives', () => {
  const result = evaluateBinaryLabels([0, 0], [1, 0]);

  assert.equal(result.precision, 0);
  assert.equal(result.recall, null);
  assert.equal(result.f1, 0);
});

test('rejects empty or unequal-length label arrays', () => {
  assert.throws(() => evaluateBinaryLabels([], []), /non-empty/i);
  assert.throws(() => evaluateBinaryLabels([1], [1, 0]), /same length/i);
});

test('rejects non-binary labels and non-array input', () => {
  assert.throws(() => evaluateBinaryLabels([1, 2], [1, 0]), /binary/i);
  assert.throws(() => evaluateBinaryLabels([0, 1], [0, -1]), /binary/i);
  assert.throws(() => evaluateBinaryLabels('10', [1, 0]), /arrays/i);
});
