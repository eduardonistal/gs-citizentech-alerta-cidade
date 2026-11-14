import { createServer as createHttpServer } from 'node:http';
import { mkdir, readFile, rename, rm, writeFile } from 'node:fs/promises';
import { randomUUID, timingSafeEqual } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { assessRainRisk } from './src/risk.mjs';
import { askLocalModel } from '../01-Generative-AI-for-Engineering/src/rag.mjs';

const root = path.dirname(fileURLToPath(import.meta.url));
const publicRoot = path.join(root, 'public');
const defaultAlertsPath = path.join(root, 'data', 'alerts.json');
const samplePath = path.join(root, 'data', 'alerts.sample.json');
const knowledgePath = path.resolve(root, '..', '01-Generative-AI-for-Engineering', 'base', 'knowledge.jsonl');
const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8'
};

export function createServer({
  ingestToken = process.env.GS_INGEST_TOKEN,
  alertsPath = defaultAlertsPath,
  askLocal = askLocalModel
} = {}) {
  const startedAt = Date.now();
  let requests = 0;
  let errors = 0;
  let lastRequestSeconds = 0;

  return createHttpServer(async (req, res) => {
    requests += 1;
    const requestStartedAt = performance.now();
    res.once('finish', () => {
      lastRequestSeconds = (performance.now() - requestStartedAt) / 1000;
    });
    const url = new URL(req.url ?? '/', 'http://localhost');
    try {
      if (url.pathname === '/api/alerts/import') {
        if (req.method !== 'POST') return sendJson(res, 405, { error: 'method_not_allowed' });
        if (!ingestToken) return sendJson(res, 503, { error: 'ingestion_not_configured' });
        if (!hasValidBearer(req.headers.authorization, ingestToken)) {
          return sendJson(res, 401, { error: 'unauthorized' });
        }
        let payload;
        try {
          payload = await readRequest(req, 65536);
        } catch (error) {
          return sendJson(res, error.code === 'LIMIT' ? 413 : 400, { error: 'invalid_request_body' });
        }
        const validationError = validateIngestion(payload);
        if (validationError) return sendJson(res, 400, { error: validationError });

        const data = {
          is_sample: false,
          source: 'coleta pública via fluxo autorizado',
          observed_at: payload.observed_at,
          alerts: payload.alerts
        };
        await persistJson(alertsPath, data);
        return sendJson(res, 200, { status: 'accepted', count: data.alerts.length });
      }
      if (url.pathname === '/api/ask') {
        if (req.method !== 'POST') return sendJson(res, 405, { error: 'method_not_allowed' });
        let body;
        try {
          body = await readRequest(req, 4096);
        } catch {
          return sendJson(res, 400, { error: 'invalid_request_body' });
        }
        if (typeof body.question !== 'string' || !body.question.trim() || body.question.length > 500) {
          return sendJson(res, 400, { error: 'question_must_be_1_to_500_characters' });
        }
        const mode = body.mode ?? 'rag';
        if (!['baseline', 'rag', 'agent'].includes(mode)) return sendJson(res, 400, { error: 'invalid_mode' });
        try {
          const docs = (await readFile(knowledgePath, 'utf8')).trim()
            .split(/\r?\n/).map(line => JSON.parse(line));
          const answer = await askLocal({ question: body.question.trim(), docs, mode });
          return sendJson(res, 200, answer);
        } catch (error) {
          console.error('local_ai_request_failed', { name: error.name, message: error.message });
          return sendJson(res, 503, { error: 'local_ai_unavailable' });
        }
      }
      if (req.method === 'GET' && url.pathname === '/api/health') {
        return sendJson(res, 200, { status: 'ok', mode: 'demo' });
      }
      if (req.method === 'GET' && url.pathname === '/api/alerts') {
        let fixture;
        try {
          fixture = JSON.parse(await readFile(alertsPath, 'utf8'));
        } catch (error) {
          if (error.code !== 'ENOENT') throw error;
          fixture = JSON.parse(await readFile(samplePath, 'utf8'));
        }
        const alerts = fixture.alerts.map(item => ({
          ...item,
          assessment: assessRainRisk({
            precipitationMm: item.precipitation_mm,
            probabilityPct: item.probability_pct
          })
        }));
        return sendJson(res, 200, {
          is_sample: fixture.is_sample,
          source: fixture.source,
          observed_at: fixture.observed_at,
          alerts
        });
      }
      if (req.method === 'GET' && url.pathname === '/metrics') {
        res.writeHead(200, { 'content-type': 'text/plain; version=0.0.4; charset=utf-8' });
        return res.end([
          '# HELP http_requests_total Requests served by the MVP process.',
          '# TYPE http_requests_total counter',
          `http_requests_total ${requests}`,
          '# HELP http_errors_total Failed requests served by the MVP process.',
          '# TYPE http_errors_total counter',
          `http_errors_total ${errors}`,
          '# HELP process_uptime_seconds MVP process uptime in seconds.',
          '# TYPE process_uptime_seconds gauge',
          `process_uptime_seconds ${Math.floor((Date.now() - startedAt) / 1000)}`,
          '# HELP http_request_duration_seconds_last Last request duration in seconds.',
          '# TYPE http_request_duration_seconds_last gauge',
          `http_request_duration_seconds_last ${lastRequestSeconds}`,
          '# HELP process_resident_memory_bytes Resident memory used by the process.',
          '# TYPE process_resident_memory_bytes gauge',
          `process_resident_memory_bytes ${process.memoryUsage().rss}`
        ].join('\n') + '\n');
      }
      if (req.method !== 'GET') {
        return sendJson(res, 405, { error: 'method_not_allowed' });
      }

      const requestedPath = url.pathname === '/' ? '/index.html' : decodeURIComponent(url.pathname);
      const filePath = path.resolve(publicRoot, `.${requestedPath}`);
      if (!filePath.startsWith(`${publicRoot}${path.sep}`)) {
        return sendJson(res, 400, { error: 'invalid_path' });
      }
      const body = await readFile(filePath);
      res.writeHead(200, {
        'content-type': mimeTypes[path.extname(filePath)] ?? 'application/octet-stream',
        'x-content-type-options': 'nosniff',
        'content-security-policy': "default-src 'self'; connect-src 'self'; style-src 'self'; script-src 'self'"
      });
      res.end(body);
    } catch (error) {
      errors += 1;
      if (error.code === 'ENOENT') return sendJson(res, 404, { error: 'not_found' });
      console.error('request_failed', { path: url.pathname, message: error.message });
      sendJson(res, 500, { error: 'internal_error' });
    }
  });
}

