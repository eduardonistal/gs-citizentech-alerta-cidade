import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { buildAlertPayload } from '../src/process.mjs';

test('maps each forecast date to a source-attributed alert for the MVP', () => {
  const payload = buildAlertPayload({
    daily: {
      time: ['2026-11-06', '2026-11-07'],
      precipitation_sum: [22.5, 3],
      precipitation_probability_max: [70, 10]
    }
  }, '2026-11-06T12:00:00.000Z');

  assert.equal(payload.alerts.length, 2);
  assert.equal(payload.alerts[0].id, 'sp-centro-2026-11-06');
  assert.equal(payload.alerts[0].precipitation_mm, 22.5);
  assert.equal(payload.alerts[0].source_name, 'Open-Meteo');
});

test('rejects missing dates and mismatched forecast arrays', () => {
  assert.throws(() => buildAlertPayload({ daily: {} }, '2026-11-06T12:00:00.000Z'), /daily/);
});

test('rejects invalid forecasts instead of returning partially publishable alerts', () => {
  const invalidForecasts = [
    { time: ['2026-11-06', '2026-13-01'], precipitation_sum: [22.5, 3], precipitation_probability_max: [70, 10] },
    { time: ['2026-02-30'], precipitation_sum: [22.5], precipitation_probability_max: [70] },
    { time: ['2026-11-06'], precipitation_sum: [-1], precipitation_probability_max: [70] },
    { time: ['2026-11-06'], precipitation_sum: [22.5], precipitation_probability_max: [101] }
  ];

  for (const daily of invalidForecasts) {
    assert.throws(() => buildAlertPayload({ daily }, '2026-11-06T12:00:00.000Z'));
  }
});

test('n8n workflow accepts a valid ISO date in the source forecast', () => {
  const workflow = JSON.parse(readFileSync(new URL('../workflow/Alerta-Cidade-n8n.json', import.meta.url), 'utf8'));
  const source = workflow.nodes.find(node => node.name === 'Validar, iterar e normalizar').parameters.jsCode;
  const transform = new Function('$input', source);
  const result = transform({
    first: () => ({
      json: {
        daily: {
          time: ['2026-11-07'],
          precipitation_sum: [1],
          precipitation_probability_max: [5]
        }
      }
    })
  });

  assert.equal(result[0].json.alerts[0].id, 'sp-centro-2026-11-07');
});

test('n8n workflow rejects impossible ISO calendar dates', () => {
  const workflow = JSON.parse(readFileSync(new URL('../workflow/Alerta-Cidade-n8n.json', import.meta.url), 'utf8'));
  const source = workflow.nodes.find(node => node.name === 'Validar, iterar e normalizar').parameters.jsCode;
  const transform = new Function('$input', source);
  const input = {
    first: () => ({
      json: {
        daily: {
          time: ['2026-02-30'],
          precipitation_sum: [1],
          precipitation_probability_max: [5]
        }
      }
    })
  };

  assert.throws(() => transform(input), /Medição inválida/);
});

test('sample log is explicitly synthetic and contains no credentials or authorization values', () => {
  const sample = JSON.parse(readFileSync(new URL('../logs/sample.json', import.meta.url), 'utf8'));
  const serialized = JSON.stringify(sample);

  assert.equal(sample.status, 'synthetic_example');
  assert.match(sample.run_id, /^synthetic-/);
  assert.match(sample.message, /^\[SYNTHETIC\]/);
  assert.doesNotMatch(serialized, /"(?:authorization|token|password|credential|api[_-]?key)"\s*:/i);
  assert.doesNotMatch(serialized, /\bBearer\s+\S+/i);
  assert.doesNotMatch(serialized, /\b(?:Authorization|token|password|api[_-]?key)\s*[:=]\s*["']?\S+/i);
});
