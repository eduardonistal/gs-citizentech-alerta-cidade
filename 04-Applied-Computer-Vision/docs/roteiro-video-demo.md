# Roteiro e cenas — demonstração de Computer Vision

**Apresentador e responsável:** Eduardo de Oliveira Nistal — RM94524.  
**Duração sugerida após existir uma execução real:** 2–3 minutos; confirmar eventual limite no Teams.  
**Bloqueio atual:** não há dataset selecionado/licenciado, modelo treinado, pesos ou inferências reais. Este documento prepara a gravação, mas **não constitui demonstração funcional nem pode ser gravado como se o modelo existisse**.

## Pré-condições obrigatórias

- Registrar origem, licença, permissão e tratamento de pessoas/placas das imagens.
- Treinar o modelo e guardar pesos, configuração e comando reprodutível.
- Separar validação/teste por origem e revisar as anotações.
- Ter uma imagem ou vídeo autorizado e resultados reais de inferência.
- Calcular métricas do modelo e selecionar exemplos positivos, negativos e ambíguos; não usar o fixture sintético como resultado de YOLO.

## Cenas planejadas

| Tempo | Cena/tela | Fala sugerida | O que precisa estar verificado |
|---|---|---|---|
| 0:00–0:15 | Câmera e título do projeto | “Sou Eduardo de Oliveira Nistal, RM94524. Este componente experimental procura regiões visualmente compatíveis com água sobre via para revisão humana.” | Identificar o componente como experimental, não como confirmação de alagamento. |
| 0:15–0:40 | Tabela de proveniência do dataset | “Estas imagens vieram de [fonte], sob [licença], e foram tratadas para [medida de privacidade].” | Preencher somente com fonte/licença reais; se ausente, não gravar esta cena como concluída. |
| 0:40–1:00 | Configuração `dataset.yaml`, comando e pesos | “O experimento usa a classe `water_on_road` e estes parâmetros registrados.” | Mostrar arquivos e pesos efetivamente usados, sem inventar treino ou configuração. |
| 1:00–1:45 | Executar `src/detect_video.py` em mídia autorizada | “O detector marca candidatos e uma confiança. A caixa não é um alerta oficial e exige revisão humana.” | Mostrar inferência real, entrada identificada e saída original. Se não houver inferência, interromper a gravação; não substituir por imagem desenhada. |
| 1:45–2:20 | Resultados reais e um erro | “No conjunto de teste, estes foram [métricas]. Aqui está um [falso positivo/negativo] revisado.” | Informar tamanho/divisão do dataset e métricas verificáveis; classificar pelo menos um erro real. |
| 2:20–2:45 | Câmera; limites e encerramento | “O modelo não confirma ocorrência, não prevê risco individual e não recomenda rota. Casos incertos ficam para revisão humana.” | Não generalizar resultados para outras câmeras, bairros ou condições. |

## Lista de tomadas

- [ ] Apresentador identifica integrante e produto.
- [ ] Fonte/licença e medidas de privacidade aparecem legíveis.
- [ ] Configuração e comando correspondem ao treino registrado.
- [ ] Entrada autorizada e inferência real são exibidas sem cortes que ocultem erros.
- [ ] Métricas e pelo menos um erro são explicados.
- [ ] Tela final declara limites e encaminhamento para revisão humana.
- [ ] Link do vídeo e repositório público só são preenchidos depois de existirem.

**Não gravar como “vídeo funcional” enquanto as pré-condições não forem cumpridas.** Uma narração sobre o plano ou o exemplo binário sintético não satisfaz a demonstração do modelo.
