import { mkdir, writeFile, readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const arrivalRoot = path.join(root, '..', 'chegada');

async function writeJson(collection, ds, payload) {
  const directory = path.join(arrivalRoot, collection);
  await mkdir(directory, { recursive: true });
  const target = path.join(directory, `${collection}_${ds}.json`);
  await writeFile(target, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
  return target;
}

async function collectWeather(ds) {
  const url = new URL('https://api.open-meteo.com/v1/forecast');
  url.searchParams.set('latitude', '-23.55');
  url.searchParams.set('longitude', '-46.63');
  url.searchParams.set('daily', 'precipitation_sum,precipitation_probability_max');
  url.searchParams.set('timezone', 'America/Sao_Paulo');
  url.searchParams.set('forecast_days', '7');
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Open-Meteo HTTP ${response.status}`);
  return writeJson('open_meteo', ds, {
    collected_at: new Date().toISOString(),
    logical_date: ds,
    source: 'https://api.open-meteo.com/v1/forecast',
    payload: await response.json()
  });
}

async function collectIbge(ds) {
  const url = new URL('https://servicodados.ibge.gov.br/api/v1/localidades/municipios/3550308');
  const response = await fetch(url);
  if (!response.ok) throw new Error(`IBGE HTTP ${response.status}`);
  return writeJson('ibge_municipios', ds, {
    collected_at: new Date().toISOString(),
    logical_date: ds,
    source: 'https://servicodados.ibge.gov.br/api/v1/localidades/municipios/3550308',
    payload: await response.json()
  });
}

async function verifyArrival(paths) {
  for (const filePath of paths) {
    const info = await stat(filePath);
    if (!info.isFile() || info.size === 0) {
      throw new Error(`Arquivo ausente ou vazio: ${filePath}`);
    }
  }
  return paths;
}

export async function collectLot(ds) {
  const [weather, ibge] = await Promise.all([collectWeather(ds), collectIbge(ds)]);
  await verifyArrival([weather, ibge]);
  return { ds, files: [weather, ibge] };
}

async function inventory() {
  const collections = ['open_meteo', 'ibge_municipios'];
  const report = {};
  for (const collection of collections) {
    const dir = path.join(arrivalRoot, collection);
    try {
      const files = await readdir(dir);
      report[collection] = [];
      for (const name of files) {
        const info = await stat(path.join(dir, name));
        report[collection].push({ name, bytes: info.size });
      }
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
      report[collection] = [];
    }
  }
  return report;
}

const dates = process.argv.slice(2);
const lots = dates.length >= 2
  ? dates.slice(0, 2)
  : [
      new Date(Date.now() - 86400000).toISOString().slice(0, 10),
      new Date().toISOString().slice(0, 10)
    ];

const results = [];
for (const ds of lots) {
  results.push(await collectLot(ds));
}
const summary = {
  generated_at: new Date().toISOString(),
  lots: results,
  inventory: await inventory(),
  note: 'Coleta real via APIs públicas; equivale às tarefas paralelas do DAG para evidência local de chegada/. Upload ao Volume Databricks continua manual.'
};
await mkdir(path.join(root, '..', 'data'), { recursive: true });
await writeFile(
  path.join(root, '..', 'data', 'coleta-evidencia.json'),
  `${JSON.stringify(summary, null, 2)}\n`,
  'utf8'
);
console.log(JSON.stringify(summary, null, 2));
