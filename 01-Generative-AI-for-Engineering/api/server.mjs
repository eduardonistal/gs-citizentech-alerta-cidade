import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { askLocalModel } from '../src/rag.mjs';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const docsPath = path.join(root, 'base', 'knowledge.jsonl');

async function loadDocs() {
  const text = await readFile(docsPath, 'utf8');
  return text.trim().split(/\r?\n/).map(line => JSON.parse(line));
}

export function createApiServer() {
  return createServer(async (req, res) => {
    if (req.method !== 'POST' || req.url !== '/api/ask') {
      return respond(res, 404, { error: 'not_found' });
    }
    try {
      const body = await readRequest(req);
      if (typeof body.question !== 'string' || !body.question.trim() || body.question.length > 500) {
        return respond(res, 400, { error: 'question_must_be_1_to_500_characters' });
      }
      const result = await askLocalModel({
        question: body.question.trim(),
        docs: await loadDocs(),
        mode: body.mode ?? 'rag'
      });
      return respond(res, 200, result);
    } catch (error) {
      console.error('local_ai_request_failed', { name: error.name, message: error.message });
      return respond(res, 503, { error: 'local_model_unavailable_or_invalid_response' });
    }
  });
}

async function readRequest(req) {
  let body = '';
  for await (const chunk of req) {
    body += chunk;
    if (body.length > 4096) throw new Error('request body too large');
  }
  return JSON.parse(body);
}

function respond(res, status, value) {
  res.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
    'x-content-type-options': 'nosniff'
  });
  res.end(JSON.stringify(value));
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const server = createApiServer();
  server.listen(Number(process.env.AI_PORT ?? 3001), '127.0.0.1', () => {
    console.log(`Local AI API listening on ${process.env.AI_PORT ?? 3001}`);
  });
}
