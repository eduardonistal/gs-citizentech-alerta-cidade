function normalize(text) {
  return text.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
}

const QUERY_SYNONYMS = {
  orientacao: ['defesa', 'civil', 'oficial', 'cgesp', 'emergencia', 'governo'],
  oficial: ['defesa', 'civil', 'cgesp', 'orientacao', 'gov'],
  consultar: ['defesa', 'civil', 'cgesp', 'orientacao'],
  alagada: ['alagamento', 'precipitacao', 'previsao', 'confirmacao'],
  alagamento: ['alagada', 'precipitacao', 'previsao'],
  precipitacao: ['chuva', 'previsao', 'open-meteo', 'meteorolog'],
  ibge: ['localidade', 'territorial', 'municipio'],
  localidade: ['ibge', 'territorial', 'municipio']
};

export function lacksAnswerableEvidence(question, docs) {
  const q = normalize(question);
  if (/\bpopulacao\b/.test(q) && /\bbairro\b/.test(q)) return true;
  if (/rota de fuga|rota segura|evacuacao|evacuação/.test(q)) return true;
  if (!docs.length) return true;
  return false;
}

export function retrieveKnowledge(question, docs, limit = 3) {
  if (!question.trim()) throw new TypeError('question não pode estar vazia');
  if (!Number.isInteger(limit) || limit < 1) throw new TypeError('limit deve ser inteiro positivo');
  const terms = normalize(question).match(/[\p{Letter}\p{Number}]{3,}/gu) ?? [];
  const expanded = new Set(terms);
  for (const term of terms) {
    for (const synonym of QUERY_SYNONYMS[term] ?? []) expanded.add(synonym);
  }

  const ranked = docs.map(doc => {
    if (!doc.id || !doc.text || !doc.source) throw new TypeError('documento requer id, text e source');
    const body = normalize(`${doc.id} ${doc.text} ${doc.source}`);
    let score = 0;
    for (const term of expanded) {
      if (body.includes(term)) score += terms.includes(term) ? 2 : 1;
    }
    return { ...doc, score };
  });
  return ranked.filter(doc => doc.score > 0)
    .sort((a, b) => b.score - a.score || a.id.localeCompare(b.id))
    .slice(0, limit);
}

export function recallAtK(rankedIds, relevantIds, k) {
  if (!Array.isArray(rankedIds) || !Array.isArray(relevantIds)) {
    throw new TypeError('rankedIds e relevantIds devem ser listas');
  }
  if (!Number.isInteger(k) || k < 1) throw new TypeError('k deve ser inteiro positivo');
  const relevant = new Set(relevantIds);
  if (relevant.size === 0) return null;
  const retrieved = new Set(rankedIds.slice(0, k));
  return [...relevant].filter(id => retrieved.has(id)).length / relevant.size;
}

export function localModelEndpoint(baseUrl = process.env.OLLAMA_BASE_URL ?? 'http://127.0.0.1:11434') {
  const endpoint = new URL(baseUrl);
  const localHosts = new Set(['localhost', '127.0.0.1', '[::1]', 'host.docker.internal', 'ollama']);
  if (endpoint.protocol !== 'http:' || !localHosts.has(endpoint.hostname)) {
    throw new TypeError('OLLAMA_BASE_URL deve apontar para um host local');
  }
  endpoint.pathname = '/api/generate';
  endpoint.search = '';
  endpoint.hash = '';
  return endpoint;
}

export function sanitizeModelAnswer(answer) {
  validateAnswerShape(answer);
  if (answer.abstained) {
    return { ...answer, citations: [] };
  }
  return {
    ...answer,
    citations: [...new Set(answer.citations.filter(id => typeof id === 'string' && id.trim()))]
  };
}

export function attachMissingCitations(answer, context) {
  const cleaned = sanitizeModelAnswer(answer);
  if (cleaned.abstained || cleaned.citations.length > 0 || context.length === 0) {
    return cleaned;
  }
  const answerText = normalize(cleaned.answer);
  const matched = context.filter(doc => {
    const tokens = normalize(`${doc.id} ${doc.text}`).match(/[\p{Letter}\p{Number}]{4,}/gu) ?? [];
    return tokens.some(token => answerText.includes(token));
  }).map(doc => doc.id);
  if (matched.length === 0) {
    return refusalAnswer('Não consta evidência suficiente nos trechos recuperados para fundamentar a resposta.');
  }
  return { ...cleaned, citations: matched };
}