function hasValidBearer(header, token) {
  const match = /^Bearer (.+)$/.exec(header ?? '');
  if (!match) return false;
  const received = Buffer.from(match[1]);
  const expected = Buffer.from(token);
  return received.length === expected.length && timingSafeEqual(received, expected);
}

async function readRequest(req, maxBytes) {
  const chunks = [];
  let bytes = 0;
  for await (const chunk of req) {
    bytes += chunk.length;
    if (bytes > maxBytes) {
      const error = new Error('request body too large');
      error.code = 'LIMIT';
      throw error;
    }
    chunks.push(chunk);
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } catch {
    throw new Error('request body is not valid JSON');
  }
}

function validateIngestion(payload) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)
    || !Array.isArray(payload.alerts) || payload.alerts.length === 0 || payload.alerts.length > 500) {
    return 'alerts_must_contain_1_to_500_items';
  }
  if (typeof payload.observed_at !== 'string' || Number.isNaN(Date.parse(payload.observed_at))) {
    return 'observed_at_must_be_a_valid_timestamp';
  }
  const allowedFields = new Set([
    'id', 'area', 'precipitation_mm', 'probability_pct', 'source_name', 'source_url'
  ]);
  for (const alert of payload.alerts) {
    if (!alert || typeof alert !== 'object' || Array.isArray(alert)
      || Object.keys(alert).some(key => !allowedFields.has(key))) {
      return 'alert_has_invalid_shape';
    }
    if (typeof alert.id !== 'string' || !/^[a-z0-9-]{1,80}$/.test(alert.id)
      || typeof alert.area !== 'string' || !alert.area.trim() || alert.area.length > 120
      || typeof alert.source_name !== 'string' || !alert.source_name.trim() || alert.source_name.length > 80) {
      return 'alert_has_invalid_text_fields';
    }
    if (!Number.isFinite(alert.precipitation_mm) || alert.precipitation_mm < 0 || alert.precipitation_mm > 2000
      || !Number.isInteger(alert.probability_pct) || alert.probability_pct < 0 || alert.probability_pct > 100) {
      return 'alert_has_invalid_measurement';
    }
    let source;
    try {
      source = new URL(alert.source_url);
    } catch {
      return 'source_url_must_be_an_allowed_https_url';
    }
    if (source.protocol !== 'https:' || !['api.open-meteo.com', 'open-meteo.com'].includes(source.hostname)) {
      return 'source_url_must_be_an_allowed_https_url';
    }
  }
  return null;
}

async function persistJson(filePath, data) {
  await mkdir(path.dirname(filePath), { recursive: true });
  const temporary = `${filePath}.${randomUUID()}.tmp`;
  try {
    await writeFile(temporary, `${JSON.stringify(data, null, 2)}\n`, { flag: 'wx' });
    await rename(temporary, filePath);
  } catch (error) {
    await rm(temporary, { force: true });
    throw error;
  }
}

function sendJson(res, status, data) {
  res.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
    'x-content-type-options': 'nosniff'
  });
  res.end(JSON.stringify(data));
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const port = Number(process.env.PORT ?? 3000);
  const server = createServer();
  server.listen(port, '0.0.0.0', () => console.log(`Alerta Cidade listening on ${port}`));
}
