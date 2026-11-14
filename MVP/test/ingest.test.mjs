import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm, readFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { createServer } from '../server.mjs';

async function startServer(t) {
  const directory = await mkdtemp(path.join(os.tmpdir(), 'gs-mvp-'));
  const fixturePath = path.join(directory, 'alerts.json');
  const server = createServer({ ingestToken: 'test-secret', alertsPath: fixturePath });
  server.listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  t.after(async () => {
    await new Promise(resolve => server.close(resolve));
    await rm(directory, { recursive: true, force: true });
  });
  return { baseUrl: `http://127.0.0.1:${server.address().port}`, fixturePath };
}

test('rejects alert ingestion without the configured bearer token', async t => {
  const { baseUrl } = await startServer(t);
  const response = await fetch(`${baseUrl}/api/alerts/import`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ alerts: [] })
  });
  assert.equal(response.status, 401);
});

test('accepts a valid source payload and makes it visible to the MVP', async t => {
  const { baseUrl, fixturePath } = await startServer(t);
  const payload = {
    observed_at: '2026-11-06T10:00:00.000Z',
    alerts: [{
      id: 'sp-center',
      area: 'São Paulo',
      precipitation_mm: 12,
      probability_pct: 65,
      source_name: 'Open-Meteo',
      source_url: 'https://api.open-meteo.com/v1/forecast'
    }]
  };
  const response = await fetch(`${baseUrl}/api/alerts/import`, {
    method: 'POST',
    headers: {
      authorization: 'Bearer test-secret',
      'content-type': 'application/json'
    },
    body: JSON.stringify(payload)
  });
  assert.equal(response.status, 200);
  assert.equal(JSON.parse(await readFile(fixturePath, 'utf8')).is_sample, false);
  const alerts = await fetch(`${baseUrl}/api/alerts`).then(result => result.json());
  assert.equal(alerts.alerts[0].area, 'São Paulo');
  assert.equal(alerts.alerts[0].assessment.level, 'atencao');
});

test('rejects malformed or out-of-domain alert data', async t => {
  const { baseUrl } = await startServer(t);
  const response = await fetch(`${baseUrl}/api/alerts/import`, {
    method: 'POST',
    headers: {
      authorization: 'Bearer test-secret',
      'content-type': 'application/json'
    },
    body: JSON.stringify({ alerts: [{ id: 'x', precipitation_mm: -2 }] })
  });
  assert.equal(response.status, 400);
});
