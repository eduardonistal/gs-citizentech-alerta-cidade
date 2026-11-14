import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { runAutomation } from '../src/run-automation.mjs';

const forecast = {
  daily: {
    time: ['2026-11-14', '2026-11-15'],
    precipitation_sum: [12.5, 3.1],
    precipitation_probability_max: [80, 40]
  }
};

test('executa decisão, repetição e dry-run com log sanitizado', async () => {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'gs-rpa-'));
  const logFile = path.join(dir, 'run.jsonl');
  const { summary, payload } = await runAutomation({
    dryRun: true,
    token: 'unused',
    logFile,
    fetchImpl: async () => ({
      ok: true,
      json: async () => forecast
    })
  });

  assert.equal(summary.success, true);
  assert.equal(summary.decisions.accepted_days, 2);
  assert.equal(payload.alerts.length, 2);
  const log = await readFile(logFile, 'utf8');
  assert.match(log, /coleta iniciada/);
  assert.doesNotMatch(log, /Bearer|token|authorization/i);
});

test('registra falha de fonte sem vazar payload', async () => {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'gs-rpa-'));
  const logFile = path.join(dir, 'fail.jsonl');
  await assert.rejects(() => runAutomation({
    dryRun: true,
    logFile,
    fetchImpl: async () => ({ ok: false, status: 503 })
  }), /forecast_http_503/);
  const log = await readFile(logFile, 'utf8');
  assert.match(log, /source_unavailable/);
  assert.doesNotMatch(log, /503 body|password|Bearer/i);
});
