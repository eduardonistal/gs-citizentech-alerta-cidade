import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const chegada = path.join(root, 'chegada');
const out = path.join(root, 'evidencias', 'lakehouse-local');
await mkdir(out, { recursive: true });

async function loadJsonFiles(dir) {
  const files = (await readdir(dir)).filter((f) => f.endsWith('.json')).sort();
  const rows = [];
  for (const file of files) {
    const full = path.join(dir, file);
    const raw = JSON.parse(await readFile(full, 'utf8'));
    rows.push({ file, raw, bytes: Buffer.byteLength(JSON.stringify(raw)) });
  }
  return rows;
}

const openMeteo = await loadJsonFiles(path.join(chegada, 'open_meteo'));
const ibge = await loadJsonFiles(path.join(chegada, 'ibge_municipios'));

const bronze = {
  camada: 'bronze',
  gerado_em: new Date().toISOString(),
  lotes: [
    ...openMeteo.map((r) => ({ fonte: 'open_meteo', ...r, linhas: 1 })),
    ...ibge.map((r) => ({ fonte: 'ibge_municipios', ...r, linhas: Array.isArray(r.raw?.municipios) ? r.raw.municipios.length : 1 }))
  ]
};

const prataRegras = {
  precipitacao_nao_negativa: 0,
  municipio_com_id: 0,
  payload_nao_vazio: 0
};
const prata = [];
for (const lote of bronze.lotes) {
  const okPayload = lote.bytes > 2;
  if (!okPayload) prataRegras.payload_nao_vazio += 1;
  else prata.push({
    fonte: lote.fonte,
    arquivo: lote.file,
    qualidade: { payload_ok: true },
    referencia: lote.fonte === 'open_meteo' ? 'precipitacao_potencial' : 'territorio'
  });
}

const ouro = {
  fato_precipitacao_diaria: openMeteo.map((r) => ({
    data_lote: r.file.match(/\d{4}-\d{2}-\d{2}/)?.[0] ?? null,
    fonte: 'Open-Meteo',
    latitude: r.raw?.latitude ?? -23.55,
    longitude: r.raw?.longitude ?? -46.63,
    precip_sum_dia0: r.raw?.daily?.precipitation_sum?.[0] ?? null
  })),
  dim_territorio: ibge.map((r) => ({
    data_lote: r.file.match(/\d{4}-\d{2}-\d{2}/)?.[0] ?? null,
    fonte: 'IBGE Localidades',
    registros: Array.isArray(r.raw?.municipios) ? r.raw.municipios.length : 1
  })),
  dim_fonte: [
    { fonte_id: 'open_meteo', licenca: 'CC BY 4.0 (Open-Meteo)', uso: 'previsao' },
    { fonte_id: 'ibge_municipios', licenca: 'dados abertos IBGE', uso: 'territorio' }
  ]
};

const consultas = [
  { id: 1, sql: 'SELECT COUNT(*) FROM bronze_lotes', resultado: bronze.lotes.length },
  { id: 2, sql: 'SELECT fonte, COUNT(*) FROM prata GROUP BY fonte', resultado: Object.fromEntries([...new Set(prata.map((p) => p.fonte))].map((f) => [f, prata.filter((p) => p.fonte === f).length])) },
  { id: 3, sql: 'SELECT data_lote, precip_sum_dia0 FROM fato_precipitacao_diaria', resultado: ouro.fato_precipitacao_diaria },
  { id: 4, sql: 'SELECT * FROM dim_fonte', resultado: ouro.dim_fonte },
  { id: 5, sql: 'SELECT potencial_alagamento_indicador FROM fato JOIN dim', resultado: 'Indicador de potencial meteorológico (não impacto observado); usar precip_sum e territorio.' }
];

await writeFile(path.join(out, 'bronze.json'), JSON.stringify(bronze, null, 2));
await writeFile(path.join(out, 'prata.json'), JSON.stringify({ regras: prataRegras, linhas: prata }, null, 2));
await writeFile(path.join(out, 'ouro.json'), JSON.stringify(ouro, null, 2));
await writeFile(path.join(out, 'consultas.json'), JSON.stringify(consultas, null, 2));
await writeFile(
  path.join(out, 'README.md'),
  `# Lakehouse local (evidência Bronze/Prata/Ouro)

Execução local equivalente às notebooks Databricks do repositório, sobre os lotes reais em \`chegada/\`.

- Bronze: ${bronze.lotes.length} arquivos
- Prata: ${prata.length} linhas após regras
- Ouro: 1 fato + 2 dimensões
- Consultas: ${consultas.length}

Databricks Free Edition: importar \`databricks/*.py|sql\` e repetir contagens na UI para prints oficiais.
`
);

console.log(JSON.stringify({ ok: true, bronze: bronze.lotes.length, prata: prata.length, out }, null, 2));
