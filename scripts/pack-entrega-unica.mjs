import { mkdir, cp, writeFile, rm, access, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outRoot = path.join(root, 'entrega-final');
const staging = path.join(outRoot, '_staging');
const zipName = 'AlertaCidade-GS-RM94524-ENTREGA-COMPLETA.zip';
const repo = 'https://github.com/eduardonistal/gs-citizentech-alerta-cidade';
const release = `${repo}/releases/tag/videos-pt-br-2026-11-14`;
const mvp = process.env.GS_MVP_URL || 'https://analyzed-jun-the-musician.trycloudflare.com';

async function exists(p) {
  try { await access(p); return true; } catch { return false; }
}

async function copyIfExists(from, to) {
  if (!(await exists(from))) {
    console.warn(`skip: ${from}`);
    return false;
  }
  await mkdir(path.dirname(to), { recursive: true });
  await cp(from, to, { recursive: true });
  return true;
}

function run(cmd, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { stdio: 'inherit', shell: true });
    child.on('exit', (code) => (code === 0 ? resolve() : reject(new Error(`${cmd} exit ${code}`))));
  });
}

function zipFolder(folder, zipPath) {
  return new Promise((resolve, reject) => {
    const ps = `Compress-Archive -Path '${folder}\\*' -DestinationPath '${zipPath}' -Force`;
    const child = spawn('powershell.exe', ['-NoProfile', '-Command', ps], { stdio: 'inherit' });
    child.on('exit', (code) => (code === 0 ? resolve() : reject(new Error(`zip exit ${code}`))));
  });
}

// 1) regenerar packs por disciplina
console.log('>> pack por disciplina');
await run('node', [path.join(root, 'scripts', 'pack-teams-entregas.mjs')]);

await rm(outRoot, { recursive: true, force: true });
await mkdir(staging, { recursive: true });

const links = {
  aluno: 'Eduardo de Oliveira Nistal — RM94524',
  produto: 'Alerta Cidade',
  prazo: '2026-11-19T23:55:00-03:00',
  repositorio: repo,
  release_videos: release,
  mvp,
  ci: `${repo}/actions`,
  youtube: {
    genai: '[COLE URL NÃO LISTADA]',
    pitch: '[COLE URL NÃO LISTADA]',
    vision: '[COLE URL NÃO LISTADA]',
    rpa: '[COLE URL NÃO LISTADA]',
    nota: 'MP4s estão no ZIP; publique no YouTube se o portal exigir link não listado'
  }
};

await writeFile(path.join(staging, 'LINKS-MESTRE.json'), JSON.stringify(links, null, 2), 'utf8');
await writeFile(
  path.join(staging, 'LEIA-ME.md'),
  `# Alerta Cidade — Entrega completa GS CitizenTech

**Aluno:** Eduardo de Oliveira Nistal — RM94524  
**Prazo:** 19/11/2026 23h55  
**Maker Lab:** excluída  

## Como usar

1. Abra \`empresa/COMECE-AQUI.md\`
2. Abra \`empresa/playbooks/RUBRICA-NOTA-10.md\`
3. Envie no Teams **um pacote por disciplina** (pastas \`01\`…\`06\` ou use os \`.zip\` em \`zips-por-disciplina/\`)

## Conteúdo

| Pasta | Disciplina |
|---|---|
| 01-Generative-AI-for-Engineering | GenAI |
| 02-Big-Data-Architecture-Data-Integration | Big Data |
| 03-Business-Intelligence-Startup-Development | BI & Startup |
| 04-Applied-Computer-Vision | Visão |
| 05-Robotic-Process-Automation | RPA |
| 06-Secure-DevOps-Tools-Cloud-Computing | DevSecOps |
| empresa | Sede / rubrica / organograma |
| videos | MP4s + legendas |
| zips-por-disciplina | Os 6 ZIPs prontos para anexar |

## Links

Ver \`LINKS-MESTRE.json\`.

Repo: ${repo}
`,
  'utf8'
);

// 2) copiar packs
for (const id of [
  '01-Generative-AI-for-Engineering',
  '02-Big-Data-Architecture-Data-Integration',
  '03-Business-Intelligence-Startup-Development',
  '04-Applied-Computer-Vision',
  '05-Robotic-Process-Automation',
  '06-Secure-DevOps-Tools-Cloud-Computing'
]) {
  await copyIfExists(path.join(root, 'entregas-teams', id), path.join(staging, id));
  await copyIfExists(path.join(root, 'entregas-teams', `${id}.zip`), path.join(staging, 'zips-por-disciplina', `${id}.zip`));
}

await copyIfExists(path.join(root, 'empresa'), path.join(staging, 'empresa'));
await copyIfExists(path.join(root, 'videos'), path.join(staging, 'videos'));
await copyIfExists(path.join(root, 'CHECKLIST_ENTREGAS.md'), path.join(staging, 'CHECKLIST_ENTREGAS.md'));
await copyIfExists(path.join(root, 'FICHA_TECNICA_MVP.md'), path.join(staging, 'FICHA_TECNICA_MVP.md'));
await copyIfExists(path.join(root, 'README.md'), path.join(staging, 'README-PRODUTO.md'));

// limpar lixo de vídeo de trabalho
for (const junk of ['_cf-out.txt', '_cf-err.txt', '_tts-test.mp3', '_tts-test-natural.mp3']) {
  const p = path.join(staging, 'videos', junk);
  if (existsSync(p)) await rm(p, { force: true });
}
for (const work of ['_work_genai', '_work_pitch', '_work_rpa', '_work_vision']) {
  const p = path.join(staging, 'videos', work);
  if (existsSync(p)) await rm(p, { recursive: true, force: true });
}

const zipPath = path.join(outRoot, zipName);
await zipFolder(staging, zipPath);

// atalho na Desktop
const desktopZip = path.join(process.env.USERPROFILE || '', 'Desktop', zipName);
try {
  await cp(zipPath, desktopZip);
  console.log(`Desktop: ${desktopZip}`);
} catch (e) {
  console.warn('não copiou para Desktop:', e.message);
}

console.log(JSON.stringify({ ok: true, zipPath, mvp, links }, null, 2));
