import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';

const taskRoot = new URL('../', import.meta.url);
const identityFiles = [
  '../../01-Generative-AI-for-Engineering/README.md',
  '../../01-Generative-AI-for-Engineering/docs/relatorio-tecnico.md',
  '../../02-Big-Data-Architecture-Data-Integration/README.md',
  '../../02-Big-Data-Architecture-Data-Integration/docs/relatorio-tecnico.md',
  '../../03-Business-Intelligence-Startup-Development/README.md',
  '../../03-Business-Intelligence-Startup-Development/docs/modelo-negocio.md',
  '../../03-Business-Intelligence-Startup-Development/roteiro-pitch.md',
  '../../04-Applied-Computer-Vision/README.md',
  '../../04-Applied-Computer-Vision/docs/relatorio-tecnico.md',
  '../../05-Robotic-Process-Automation/README.md',
  '../../05-Robotic-Process-Automation/docs/relatorio-tecnico.md',
  '../../06-Secure-DevOps-Tools-Cloud-Computing/README.md',
  '../../06-Secure-DevOps-Tools-Cloud-Computing/docs/relatorio-tecnico.md',
].map((relativePath) => new URL(relativePath, import.meta.url));
const paths = {
  workload: new URL('docs/carga-sintetica.csv', taskRoot),
  costs: new URL('docs/custo-template.csv', taskRoot),
  runbook: new URL('docs/runbook.md', taskRoot),
  readme: new URL('README.md', taskRoot),
  report: new URL('docs/relatorio-tecnico.md', taskRoot),
};

test('all discipline deliverables identify Eduardo as the sole member and submitter', () => {
  const identity = 'Integrante único e responsável pelo envio: **Eduardo de Oliveira Nistal — RM94524**.';

  for (const file of identityFiles) {
    assert.ok(existsSync(file), `${file.pathname} must exist`);
    assert.ok(
      readFileSync(file, 'utf8').includes(identity),
      `${file.pathname} must identify the sole member and submitter`,
    );
  }
});

function readRows(file) {
  const contents = readFileSync(file, 'utf8').trim();
  return contents.split(/\r?\n/).map((line) => line.split(','));
}

function normalize(value) {
  return value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '');
}

function assertUniformColumns(rows, filename) {
  assert.ok(rows.length > 1, `${filename} must contain data rows`);
  assert.equal(
    new Set(rows.map((row) => row.length)).size,
    1,
    `${filename} must have the same number of columns in every row`,
  );
}

test('synthetic workload CSV contains planning quantities for traffic, retention, and compute only', () => {
  assert.ok(existsSync(paths.workload), 'carga-sintetica.csv must exist');
  const rows = readRows(paths.workload);
  assertUniformColumns(rows, 'carga-sintetica.csv');

  const headers = rows[0].map(normalize);
  const dimensionColumn = headers.indexOf('dimensao');
  const quantityColumn = headers.indexOf('quantidade');
  const labelColumn = headers.indexOf('rotulo');
  assert.notEqual(dimensionColumn, -1, 'workload CSV must label each dimension');
  assert.notEqual(quantityColumn, -1, 'workload CSV must label each quantity');
  assert.notEqual(labelColumn, -1, 'workload CSV must label assumptions');
  assert.deepEqual(
    [...new Set(rows.slice(1).map((row) => normalize(row[dimensionColumn])))].sort(),
    ['computacao', 'retencao', 'trafego'],
  );
  assert.ok(rows.slice(1).every((row) => Number(row[quantityColumn]) > 0));
  assert.ok(rows.slice(1).every((row) => /sintetica.*planejamento|planejamento.*sintetica/i.test(row[labelColumn])));
  assert.ok(
    !headers.some((header) => /preco|price|provedor|provider|regiao|region|uso_real|observado/.test(header)),
    'workload CSV must not include provider prices, regions, or measured usage',
  );
});

test('cost template keeps provider, pricing, measured usage, and live evidence cells blank', () => {
  const rows = readRows(paths.costs);
  assertUniformColumns(rows, 'custo-template.csv');
  const headers = rows[0].map(normalize);
  const blankColumns = [
    'provedor',
    'regiao',
    'uso_real',
    'preco_unitario_cotado',
    'estimativa_mensal_cotada',
    'fonte_oficial_do_preco',
    'data_da_consulta',
    'url_de_implantacao',
    'resultado_de_ci',
    'evidencia_de_alerta_ao_vivo',
  ];

  for (const column of blankColumns) {
    const index = headers.indexOf(column);
    assert.notEqual(index, -1, `cost template must include a ${column} column`);
    assert.ok(
      rows.slice(1).every((row) => row[index].trim() === ''),
      `${column} values must remain blank until verified`,
    );
  }
});

test('Task 7 documentation contains no credential-like values', () => {
  const files = Object.values(paths);
  for (const file of files) {
    assert.ok(existsSync(file), `${file.pathname} must exist before sensitive-value checks`);
  }
  const contents = files.map((file) => readFileSync(file, 'utf8')).join('\n');
  const credentialPatterns = [
    /\bgh[pousr]_[A-Za-z0-9]{30,}\b/,
    /\bgithub_pat_[A-Za-z0-9_]{30,}\b/i,
    /\bAKIA[0-9A-Z]{16}\b/,
    /\bAIza[0-9A-Za-z_-]{35}\b/,
    /\bxox[baprs]-[A-Za-z0-9-]{10,}\b/,
    /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
    /\bBearer\s+[A-Za-z0-9._~+/-]{20,}/i,
    /\b(?:password|secret|token)\s*[:=]\s*["']?[A-Za-z0-9+/=_-]{20,}/i,
  ];

  for (const pattern of credentialPatterns) {
    assert.doesNotMatch(contents, pattern);
  }
});
