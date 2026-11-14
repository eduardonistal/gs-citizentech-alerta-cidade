import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from '../server.mjs';

async function withServer(t, options = {}) {
  const server = createServer(options);
  server.listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  t.after(() => new Promise(resolve => server.close(resolve)));
  return `http://127.0.0.1:${server.address().port}`;
}

test('rejects empty or oversized AI questions before forwarding', async t => {
  const baseUrl = await withServer(t, { askLocal: async () => { throw new Error('must not be called'); } });
  const response = await fetch(`${baseUrl}/api/ask`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ question: '   ' })
  });
  assert.equal(response.status, 400);
});

test('surfaces local model unavailability instead of returning a fake answer', async t => {
  const baseUrl = await withServer(t, { askLocal: async () => { throw new Error('local model offline'); } });
  const response = await fetch(`${baseUrl}/api/ask`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ question: 'Onde consulto orientação oficial?' })
  });
  assert.equal(response.status, 503);
  assert.deepEqual(await response.json(), { error: 'local_ai_unavailable' });
});
