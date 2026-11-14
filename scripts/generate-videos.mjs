import { mkdir, writeFile, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
import { EdgeTTS } from 'node-edge-tts';

/**
 * Estilo de narração baseado em demos GS reais (ex.: Space Crop / FIAP 2026):
 * - abertura conversacional ("Fala", "Beleza", "Bom")
 * - "a gente" em vez de formalismo de locutor
 * - números falados por extenso (não dígito a dígito)
 * - perguntas curtas e marcadores leves ("né?", "olha", "agora")
 * - fechamento casual ("E é isso")
 * TTS: Antonio mais lento e levemente grave (menos "robô")
 */
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outRoot = path.join(root, 'videos');
const voice = 'pt-BR-AntonioNeural';
const ttsRate = '-15%';
const ttsPitch = '-2Hz';
const ttsVolume = '+0%';
const ffmpeg = findFfmpeg();

const videos = {
  pitch: {
    file: '03-pitch-alerta-cidade.mp4',
    title: 'Pitch — Alerta Cidade',
    scenes: [
      {
        title: 'Alerta Cidade',
        body: 'Eduardo de Oliveira Nistal — RM94524\nPitch CitizenTech · Global Solution 2026',
        narration:
          'Fala. Eu sou o Eduardo de Oliveira Nistal, RM noventa e quatro mil quinhentos e vinte e quatro. Esse aqui é o pitch do Alerta Cidade, projeto solo da Global Solution.'
      },
      {
        title: 'O problema',
        body: 'Informação pública de chuva está dispersa e pode ser difícil de interpretar antes de um deslocamento.',
        narration:
          'A ideia é bem direta. A gente sabe que tem dado público de chuva por aí, mas ele fica espalhado e às vezes é difícil de interpretar antes de sair de casa. Então a pergunta que a gente se fez foi: e se a gente organizasse isso de um jeito simples, mostrando de onde veio o dado e até onde ele vai?'
      },
      {
        title: 'Evidência pública',
        body: 'Open-Meteo · ponto −23,55 / −46,63\nConsulta 14/11/2026 · precipitação prevista 0,10 mm',
        narration:
          'Como evidência pública, a gente consultou a Open-Meteo pra São Paulo. No dia quatorze de novembro de dois mil e vinte e seis, no ponto de demonstração, a precipitação prevista foi de zero vírgula um milímetro. Depois disso, a gente encaminha pra canais oficiais, tipo Defesa Civil. Olha: a previsão não confirma alagamento e não substitui autoridade.'
      },
      {
        title: 'Proposta de valor',
        body: 'Organizar dados públicos com fonte e horário\nEncaminhar a canais oficiais\nSem rotas e sem alerta oficial',
        narration:
          'O Alerta Cidade organiza informação pública em linguagem simples, mostra a fonte, o horário da atualização, e aponta o caminho oficial. A gente não recomenda rota, não emite alerta oficial e não inventa certeza onde o dado não chega.'
      },
      {
        title: 'MVP em uso',
        body: 'Repo: github.com/eduardonistal/gs-citizentech-alerta-cidade\nMVP local e túnel público para demonstração',
        narration:
          'O MVP já tá no GitHub público. Ele mostra status por área, fonte, horário, e deixa a gente perguntar pra base local com citação. Na demo, a gente usa dado público ou lote que a automação mesmo ingeriu.'
      },
      {
        title: 'Modelo de negócio',
        body: 'Usuários: cidadãos\nCompradores potenciais: municípios e consórcios\nHipótese: acesso básico gratuito + serviço institucional',
        narration:
          'Quem usa, na hipótese, é o cidadão. Quem poderia comprar depois seriam municípios ou consórcios. O caminho é validar com usuário e órgão, desenhar um piloto pequeno, e só então falar de contratação. A gente ainda não tem preço validado nem comprador fechado, e isso a gente deixa explícito.'
      },
      {
        title: 'Indicadores e ODS',
        body: 'ODS 11 — Cidades sustentáveis\nODS 13 — Ação climática\nIndicadores: disponibilidade, compreensão e encaminhamento',
        narration:
          'Tematicamente a gente se alinha aos ODS onze e treze. Os indicadores que a gente planeja medir são bem práticos: a fonte ficou disponível? a pessoa entendeu o aviso? e ela foi encaminhada pro canal oficial? Ainda não tem linha de base nem impacto medido.'
      },
      {
        title: 'Pedido',
        body: 'Validar com cidadãos e instituições\num piloto delimitado e seguro',
        narration:
          'O pedido é simples: conversar com usuários e instituições interessadas pra desenhar e avaliar um piloto delimitado e seguro, sem presumir parceria. E é isso. Obrigado.'
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
        narration:
          'Fala. Eu sou o Eduardo, RM noventa e quatro mil quinhentos e vinte e quatro. Agora a gente vai ver o pedaço de IA generativa do Alerta Cidade, rodando com modelo local.'
      },
      {
        title: 'Três configurações',
        body: 'Baseline sem contexto\nRAG com base curada\nAgente especializado de prevenção',
        narration:
          'A gente compara o mesmo modelo em três modos. Baseline sem contexto. RAG puxando trechos da base. E um agente mais especializado em prevenção. A ideia é mostrar a diferença na prática, né?'
      },
      {
        title: 'Resultado verificado',
        body: 'Modelo qwen2.5:7b\nTask compliance: baseline 0,333 · RAG 1,000 · Agente 1,000\nRecall@3 da recuperação = 1,000',
        narration:
          'Na rodada verificada com o Qwen dois ponto cinco de sete bilhões, o baseline ficou em cerca de trinta e três por cento de conformidade. Já o RAG e o agente chegaram a cem por cento. E o recall na posição três da recuperação lexical também fechou em cem por cento.'
      },
      {
        title: 'Recusa segura',
        body: 'Perguntas sem evidência são recusadas\nEx.: população de bairro e rota de fuga',
        narration:
          'Quando a pergunta não tem evidência na base, tipo população exata de bairro ou rota de fuga, a gente recusa. Sem inventar. Sem citação falsa. Isso respeita a LGPD e os limites do produto.'
      },
      {
        title: 'Repositório',
        body: 'github.com/eduardonistal/gs-citizentech-alerta-cidade\nbase/, avaliacao/, notebooks/',
        narration:
          'Código, base, casos de teste, notebook e os erros reais que a gente corrigiu estão no repositório público. E um ponto importante: a IA não substitui orientação oficial. E é isso.'
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
        narration:
          'Beleza. Eu sou o Eduardo, RM noventa e quatro mil quinhentos e vinte e quatro. Esse componente é experimental: ele procura indício visual de água sobre a via, pra revisão humana.'
      },
      {
        title: 'Limites',
        body: 'Não confirma alagamento\nNão emite alerta oficial\nNão recomenda rotas',
        narration:
          'Olha os limites, porque isso importa. O modelo não confirma alagamento, não emite alerta oficial e não recomenda rota. Se a confiança fica baixa, o caso vai pra pessoa revisar.'
      },
      {
        title: 'Treino executado',
        body: 'Pipeline HSV sintético local\nPrecisão 1,000 · Recall 1,000 · F1 1,000\nAmostras declaradas sintéticas',
        narration:
          'A gente rodou um treino leve de limiares HSV em amostras sintéticas geradas localmente. Precisão, recall e F1 fecharam em um. E essas amostras a gente declara abertamente: não são fotos reais de rua.'
      },
      {
        title: 'Próximo passo',
        body: 'Dataset fotográfico licenciado\nYOLO com pesos locais\nVídeo de inferência em mídia autorizada',
        narration:
          'O caminho YOLO já tá preparado pra quando a gente tiver dataset fotográfico licenciado e pesos locais. Até lá, o resultado sintético fica rotulado como sintético. Sem exagero. E é isso.'
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
        narration:
          'Fala. Eu sou o Eduardo, RM noventa e quatro mil quinhentos e vinte e quatro. Agora a gente mostra o fluxo de RPA: coletar previsão pública, validar, e publicar de forma rastreável no MVP.'
      },
      {
        title: 'Regras do fluxo',
        body: 'Decisão por data válida\nRepetição sobre a coleção daily\nExceções sem falha silenciosa',
        narration:
          'O fluxo decide por data válida, percorre a coleção diária, rejeita o que não fecha, e registra falha sem esconder erro e sem vazar segredo. Nada de falha silenciosa.'
      },
      {
        title: 'Execução verificada',
        body: '14/11/2026\nsuccess=true · published=3\nLog sanitizado em logs/',
        narration:
          'No dia quatorze de novembro de dois mil e vinte e seis, a automação publicou três alertas no MVP com sucesso. O log ficou sanitizado: sem token, sem cabeçalho sensível.'
      },
      {
        title: 'Integração',
        body: 'POST /api/alerts/import\nGET /api/alerts no MVP\nn8n + runner Node',
        narration:
          'O MVP consome isso pela API autenticada. A gente mantém o caminho n8n e o runner em Node como alternativas equivalentes e documentadas. Ciclo fechado. E é isso.'
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

/** Pequenas pausas naturais que o Edge TTS respeita melhor que texto corrido. */
function humanizeForTts(text) {
  return text
    .replace(/\s+/g, ' ')
    .replace(/\s([?!])/g, '$1')
    .replace(/\.(\s+)/g, '.$1')
    .trim();
}

async function makeAudio(text, outPath) {
  const tts = new EdgeTTS({
    voice,
    lang: 'pt-BR',
    outputFormat: 'audio-24khz-96kbitrate-mono-mp3',
    rate: ttsRate,
    pitch: ttsPitch,
    volume: ttsVolume,
    timeout: 90000
  });
  await tts.ttsPromise(humanizeForTts(text), outPath);
}

async function sceneToClip(workDir, index, scene) {
  const slide = path.join(workDir, `slide-${index}.png`);
  const audio = path.join(workDir, `audio-${index}.mp3`);
  const padded = path.join(workDir, `audio-${index}-pad.mp3`);
  const clip = path.join(workDir, `clip-${index}.mp4`);
  await makeSlide(slide, scene.title, scene.body);
  await makeAudio(scene.narration, audio);
  // Respiro curto no começo/fim (estilo demo ao vivo, sem cortar a fala)
  await run(ffmpeg, [
    '-y',
    '-i', audio,
    '-af', 'apad=pad_dur=0.35,adelay=250|250',
    '-c:a', 'libmp3lame',
    '-b:a', '192k',
    padded
  ]);
  await run(ffmpeg, [
    '-y',
    '-loop', '1',
    '-i', slide,
    '-i', padded,
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
  let cursor = 0;
  const lines = ['WEBVTT', ''];
  scenes.forEach((scene, index) => {
    const start = cursor;
    const end = cursor + Math.max(5, Math.round(scene.narration.split(/\s+/).length / 2.0));
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

Gerados em ${new Date().toISOString()} com narração \`pt-BR-AntonioNeural\` (Edge TTS).

**Estilo:** baseado em demos GS conversacionais (abertura casual, números por extenso, ritmo mais lento, pausas curtas). Rate \`${ttsRate}\`, pitch \`${ttsPitch}\`.

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
console.log(JSON.stringify({ ok: true, files: summary, voice, ttsRate, ttsPitch }, null, 2));
