# Cenários sintéticos de falha de recuperação

Os exemplos abaixo são cenários de teste construídos a partir dos fixtures locais. Não são saídas do modelo, não correspondem aos cinco erros reais e não devem ser usados como evidência de desempenho.

| Cenário | Falha ilustrativa | Verificação |
|---|---|---|
| Termos equivalentes não coincidem | Uma pergunta usa uma expressão que não aparece literalmente nos trechos; a busca lexical pode não recuperar a fonte pertinente. | Medir recall@1 e recall@3 para um caso de teste com ID esperado conhecido. |
| Termos genéricos coincidem | Uma pergunta menciona um termo comum presente em um trecho irrelevante; a busca lexical pode ranqueá-lo apesar da intenção diferente. | Inspecionar os IDs ranqueados, sem inferir correção de resposta. |
| Pergunta fora da base | Um tema não coberto pode retornar lista vazia e deve permanecer sem evidência recuperada. | Garantir que o caso sem citações esperadas tenha recall nulo, não zero nem desempenho do modelo. |
| Mais fontes relevantes que o limite | Um caso com várias fontes esperadas pode recuperar apenas parte delas entre os três primeiros resultados. | Comparar `ranked_ids` com `relevant_ids` e reportar recall@1/recall@3. |

O benchmark registra apenas a recuperação lexical para os casos e documentos listados em `retrieval-results.synthetic.json`. Somente uma execução real do benchmark com Ollama pode produzir observações para `erros-reais.md`.
