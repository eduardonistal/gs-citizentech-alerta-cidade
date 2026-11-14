import { mkdir, writeFile, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
import { EdgeTTS } from 'node-edge-tts';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outRoot = path.join(root, 'videos');
const voice = 'pt-BR-FranciscaNeural';
const ffmpeg = findFfmpeg();

const videos = {
  pitch: {
    file: '03-pitch-alerta-cidade.mp4',
    title: 'Pitch — Alerta Cidade',
    scenes: [
      {
        title: 'Alerta Cidade',
        body: 'Eduardo de Oliveira Nistal — RM94524\nPitch CitizenTech · Global Solution 2026',
        narration: 'Olá. Sou Eduardo de Oliveira Nistal, RM nove quatro cinco dois quatro, único integrante do projeto Alerta Cidade.'
      },
      {
        title: 'O problema',
        body: 'Informação pública de chuva está dispersa e pode ser difícil de interpretar antes de um deslocamento.',
        narration: 'Alerta Cidade ajuda pessoas a encontrar e interpretar informação pública sobre chuva, mostrando origem, horário e limites do dado. A previsão não confirma alagamento e não substitui a Defesa Civil.'
      },
      {
        title: 'Evidência pública',
        body: 'Open-Meteo · ponto −23,55 / −46,63\nConsulta 14/11/2026 · precipitação prevista 0,10 mm',
        narration: 'Como evidência pública, consultei a API Open-Meteo para São Paulo. Em quatorze de novembro de dois mil e vinte e seis, a precipitação prevista no ponto demonstrativo foi de zero vírgula dez milímetros. Em seguida encaminhamos a canais oficiais, como a Defesa Civil.'
      },
      {
        title: 'Proposta de valor',
        body: 'Organizar dados públicos com fonte e horário\nEncaminhar a canais oficiais\nSem rotas e sem alerta oficial',
        narration: 'A proposta organiza informação pública em linguagem simples, mostra de onde veio e quando foi atualizada, e encaminha aos canais oficiais. Não confirma alagamentos, não recomenda rotas e não substitui autoridades.'
      },
      {
        title: 'MVP em uso',
        body: 'Repo: github.com/eduardonistal/gs-citizentech-alerta-cidade\nMVP local e túnel público para demonstração',
        narration: 'O MVP Alerta Cidade está no repositório público no GitHub. Ele mostra status por área, fonte, horário e permite perguntas à base local com citações. A demonstração usa dados públicos ou lotes ingeridos pela automação.'
      },
      {
        title: 'Modelo de negócio',
        body: 'Usuários: cidadãos\nCompradores potenciais: municípios e consórcios\nHipótese: acesso básico gratuito + serviço institucional',
        narration: 'Os cidadãos são os usuários previstos. Os compradores potenciais seriam instituições, como municípios ou consórcios. O caminho é validar com usuários e órgãos, desenhar um piloto e só então avaliar contratação. Não temos preço validado nem comprador confirmado.'
      },
      {
        title: 'Indicadores e ODS',
        body: 'ODS 11 — Cidades sustentáveis\nODS 13 — Ação climática\nIndicadores: disponibilidade, compreensão e encaminhamento',
        narration: 'A proposta se alinha tematicamente aos ODS onze e treze. Os indicadores planejados incluem disponibilidade da fonte, compreensão dos avisos e encaminhamento oficial. Ainda não há linha de base nem impacto medido.'
      },
      {
        title: 'Pedido',
        body: 'Validar com cidadãos e instituições\num piloto delimitado e seguro',
        narration: 'Nosso pedido é conversar com usuários e instituições interessadas para desenhar e avaliar um piloto, sem presumir parceria. Obrigado.'
      }
    ]
  },
  genai: {
    file: '01-generative-ai-demo.mp4',
    title: 'Generative AI — demonstração',
    scenes: [
      {
        title: 'IA Generativa local',
        body: 'Alerta Cidade · Ollama + RAG + Agente\nEduardo de Oliveira Nistal — RM94524',
        narration: 'Sou Eduardo de Oliveira Nistal, RM nove quatro cinco dois quatro. Esta é a demonstração do componente de inteligência artificial generativa do Alerta Cidade, rodando com modelo local.'
      },
      {
        title: 'Três configurações',
        body: 'Baseline sem contexto\nRAG com base curada\nAgente especializado de prevenção',
        narration: 'Comparamos o mesmo modelo em três modos: baseline sem contexto, RAG com recuperação de trechos e agente especializado de prevenção.'
      },
      {
        title: 'Resultado verificado',
        body: 'Modelo qwen2.5:7b\nTask compliance: baseline 0,333 · RAG 1,000 · Agente 1,000\nRecall@3 da recuperação = 1,000',
        narration: 'Na rodada verificada com qwen dois ponto cinco sete bê, o baseline obteve conformidade de zero vírgula três três três. RAG e agente chegaram a um ponto zero. O recall na posição três da recuperação lexical foi um ponto zero.'
      },
      {
        title: 'Recusa segura',
        body: 'Perguntas sem evidência são recusadas\nEx.: população de bairro e rota de fuga',
        narration: 'Perguntas sem evidência na base, como população exata de bairro ou rota de fuga, são recusadas com citações vazias, em conformidade com a LGPD e com os limites do produto.'
      },
      {
        title: 'Repositório',
        body: 'github.com/eduardonistal/gs-citizentech-alerta-cidade\nbase/, avaliacao/, notebooks/',
        narration: 'Código, base de conhecimento, casos de teste, notebook e erros reais estão no repositório público. A IA não substitui orientação oficial.'
      }
    ]
  },
  vision: {
    file: '04-computer-vision-demo.mp4',
    title: 'Computer Vision — demonstração',
    scenes: [
      {
        title: 'Visão computacional',
        body: 'Detector experimental water_on_road\nEduardo de Oliveira Nistal — RM94524',
        narration: 'Sou Eduardo de Oliveira Nistal, RM nove quatro cinco dois quatro. Este componente experimental procura indícios visuais de água sobre via para revisão humana.'
      },
      {
        title: 'Limites',
        body: 'Não confirma alagamento\nNão emite alerta oficial\nNão recomenda rotas',
        narration: 'O modelo não confirma alagamento, não emite alerta oficial e não recomenda rotas. Casos de baixa confiança vão para revisão humana.'
      },
      {
        title: 'Treino executado',
        body: 'Pipeline HSV sintético local\nPrecisão 1,000 · Recall 1,000 · F1 1,000\nAmostras declaradas sintéticas',
        narration: 'Executamos um treino leve de limiares HSV sobre amostras sintéticas geradas localmente, com precisão, recall e F1 iguais a um. Essas amostras não são fotografias reais.'
      },
      {
        title: 'Próximo passo',
        body: 'Dataset fotográfico licenciado\nYOLO com pesos locais\nVídeo de inferência em mídia autorizada',
        narration: 'O caminho YOLO permanece preparado para quando houver dataset fotográfico licenciado e pesos locais. Até lá, os resultados sintéticos ficam explicitamente rotulados.'
      }
    ]
  },
  rpa: {
    file: '05-rpa-demo.mp4',
    title: 'RPA — demonstração',
    scenes: [
      {
        title: 'Automação RPA',
        body: 'Coleta Open-Meteo → validação → MVP\nEduardo de Oliveira Nistal — RM94524',
        narration: 'Sou Eduardo de Oliveira Nistal, RM nove quatro cinco dois quatro. Este fluxo automatiza a coleta de previsão pública e a publicação rastreável no MVP.'
      },
      {
        title: 'Regras do fluxo',
        body: 'Decisão por data válida\nRepetição sobre a coleção daily\nExceções sem falha silenciosa',
        narration: 'O fluxo aplica decisão sobre cada data, percorre a coleção de previsões, rejeita itens inválidos e registra falhas sem expor segredos.'
      },
      {
        title: 'Execução verificada',
        body: '14/11/2026\nsuccess=true · published=3\nLog sanitizado em logs/',
        narration: 'Em quatorze de novembro de dois mil e vinte e seis, a automação publicou três alertas no MVP com sucesso. O log sanitizado não contém token nem cabeçalhos sensíveis.'
      },
      {
        title: 'Integração',
        body: 'POST /api/alerts/import\nGET /api/alerts no MVP\nn8n + runner Node',
        narration: 'O resultado é consumido pelo MVP via API autenticada. Mantemos o workflow n8n e o runner Node como caminhos equivalentes e documentados.'
      }
    ]
  }
};

function findFfmpeg() {
  const candidates = [
    process.env.FFMPEG_PATH,
    'ffmpeg',
    path.join(process.env.LOCALAPPDATA ?? '', 'Microsoft', 'WinGet', 'Packages', 'Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe', 'ffmpeg-9.0.2-full_build', 'bin', 'ffmpeg.exe')
  ].filter(Boolean);
  for (const candidate of candidates) {
    if (candidate === 'ffmpeg' || existsSync(candidate)) return candidate;
  }
  // fallback search common winget path pattern later via PATH
  return 'ffmpeg';
}

function run(command, args, opts = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: ['ignore', 'pipe', 'pipe'], ...opts });
    let stderr = '';
    child.stderr.on('data', chunk => { stderr += chunk.toString(); });
    child.on('error', reject);
    child.on('close', code => {
      if (code === 0) resolve();
      else reject(new Error(`${command} exited ${code}\n${stderr.slice(-1000)}`));
    });
  });
}

