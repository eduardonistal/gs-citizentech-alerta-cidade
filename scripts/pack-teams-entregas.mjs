import { mkdir, cp, writeFile, readFile, rm, access } from 'node:fs/promises';
import { createWriteStream, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outRoot = path.join(root, 'entregas-teams');
const repo = 'https://github.com/eduardonistal/gs-citizentech-alerta-cidade';
const release = `${repo}/releases/tag/videos-pt-br-2026-11-14`;
const mvp = 'https://silver-carrots-throw.loca.lt';

const packs = [
  {
    id: '01-Generative-AI-for-Engineering',
    title: 'Generative AI for Engineering',
    files: [
      ['01-Generative-AI-for-Engineering/docs/relatorio-tecnico.pdf', 'relatorio-tecnico.pdf'],
      ['01-Generative-AI-for-Engineering/docs/relatorio-tecnico.md', 'relatorio-tecnico.md'],
      ['01-Generative-AI-for-Engineering/README.md', 'README.md'],
      ['01-Generative-AI-for-Engineering/avaliacao/results.json', 'avaliacao-results.json'],
      ['01-Generative-AI-for-Engineering/avaliacao/erros-reais.md', 'erros-reais.md'],
      ['01-Generative-AI-for-Engineering/notebooks/benchmark.ipynb', 'benchmark.ipynb'],
      ['videos/01-generative-ai-demo.mp4', 'video-demo.mp4'],
      ['videos/genai-legendas.vtt', 'video-legendas.vtt']
    ],
    links: {
      repositorio: repo,
      video_local: 'video-demo.mp4',
      video_release: `${repo}/releases/download/videos-pt-br-2026-11-14/01-generative-ai-demo.mp4`,
      youtube: '[COLE URL NÃO LISTADA]',
      mvp
    }
  },
  {
    id: '02-Big-Data-Architecture-Data-Integration',
    title: 'Big Data Architecture & Data Integration',
    files: [
      ['02-Big-Data-Architecture-Data-Integration/docs/relatorio-tecnico.pdf', 'relatorio-tecnico.pdf'],
      ['02-Big-Data-Architecture-Data-Integration/docs/relatorio-tecnico.md', 'relatorio-tecnico.md'],
      ['02-Big-Data-Architecture-Data-Integration/docs/checklist-capturas.md', 'checklist-capturas.md'],
      ['02-Big-Data-Architecture-Data-Integration/README.md', 'README.md'],
      ['02-Big-Data-Architecture-Data-Integration/dags/gs_coleta_compat.py', 'dag-gs_coleta.py'],
      ['02-Big-Data-Architecture-Data-Integration/data/coleta-evidencia.json', 'coleta-evidencia.json']
    ],
    extrasDir: [
      ['02-Big-Data-Architecture-Data-Integration/chegada', 'chegada'],
      ['02-Big-Data-Architecture-Data-Integration/evidencias', 'evidencias']
    ],
    links: { repositorio: repo, mvp, youtube: 'N/A (disciplina sem vídeo obrigatório no mesmo formato)' }
  },
  {
    id: '03-Business-Intelligence-Startup-Development',
    title: 'Business Intelligence & Startup Development',
    files: [
      ['03-Business-Intelligence-Startup-Development/roteiro-pitch.md', 'roteiro-pitch.md'],
      ['03-Business-Intelligence-Startup-Development/docs/modelo-negocio.md', 'modelo-negocio.md'],
      ['03-Business-Intelligence-Startup-Development/README.md', 'README.md'],
      ['videos/03-pitch-alerta-cidade.mp4', 'pitch-alerta-cidade.mp4'],
      ['videos/pitch-legendas.vtt', 'pitch-legendas.vtt']
    ],
    links: {
      repositorio: repo,
      mvp,
      video_local: 'pitch-alerta-cidade.mp4',
      video_release: `${repo}/releases/download/videos-pt-br-2026-11-14/03-pitch-alerta-cidade.mp4`,
      youtube: '[COLE URL NÃO LISTADA — exigência do PDF]'
    }
  },
  {
    id: '04-Applied-Computer-Vision',
    title: 'Applied Computer Vision',
    files: [
      ['04-Applied-Computer-Vision/docs/relatorio-tecnico.pdf', 'relatorio-tecnico.pdf'],
      ['04-Applied-Computer-Vision/docs/relatorio-tecnico.md', 'relatorio-tecnico.md'],
      ['04-Applied-Computer-Vision/README.md', 'README.md'],
      ['04-Applied-Computer-Vision/data/DATASET.md', 'DATASET.md'],
      ['videos/04-computer-vision-demo.mp4', 'video-demo.mp4'],
      ['videos/vision-legendas.vtt', 'video-legendas.vtt']
    ],
    extrasDir: [
      ['04-Applied-Computer-Vision/data/photos', 'dataset-photos'],
      ['04-Applied-Computer-Vision/data/generated', 'treino-sintetico']
    ],
    links: {
      repositorio: repo,
      video_local: 'video-demo.mp4',
      video_release: `${repo}/releases/download/videos-pt-br-2026-11-14/04-computer-vision-demo.mp4`,
      youtube: '[COLE URL NÃO LISTADA]'
    }
  },
  {
    id: '05-Robotic-Process-Automation',
    title: 'Robotic Process Automation',
    files: [
      ['05-Robotic-Process-Automation/docs/relatorio-tecnico.pdf', 'relatorio-tecnico.pdf'],
      ['05-Robotic-Process-Automation/docs/relatorio-tecnico.md', 'relatorio-tecnico.md'],
      ['05-Robotic-Process-Automation/README.md', 'README.md'],
      ['05-Robotic-Process-Automation/docs/processo.bpmn', 'processo.bpmn'],
      ['videos/05-rpa-demo.mp4', 'video-demo.mp4'],
      ['videos/rpa-legendas.vtt', 'video-legendas.vtt']
    ],
    extrasDir: [['05-Robotic-Process-Automation/logs', 'logs']],
    links: {
      repositorio: repo,
      mvp,
      video_local: 'video-demo.mp4',
      video_release: `${repo}/releases/download/videos-pt-br-2026-11-14/05-rpa-demo.mp4`,
      youtube: '[COLE URL NÃO LISTADA]'
    }
  },
  {
    id: '06-Secure-DevOps-Tools-Cloud-Computing',
    title: 'Secure DevOps Tools & Cloud Computing',
    files: [
      ['06-Secure-DevOps-Tools-Cloud-Computing/docs/relatorio-tecnico.pdf', 'relatorio-tecnico.pdf'],
      ['06-Secure-DevOps-Tools-Cloud-Computing/docs/relatorio-tecnico.md', 'relatorio-tecnico.md'],
      ['06-Secure-DevOps-Tools-Cloud-Computing/docs/checklist-evidencias.md', 'checklist-evidencias.md'],
      ['06-Secure-DevOps-Tools-Cloud-Computing/docs/runbook.md', 'runbook.md'],
      ['06-Secure-DevOps-Tools-Cloud-Computing/README.md', 'README.md'],
      ['06-Secure-DevOps-Tools-Cloud-Computing/compose.yaml', 'compose.yaml']
    ],
    extrasDir: [
      ['06-Secure-DevOps-Tools-Cloud-Computing/evidencias', 'evidencias'],
      ['06-Secure-DevOps-Tools-Cloud-Computing/terraform', 'terraform']
    ],
    links: { repositorio: repo, mvp, teto_custo: 'R$ 0' }
  }
];

async function exists(p) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

async function copyIfExists(from, to) {
  if (!(await exists(from))) {
    console.warn(`skip missing: ${from}`);
    return false;
  }
  await mkdir(path.dirname(to), { recursive: true });
  await cp(from, to, { recursive: true });
  return true;
}

function zipFolder(folder, zipPath) {
  return new Promise((resolve, reject) => {
    const ps = `
Compress-Archive -Path '${folder}\\*' -DestinationPath '${zipPath}' -Force
`;
    const child = spawn('powershell.exe', ['-NoProfile', '-Command', ps], { stdio: 'inherit' });
    child.on('exit', (code) => (code === 0 ? resolve() : reject(new Error(`zip exit ${code}`))));
  });
}

await rm(outRoot, { recursive: true, force: true });
await mkdir(outRoot, { recursive: true });

const summary = [];

for (const pack of packs) {
  const dir = path.join(outRoot, pack.id);
  await mkdir(dir, { recursive: true });

  for (const [src, dest] of pack.files) {
    await copyIfExists(path.join(root, src), path.join(dir, dest));
  }
  for (const [src, dest] of pack.extrasDir ?? []) {
    await copyIfExists(path.join(root, src), path.join(dir, dest));
  }

  const entrega = `# Entrega Teams — ${pack.title}

**Aluno:** Eduardo de Oliveira Nistal — RM94524  
**Produto:** Alerta Cidade  
**Prazo PDF:** 19/11/2026 23h55  

## Links

${Object.entries(pack.links)
  .map(([k, v]) => `- **${k}:** ${v}`)
  .join('\n')}

## Conteúdo deste ZIP

Arquivos preparados para anexar/enviar no Teams desta disciplina.
Se o portal pedir só link, use o repositório + YouTube (quando exigido).

## Release de vídeos

${release}
`;
  await writeFile(path.join(dir, 'ENTREGA.md'), entrega, 'utf8');
  await writeFile(path.join(dir, 'LINKS.json'), JSON.stringify({ disciplina: pack.title, ...pack.links, release }, null, 2), 'utf8');

  const zipPath = path.join(outRoot, `${pack.id}.zip`);
  await zipFolder(dir, zipPath);
  summary.push({ id: pack.id, zip: zipPath });
  console.log(`OK ${pack.id}`);
}

await writeFile(path.join(outRoot, 'README.md'), `# Pacotes para Teams

Gerado automaticamente. Cada \`.zip\` contém o material da disciplina correspondente.

${summary.map((s) => `- \`${path.basename(s.zip)}\``).join('\n')}

Repo: ${repo}
`, 'utf8');

console.log(JSON.stringify({ ok: true, outRoot, summary }, null, 2));
