import { mkdir, writeFile, appendFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildAlertPayload } from './process.mjs';

const root = path.dirname(fileURLToPath(import.meta.url));
const logsDir = path.join(root, '..', 'logs');

function logLine(entry) {
  return `${JSON.stringify({ ...entry, at: new Date().toISOString() })}\n`;
}

async function writeAudit(file, entry) {
  await appendFile(file, logLine(entry), 'utf8');
}

export async function fetchForecast(url, { fetchImpl = fetch, timeoutMs = 15000 } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetchImpl(url, { signal: controller.signal });
    if (!response.ok) {
      const error = new Error(`forecast_http_${response.status}`);
      error.category = 'source_unavailable';
      throw error;
    }
    return response.json();
  } catch (error) {
    if (error.category) throw error;
    const wrapped = new Error('forecast_request_failed');
    wrapped.category = 'source_unavailable';
    wrapped.cause = error;
    throw wrapped;
  } finally {
    clearTimeout(timer);
  }
}

export async function publishAlerts(endpoint, token, payload, { fetchImpl = fetch, timeoutMs = 15000 } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetchImpl(endpoint, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload),
      signal: controller.signal
    });
    if (response.status === 401 || response.status === 403) {
      const error = new Error('ingest_unauthorized');
      error.category = 'unauthorized';
      throw error;
    }
    if (response.status === 429) {
      const error = new Error('ingest_rate_limited');
      error.category = 'rate_limited';
      throw error;
    }
    if (!response.ok) {
      const error = new Error(`ingest_http_${response.status}`);
      error.category = 'publish_failed';
      throw error;
    }
    return response.json();
  } finally {
    clearTimeout(timer);
  }
}

export async function runAutomation({
  forecastUrl = 'https://api.open-meteo.com/v1/forecast?latitude=-23.55&longitude=-46.63&daily=precipitation_sum,precipitation_probability_max&timezone=America%2FSao_Paulo&forecast_days=3',
  ingestUrl = process.env.GS_INGEST_URL ?? 'http://127.0.0.1:3000/api/alerts/import',
  token = process.env.GS_INGEST_TOKEN,
  logFile = path.join(logsDir, `run-${new Date().toISOString().replace(/[:.]/g, '-')}.jsonl`),
  fetchImpl = fetch,
  dryRun = false
} = {}) {
  await mkdir(path.dirname(logFile), { recursive: true });
  const summary = {
    success: false,
    processed: 0,
    published: 0,
    decisions: { accepted_days: 0, rejected_days: 0 },
    logFile
  };

  try {
    if (!token && !dryRun) {
      const error = new Error('GS_INGEST_TOKEN ausente');
      error.category = 'config';
      throw error;
    }

    await writeAudit(logFile, { stage: 'start', category: 'info', message: 'coleta iniciada' });
    const forecast = await fetchForecast(forecastUrl, { fetchImpl });
    await writeAudit(logFile, {
      stage: 'collect',
      category: 'success',
      message: 'previsao obtida',
      items: forecast?.daily?.time?.length ?? 0
    });

    // Decisão + repetição sobre coleção de datas (requisito PDF).
    const dates = forecast?.daily?.time ?? [];
    const amounts = forecast?.daily?.precipitation_sum ?? [];
    const probabilities = forecast?.daily?.precipitation_probability_max ?? [];
    for (let index = 0; index < dates.length; index += 1) {
      const valid = typeof dates[index] === 'string'
        && Number.isFinite(amounts[index]) && amounts[index] >= 0
        && Number.isInteger(probabilities[index])
        && probabilities[index] >= 0 && probabilities[index] <= 100;
      if (valid) {
        summary.decisions.accepted_days += 1;
        summary.processed += 1;
      } else {
        summary.decisions.rejected_days += 1;
        await writeAudit(logFile, {
          stage: 'validate_item',
          category: 'invalid_item',
          message: 'item rejeitado por regra',
          index
        });
      }
    }

    const payload = buildAlertPayload(forecast, new Date().toISOString());
    if (dryRun) {
      await writeAudit(logFile, {
        stage: 'publish',
        category: 'dry_run',
        message: 'publicacao simulada',
        count: payload.alerts.length
      });
      summary.published = payload.alerts.length;
      summary.success = true;
      return { summary, payload };
    }

    const result = await publishAlerts(ingestUrl, token, payload, { fetchImpl });
    summary.published = result.count ?? payload.alerts.length;
    summary.success = true;
    await writeAudit(logFile, {
      stage: 'publish',
      category: 'success',
      message: 'lote publicado no MVP',
      count: summary.published
    });
    return { summary, payload, result };
  } catch (error) {
    await writeAudit(logFile, {
      stage: 'error',
      category: error.category ?? 'unknown',
      message: 'execucao interrompida sem segredos'
    });
    throw error;
  }
}

const isDirectRun = process.argv[1]
  && path.resolve(fileURLToPath(import.meta.url)) === path.resolve(process.argv[1]);

if (isDirectRun) {
  const dryRun = process.argv.includes('--dry-run');
  runAutomation({ dryRun })
    .then(({ summary }) => {
      console.log(JSON.stringify(summary, null, 2));
    })
    .catch((error) => {
      console.error(JSON.stringify({
        success: false,
        category: error.category ?? 'unknown',
        message: error.message
      }));
      process.exitCode = 1;
    });
}