async function makeSlide(outPath, title, body) {
  await run('powershell.exe', [
    '-NoProfile', '-ExecutionPolicy', 'Bypass',
    '-File', path.join(root, 'scripts', 'make-slide.ps1'),
    '-OutPath', outPath,
    '-Title', title,
    '-Body', body
  ]);
}

async function makeAudio(text, outPath) {
  const tts = new EdgeTTS({ voice, lang: 'pt-BR', timeout: 60000 });
  await tts.ttsPromise(text, outPath);
}

async function sceneToClip(workDir, index, scene) {
  const slide = path.join(workDir, `slide-${index}.png`);
  const audio = path.join(workDir, `audio-${index}.mp3`);
  const clip = path.join(workDir, `clip-${index}.mp4`);
  await makeSlide(slide, scene.title, scene.body);
  await makeAudio(scene.narration, audio);
  await run(ffmpeg, [
    '-y',
    '-loop', '1',
    '-i', slide,
    '-i', audio,
    '-c:v', 'libx264',
    '-tune', 'stillimage',
    '-c:a', 'aac',
    '-b:a', '192k',
    '-pix_fmt', 'yuv420p',
    '-shortest',
    clip
  ]);
  return clip;
}

async function buildVideo(key, config) {
  const workDir = path.join(outRoot, `_work_${key}`);
  await rm(workDir, { recursive: true, force: true });
  await mkdir(workDir, { recursive: true });
  const clips = [];
  for (let i = 0; i < config.scenes.length; i += 1) {
    console.log(`[${key}] cena ${i + 1}/${config.scenes.length}: ${config.scenes[i].title}`);
    clips.push(await sceneToClip(workDir, i, config.scenes[i]));
  }
  const listFile = path.join(workDir, 'list.txt');
  await writeFile(listFile, clips.map(c => `file '${c.replaceAll('\\', '/')}'`).join('\n'));
  const outFile = path.join(outRoot, config.file);
  await run(ffmpeg, [
    '-y',
    '-f', 'concat',
    '-safe', '0',
    '-i', listFile,
    '-c', 'copy',
    outFile
  ]);
  await writeFile(path.join(outRoot, `${key}-legendas.vtt`), buildVtt(config.scenes));
  console.log(`[${key}] pronto: ${outFile}`);
  return outFile;
}

