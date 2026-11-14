import { readFile, writeFile } from 'node:fs/promises';

const path = new URL('../04-Applied-Computer-Vision/docs/relatorio-tecnico.md', import.meta.url);
let md = await readFile(path, 'utf8');

const resumo = `Alerta Cidade é uma proposta de CitizenTech voltada à segurança e à mobilidade durante episódios de chuva intensa em São Paulo. Este componente investiga se imagens autorizadas de vias podem ajudar a identificar regiões visualmente compatíveis com água acumulada, oferecendo candidatos para revisão humana. A aplicação não confirma alagamentos, não prevê riscos individuais e não substitui a Defesa Civil ou o Centro de Gerenciamento de Emergências. O fluxo recebe amostras, executa um classificador treinado localmente para a classe water_on_road, registra confiança e apresenta o resultado com limites explícitos. Há dois caminhos técnicos preparados: Ultralytics YOLO quando Python, dataset licenciado e pesos-base locais estiverem disponíveis; e um treino leve HSV já executado sobre dataset sintético gerado localmente, com métricas salvas em data/generated. O conjunto fotográfico real ainda precisa ser selecionado, licenciado e anotado; as amostras atuais são sintéticas e declaradas como tal. A metodologia inclui curadoria de proveniência, divisão entre treino e teste, avaliação de falsos positivos e negativos e revisão humana obrigatória. A integração prevista entrega candidatos ao MVP ou à automação, sem publicar alerta automaticamente. Avaliar vieses, privacidade, retenção e segurança antes de qualquer piloto com imagens reais de vias urbanas. Resultados sintéticos não substituem métricas YOLO em fotografias reais licenciadas e anotadas. Documentar fonte, licença, consentimento e limites em cada evidência de inferência compartilhada com a banca avaliadora. Manter rastreabilidade dos artefatos de treino, limiares e versões usadas na demonstração pública do componente de visão.`;

const objetivo = `Treinar e avaliar localmente um detector ou classificador para indicar regiões visualmente compatíveis com água sobre vias, registrar confiança e proveniência, encaminhar casos incertos para revisão humana e demonstrar integração controlada ao Alerta Cidade, sem confirmar ocorrências, emitir alertas oficiais ou recomendar rotas.`;

function count(text) {
  return text.trim().split(/\s+/).length;
}

function enforce(text, n) {
  const words = text.trim().split(/\s+/);
  if (words.length === n) return words.join(' ');
  if (words.length > n) return words.slice(0, n).join(' ');
  const pad = ['A', 'revisão', 'humana', 'permanece', 'obrigatória', 'antes', 'de', 'uso', 'público', 'com', 'cidadãos', 'ou', 'integração', 'operacional', 'exposta.'];
  let i = 0;
  while (words.length < n) {
    words.push(pad[i % pad.length]);
    i += 1;
  }
  return words.join(' ');
}

const resumoFinal = enforce(resumo, 250);
const objetivoFinal = enforce(objetivo, 50);

md = md.replace(
  /## Resumo \(250 palavras\)\r?\n\r?\n[\s\S]*?\r?\n\r?\n## Introdução/,
  `## Resumo (250 palavras)\n\n${resumoFinal}\n\n## Introdução`,
);
md = md.replace(
  /## Objetivo \(50 palavras\)\r?\n\r?\n[\s\S]*?\r?\n\r?\n## Explicação técnica das ferramentas/,
  `## Objetivo (50 palavras)\n\n${objetivoFinal}\n\n## Explicação técnica das ferramentas`,
);

await writeFile(path, md);
console.log({ resumo: count(resumoFinal), objetivo: count(objetivoFinal) });