export function validateGroundedAnswer(answer, context) {
  const cleaned = attachMissingCitations(answer, context);
  const allowed = new Set(context.map(doc => doc.id));
  if (cleaned.abstained && cleaned.citations.length !== 0) {
    throw new Error('resposta recusada não deve citar documentos não usados');
  }
  if (!cleaned.abstained && cleaned.citations.length === 0) {
    throw new Error('resposta sem evidência deve ser recusada');
  }
  if (cleaned.citations.some(id => !allowed.has(id))) {
    throw new Error('citation não existe no contexto recuperado');
  }
  return cleaned;
}

export function validateBaselineAnswer(answer) {
  const cleaned = sanitizeModelAnswer(answer);
  if (cleaned.citations.length !== 0) {
    throw new Error('baseline sem contexto não pode atribuir citations');
  }
  return cleaned;
}

function validateAnswerShape(answer) {
  if (!answer || typeof answer.answer !== 'string' || typeof answer.abstained !== 'boolean'
    || !answer.answer.trim() || !Array.isArray(answer.citations)
    || answer.citations.some(id => typeof id !== 'string')) {
    throw new TypeError('resposta precisa conter answer, citations e abstained');
  }
  if (answer.answer.trim().length < 20) {
    throw new TypeError('answer deve conter pelo menos 20 caracteres');
  }
}

function refusalAnswer(reason) {
  return {
    answer: reason,
    citations: [],
    abstained: true
  };
}

export async function askLocalModel({ question, docs, mode = 'rag', model = process.env.OLLAMA_MODEL ?? 'qwen2.5:0.5b' }) {
  if (!['baseline', 'rag', 'agent'].includes(mode)) throw new TypeError('mode deve ser baseline, rag ou agent');
  const context = mode === 'baseline' ? [] : retrieveKnowledge(question, docs);
  if (mode !== 'baseline') {
    if (context.length === 0 || lacksAnswerableEvidence(question, context)) {
      return refusalAnswer('Não consta na base de conhecimento disponível para esta pergunta.');
    }
  }

  const instruction = mode === 'baseline'
    ? 'Você não recebeu base de conhecimento. Responda com seu conhecimento prévio em JSON e deixe citations vazio. Se a pergunta pedir fato específico sem evidência, use abstained true.'
    : mode === 'agent'
      ? 'Você é um agente de orientação preventiva. Não emita alertas oficiais, diagnósticos ou rotas. Use somente fatos declarados nos trechos. Se os trechos respondem a pergunta, responda com abstained false e cite todos os IDs usados. Perguntas sobre se a previsão confirma alagamento devem ser respondidas com o trecho meteorológico, explicando que previsão não é confirmação. Só use abstained true quando o dado pedido não existir nos trechos.'
      : 'Responda somente com fatos declarados nos trechos fornecidos. Se os trechos respondem a pergunta, use abstained false e cite todos os IDs utilizados. Perguntas sobre confirmação de alagamento devem usar o trecho meteorológico. Só recuse com abstained true quando o dado pedido não constar nos trechos.';
  const evidence = mode === 'baseline'
    ? 'Sem contexto fornecido.'
    : JSON.stringify(context.map(({ id, text }) => ({ id, text })));
  const response = await fetch(localModelEndpoint(), {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      model,
      stream: false,
      format: {
        type: 'object',
        properties: {
          answer: { type: 'string', minLength: 20 },
          citations: { type: 'array', items: { type: 'string' } },
          abstained: { type: 'boolean' }
        },
        required: ['answer', 'citations', 'abstained'],
        additionalProperties: false
      },
      options: { temperature: 0 },
      prompt: `${instruction}
Quando abstained for true, citations deve ser [].
Nunca invente IDs. Nunca complete com conhecimento externo quando houver trechos.
Retorne somente um objeto JSON com exatamente estas propriedades: {"answer":string,"citations":string[],"abstained":boolean}.
Pergunta: ${question}
Trechos: ${evidence}`
    })
  });
  if (!response.ok) throw new Error(`Ollama respondeu HTTP ${response.status}`);
  const payload = await response.json();
  let answer;
  try {
    answer = JSON.parse(payload.response);
  } catch (error) {
    throw new Error(`Ollama retornou JSON inválido: ${error.message}`);
  }
  return mode === 'baseline'
    ? validateBaselineAnswer(answer)
    : validateGroundedAnswer(answer, context);
}