function buildVtt(scenes) {
  // Approximate equal parts; final player can use audio-driven timing.
  let cursor = 0;
  const lines = ['WEBVTT', ''];
  scenes.forEach((scene, index) => {
    const start = cursor;
    const end = cursor + Math.max(4, Math.round(scene.narration.split(/\s+/).length / 2.2));
    lines.push(String(index + 1));
    lines.push(`${toVtt(start)} --> ${toVtt(end)}`);
    lines.push(scene.narration);
    lines.push('');
    cursor = end;
  });
  return lines.join('\n');
}

function toVtt(seconds) {
  const h = String(Math.floor(seconds / 3600)).padStart(2, '0');
  const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
  const s = String(Math.floor(seconds % 60)).padStart(2, '0');
  return `${h}:${m}:${s}.000`;
}

await mkdir(outRoot, { recursive: true });
const summary = [];
for (const [key, config] of Object.entries(videos)) {
  summary.push(await buildVideo(key, config));
}
await writeFile(path.join(outRoot, 'README.md'), `# Vídeos gerados automaticamente

Gerados em ${new Date().toISOString()} com narração \`pt-BR-FranciscaNeural\` (Edge TTS) e slides locais.

## Arquivos

| Vídeo | Arquivo | Disciplina |
|---|---|---|
| Pitch | [03-pitch-alerta-cidade.mp4](./03-pitch-alerta-cidade.mp4) | Business Intelligence & Startup |
| GenAI | [01-generative-ai-demo.mp4](./01-generative-ai-demo.mp4) | Generative AI for Engineering |
| Visão | [04-computer-vision-demo.mp4](./04-computer-vision-demo.mp4) | Applied Computer Vision |
| RPA | [05-rpa-demo.mp4](./05-rpa-demo.mp4) | Robotic Process Automation |

## Regenerar

\`\`\`powershell
npm run generate-videos
\`\`\`

## Publicação YouTube

Faça upload como **não listado**, teste o link em janela anônima e cole as URLs nos READMEs/Teams.
`);
console.log(JSON.stringify({ ok: true, files: summary }, null, 2));
