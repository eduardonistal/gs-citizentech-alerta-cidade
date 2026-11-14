const status = document.querySelector('#status');
const cards = document.querySelector('#alerts');

async function loadAlerts() {
  status.textContent = 'Carregando dados...';
  cards.replaceChildren();
  try {
    const response = await fetch('/api/alerts', { headers: { accept: 'application/json' } });
    if (!response.ok) throw new Error(`Falha HTTP ${response.status}`);
    const payload = await response.json();
    for (const alert of payload.alerts) {
      const card = document.createElement('article');
      card.className = `card level-${alert.assessment.level}`;
      const heading = document.createElement('h3');
      heading.textContent = alert.area;
      const detail = document.createElement('p');
      detail.textContent = `${alert.precipitation_mm} mm previstos; probabilidade ${alert.probability_pct}%.`;
      const assessment = document.createElement('p');
      assessment.textContent = alert.assessment.message;
      const source = document.createElement('a');
      source.href = alert.source_url;
      source.target = '_blank';
      source.rel = 'noreferrer';
      source.textContent = `Fonte: ${alert.source_name}`;
      card.append(heading, detail, assessment, source);
      cards.append(card);
    }
    status.textContent = payload.is_sample
      ? 'Exibindo fixture sintética. Nenhuma previsão foi consultada.'
      : `Fonte consultada; última atualização: ${payload.observed_at ?? 'não informada'}.`;
  } catch (error) {
    status.textContent = `Não foi possível carregar os dados: ${error.message}`;
  }
}

document.querySelector('#refresh').addEventListener('click', loadAlerts);
document.querySelector('#question-form').addEventListener('submit', async event => {
  event.preventDefault();
  const answerStatus = document.querySelector('#answer-status');
  const answerPanel = document.querySelector('#answer');
  answerStatus.textContent = 'Consultando o modelo local...';
  answerPanel.replaceChildren();
  try {
    const response = await fetch('/api/ask', {
      method: 'POST',
      headers: { 'content-type': 'application/json', accept: 'application/json' },
      body: JSON.stringify({ question: document.querySelector('#question').value, mode: 'rag' })
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error ?? `Falha HTTP ${response.status}`);
    const text = document.createElement('p');
    text.textContent = result.answer;
    answerPanel.append(text);
    if (result.citations.length) {
      const citations = document.createElement('p');
      citations.textContent = `Fontes: ${result.citations.join(', ')}`;
      answerPanel.append(citations);
    }
    answerStatus.textContent = result.abstained ? 'A base não contém evidência suficiente.' : 'Resposta fundamentada na base local.';
  } catch (error) {
    answerStatus.textContent = `Consulta indisponível: ${error.message}`;
  }
});
loadAlerts();
