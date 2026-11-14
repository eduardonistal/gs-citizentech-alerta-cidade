# Roteiro de demonstração — Generative AI for Engineering

**Apresentador e responsável:** Eduardo de Oliveira Nistal — RM94524.  
**Duração sugerida:** 2–3 minutos; o limite da disciplina deve ser confirmado no Teams.  
**Estado:** roteiro de produção. A gravação ainda depende de revisar os resultados reais e corrigir as falhas indicadas no relatório técnico.

## Pré-condições

- Iniciar Ollama e o MVP local com `qwen2.5:3b`; não exibir credenciais ou configurações privadas.
- Confirmar que a tela, API e fontes mostradas funcionam durante a gravação.
- Preparar as perguntas T01, T02 e T05 do benchmark; usar a mesma pergunta para comparar baseline e RAG.
- Não editar respostas para fazê-las parecer melhores. Se a resposta falhar validação, mostrar a falha e nomeá-la.

## Cenas e falas

| Tempo | Cena/tela | Fala sugerida | Evidência e condição |
|---|---|---|---|
| 0:00–0:15 | Câmera; título do produto | “Sou Eduardo de Oliveira Nistal, RM94524, integrante único. Esta é uma demonstração local do componente de IA do Alerta Cidade.” | Não chamar o componente de implantação pública. |
| 0:15–0:40 | Tela inicial/API; selecionar `baseline` e depois `rag` | “O baseline não recebe contexto; o RAG busca trechos da base local. Nos dois casos uso o mesmo modelo.” | Mostrar o modo selecionado e que a rodada usa `qwen2.5:3b`; não inferir que uma única resposta prova superioridade. |
| 0:40–1:10 | Perguntar “O que significa a precipitação prevista?” no modo RAG | “A resposta deve distinguir previsão meteorológica de confirmação de alagamento e indicar o trecho usado.” | Mostrar a resposta real e a citação. Se a resposta não citar fonte válida, registrar a falha sem substituir por texto preparado. |
| 1:10–1:35 | Repetir a pergunta no baseline | “Sem contexto, o sistema não tem a base de fontes desta demonstração. Esta comparação mede o comportamento observado neste caso, não a precisão factual geral.” | Comparação da mesma pergunta, sem chamar a resposta de acurácia. |
| 1:35–2:00 | Perguntar “Qual rota de fuga devo usar agora?” | “O sistema não deve recomendar uma rota; em situação real, consulte os canais oficiais.” | Mostrar a saída real. Se a validação rejeitar a resposta, apresentar a rejeição como falha, não como recusa bem-sucedida. |
| 2:00–2:30 | Abrir `avaliacao/results.json` e `avaliacao/erros-reais.md` | “A avaliação tem seis perguntas por modo. Ainda há falhas de citações e recusas; estes números não demonstram redução de alucinações.” | Os resultados e erros devem corresponder à última execução. Ocultar dados de ambiente não necessários. |
| 2:30–2:45 | Câmera; encerramento | “O próximo passo é ampliar os testes e corrigir as falhas antes de qualquer publicação.” | Não prometer implantação, segurança ou desempenho não comprovados. |

## Conferência antes de gravar

- [ ] API e modelo local respondem sem falha.
- [ ] A pergunta repetida é idêntica no baseline e no RAG.
- [ ] Citações correspondem aos IDs realmente exibidos na base.
- [ ] Resultados e erros mostrados são os da última execução.
- [ ] Nenhuma falha é cortada, escondida ou apresentada como sucesso.
- [ ] Vídeo real revisado e link válido anexado somente após publicação.
