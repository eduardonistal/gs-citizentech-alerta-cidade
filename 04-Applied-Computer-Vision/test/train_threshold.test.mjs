import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createSyntheticDataset,
  evaluate,
  predict,
  trainThresholdModel
} from '../src/train_threshold.mjs';

test('treina limiares e classifica o conjunto sintético de teste', () => {
  const dataset = createSyntheticDataset(7);
  const model = trainThresholdModel(dataset.slice(0, 28));
  const metrics = evaluate(dataset.slice(28), model);
  assert.equal(model.type, 'hsv_threshold_v1');
  assert.ok(metrics.f1 >= 0.8);
  assert.equal(predict(dataset[0], model).label, 'water_on_road');
});
