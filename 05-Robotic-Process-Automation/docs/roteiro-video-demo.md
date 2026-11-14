# Roteiro e cenas — demonstração RPA

**Apresentador e responsável:** Eduardo de Oliveira Nistal — RM94524.  
**Duração sugerida após execução real:** 3–4 minutos; confirmar eventual limite no Teams.  
**Bloqueio atual:** o workflow está exportado, mas inativo e ainda não foi executado no n8n. Não há evidência de integração ponta a ponta.

## Pré-condições

- Importar `workflow/Alerta-Cidade-n8n.json` em uma instância n8n autorizada.
- Configurar agendamento, endpoint e credencial Header Auth no cofre do n8n; jamais mostrar ou gravar o segredo.
- Iniciar o MVP e usar token de teste guardado localmente.
- Preparar entradas reais de teste para sucesso, decisão/ramificação e falha; manter explícito se forem fixtures.
- Verificar se cada saída chega ao endpoint do MVP e se os logs estão sanitizados.

## Cenas e falas

| Tempo | Cena/tela | Fala sugerida | Evidência e condição |
|---|---|---|---|
| 0:00–0:20 | Câmera e diagrama BPMN/PDD | “Sou Eduardo de Oliveira Nistal, RM94524. Este fluxo transforma uma previsão recebida e envia apenas dados válidos ao MVP.” | Apresentar como desenho até que uma execução real esteja registrada. |
| 0:20–0:50 | Editor n8n; visão geral dos nodes | “O fluxo valida a entrada, aplica as decisões, trata falhas e registra o resultado sem expor credenciais.” | Mostrar o workflow importado, sem abrir valores de secrets. |
| 0:50–1:30 | Executar entrada válida | “Esta execução recebeu [entrada identificada], percorreu estes nodes e enviou [resultado observado] ao MVP.” | Mostrar execução n8n real e confirmação correlacionada no MVP; não usar log sintético como prova. |
| 1:30–2:05 | Executar caso de decisão/ramificação | “Neste caso, a condição levou a [ramo observado], conforme a regra documentada.” | Usar um caso real de teste e mostrar por que o ramo foi escolhido. |
| 2:05–2:40 | Executar falha controlada | “A falha foi registrada de forma sanitizada e não produziu uma publicação inválida.” | Mostrar tratamento real; token, headers sensíveis e dados pessoais devem estar ocultos. |
| 2:40–3:10 | Abrir BPMN, relatório e testes automatizados | “Os testes locais verificam parsing e validações, mas não substituem a execução do workflow no n8n.” | Distinguir teste de função da execução integrada. |
| 3:10–3:30 | Câmera; encerramento | “O fluxo permanece sujeito a revisão humana e não substitui avisos oficiais.” | Não afirmar operação contínua se o agendamento real não foi observado. |

## Lista de tomadas

- [ ] BPMN/PDD e workflow importado correspondem à mesma versão.
- [ ] Capturar ao menos um caminho de sucesso, uma decisão e uma falha controlada.
- [ ] Demonstrar o efeito no MVP por correlação verificável.
- [ ] Ocultar segredo, token, headers e qualquer dado pessoal.
- [ ] Identificar dados sintéticos como sintéticos.
- [ ] Deixar falhas reais visíveis e não recortar uma execução malsucedida.
- [ ] Acrescentar URL de repositório/vídeo somente após publicação e teste anônimo.

**Não narrar nem gravar a sequência como concluída antes da execução real no n8n.**
