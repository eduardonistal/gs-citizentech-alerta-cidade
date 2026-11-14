import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { simulatePipeline } from '../scripts/simulate-pipeline.mjs';

const fixtureUrl = new URL('../data/forecast.synthetic.json', import.meta.url);
const fixture = JSON.parse(await readFile(fixtureUrl, 'utf8'));

test('counts Bronze rows, rejects invalid measurements, and keeps first valid date', () => {
  const result = simulatePipeline(fixture);

  assert.deepEqual(result, {
    synthetic: true,
    bronze_count: 5,
    silver_count: 3,
    duplicate_count: 1,
    rejected_count: 1,
    gold: [
      {
        date: '2026-11-07',
        precipitation_mm: 55,
        probability_percent: 80,
        risk_level: 'alto',
      },
      {
        date: '2026-11-08',
        precipitation_mm: 20,
        probability_percent: 10,
        risk_level: 'atenção',
      },
      {
        date: '2026-11-09',
        precipitation_mm: 5,
        probability_percent: 10,
        risk_level: 'baixo',
      },
    ],
  });
});

test('requires a synthetic marker and a records list', () => {
  assert.throws(() => simulatePipeline({ records: [] }), /synthetic/i);
  assert.throws(() => simulatePipeline({ synthetic: true, records: {} }), /records/i);
});

test('rejects measurements outside their valid ranges', () => {
  const result = simulatePipeline({
    synthetic: true,
    records: [
      { date: '2026-11-07', precipitation_mm: -0.1, probability_percent: 10 },
      { date: '2026-11-08', precipitation_mm: 1, probability_percent: -1 },
      { date: '2026-11-09', precipitation_mm: 1, probability_percent: 101 },
      { date: '2026-13-01', precipitation_mm: 1, probability_percent: 10 },
    ],
  });

  assert.equal(result.bronze_count, 4);
  assert.equal(result.silver_count, 0);
  assert.equal(result.rejected_count, 4);
});

test('uses demonstrative precipitation and probability thresholds', () => {
  const result = simulatePipeline({
    synthetic: true,
    records: [
      { date: '2026-11-07', precipitation_mm: 50, probability_percent: 0 },
      { date: '2026-11-08', precipitation_mm: 0, probability_percent: 85 },
      { date: '2026-11-09', precipitation_mm: 20, probability_percent: 0 },
      { date: '2026-11-10', precipitation_mm: 0, probability_percent: 60 },
      { date: '2026-11-11', precipitation_mm: 19.99, probability_percent: 59.99 },
    ],
  });

  assert.deepEqual(result.gold.map(({ risk_level }) => risk_level), [
    'alto',
    'alto',
    'atenção',
    'atenção',
    'baixo',
  ]);
});

test('adding a valid duplicate leaves Silver and Gold cardinality unchanged', () => {
  const duplicate = fixture.records[1];
  const result = simulatePipeline({
    ...fixture,
    records: [...fixture.records, duplicate],
  });
  const original = simulatePipeline(fixture);

  assert.equal(result.bronze_count, 6);
  assert.equal(result.duplicate_count, 2);
  assert.equal(result.silver_count, original.silver_count);
  assert.equal(result.gold.length, original.gold.length);
});
