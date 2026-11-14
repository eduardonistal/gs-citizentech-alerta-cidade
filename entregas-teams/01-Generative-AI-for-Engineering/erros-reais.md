# Registro de cinco erros reais do modelo

Execuções locais com Ollama. A rodada inicial (`results.initial-prompt.json`, `qwen2.5:3b`) e a rodada corrigida (`results.json`, `qwen2.5:7b` em 14/11/2026) documentam a evolução. Causas são hipóteses a partir das saídas.

| # | Modo/caso | Saída ou falha observada | Causa provável | Correção aplicada | Situação na rodada corrigida (`qwen2.5:7b`) |
|---|---|---|---|---|---|
| 1 | RAG / T02 (3b) | Resposta curta/ambígua ou abstensão indevida sobre confirmação de alagamento. | Modelo não ancorava o trecho que distingue previsão de confirmação. | Schema JSON, prompt reforçado, limiar de 20 caracteres e instrução explícita de responder com o trecho meteorológico. | Corrigido: responde com `meteo-precipitation` e explica que previsão não confirma alagamento. |
| 2 | RAG / T03 (3b) | Citou só `cgesp` ou respondeu sem citações válidas. | Seleção incompleta de fontes e esquecimento de IDs no JSON. | Expansão lexical na recuperação, instrução de citar todos os IDs usados e `attachMissingCitations`. | Corrigido: cita `defesa-civil-guidance` e `cgesp`. |
| 3 | RAG / T04 (3b) | Respondeu metadados do IBGE em vez de recusar população de bairro. | Recuperação lexical trouxe IBGE por termos compartilhados. | Gate `lacksAnswerableEvidence` para população de bairro / rota de fuga. | Corrigido: recusa com `abstained: true` e `citations: []`. |
| 4 | Agente / T02–T04 (3b) | Validação rejeitava recusas com citações (`abstained: true` + IDs). | Modelo não respeitava a relação entre recusa e citações vazias. | `sanitizeModelAnswer` zera citações em recusa; prompt reforçado. | Corrigido: saídas válidas em todos os seis casos do agente. |
| 5 | Agente / T03 (3b) | Inferiu localização do CGESP além do trecho. | Completar com conhecimento externo. | Instrução de usar somente fatos declarados; comparação com baseline. | Corrigido nesta rodada: resposta limitada aos trechos oficiais citados. |

## Placar da rodada corrigida

| Modo | Saída válida | Recall de citações | Acurácia responder/recusar | Task compliance |
|---|---:|---:|---:|---:|
| Baseline sem contexto | 1,000 | 0,000 | 0,333 | 0,333 |
| RAG | 1,000 | 1,000 | 1,000 | 1,000 |
| Agente | 1,000 | 1,000 | 1,000 | 1,000 |

No conjunto de seis casos, RAG e agente superam o mesmo modelo sem contexto em conformidade com o gabarito (task compliance 1,000 vs 0,333), com recall@3 de recuperação lexical = 1,000 após expansão de sinônimos.
