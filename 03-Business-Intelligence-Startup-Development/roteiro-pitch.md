# Pitch — Alerta Cidade (até 5 minutos)

Integrante único e responsável pelo envio: **Eduardo de Oliveira Nistal — RM94524**.<br>
**MVP ao vivo:** `[PREENCHER URL pública funcional e testar antes da gravação]`<br>
**Fonte oficial para a abertura:** `[PREENCHER fonte, URL e data/horário reais da consulta]`<br>
**Vídeo real:** `[PREENCHER URL do vídeo não listado após gravar e publicar]`<br>
**Link de envio:** `[PREENCHER link de envio no Teams após enviar]`

> **Rascunho de gravação.** Campos entre colchetes são instruções de produção: não os leiam nem os apresentem como fatos. Não afirmem pesquisa, usuário, dado, implantação, preço, parceria, custo ou impacto sem evidência real identificável. O vídeo e o envio permanecem pendentes até acontecerem.

## Roteiro cronometrado

### 0:00–0:40 — Problema, usuário e evidência (rubrica: problema real com evidência, 1,5)

**Fala sugerida:**

“Alerta Cidade é uma proposta para ajudar pessoas a encontrar e interpretar informação pública sobre chuva, mantendo visíveis a origem, o horário e os limites do dado. A informação precisa ser distinguida de uma ocorrência confirmada e dos avisos dos órgãos oficiais.”

**PROMPT — evidência de usuário:** `[Se houver coleta real, resumir somente o que foi observado, por qual método e em que data; remover nomes/dados pessoais sem consentimento. Se não houver evidência, dizer que essa necessidade ainda será validada e não narrar entrevistas, contagens ou depoimentos.]`

**PROMPT — fonte e data:** Abrir a Open-Meteo Forecast API no navegador (`https://api.open-meteo.com/v1/forecast?latitude=-23.55&longitude=-46.63&daily=precipitation_sum&timezone=America%2FSao_Paulo&forecast_days=1`), mostrar a URL e o JSON. Consulta verificada em **14/11/2026**: precipitação prevista de **0,10 mm** para a data lógica **2026-11-14** no ponto −23,55/−46,63. Em seguida abrir um canal oficial (ex.: CGE SP ou Defesa Civil) e reforçar que a previsão pública não é alerta oficial.

**Nota de evidência:** na gravação, repetir a consulta ao vivo (o valor pode mudar) e mostrar URL + horário; não inventar estatística de impacto.

### 0:40–1:00 — Solução e proposta de valor

**Fala sugerida:**

“A proposta é organizar informação pública em linguagem simples, mostrar de onde veio e quando foi atualizada, e encaminhar aos canais oficiais. Não confirma alagamentos, não recomenda rotas e não substitui a Defesa Civil. Quero testar se essa apresentação facilita encontrar e compreender a informação — ainda não afirmo que isso foi comprovado.”

**Nota de evidência:** apresentar como proposta, não como benefício medido ou impacto alcançado.

### 1:00–2:30 — Demonstração real do MVP (rubrica: MVP em uso real e URL pública, 2,5)

**PROMPT — demonstração ao vivo:** `[Abrir a URL pública funcional e navegar no produto real. Mostrar somente fluxos e fontes que estejam operacionais na gravação. Identificar fonte, horário e limites visíveis. Se alguma etapa não estiver implementada ou falhar, dizer isso claramente; não simular sucesso.]`

**Sequência de demonstração a adaptar ao MVP existente:**
1. Abrir a tela inicial pelo link público e identificar o estado real do dado.
2. Mostrar a origem e o horário, se esses elementos estiverem disponíveis no MVP.
3. Executar um fluxo implementado e explicar apenas o comportamento observado.
4. Se houver resposta de IA no MVP demonstrado, mostrar a evidência citada e os limites; não alegar precisão ou redução de erros sem avaliação real.

**Nota de evidência:** URL pública aberta na gravação e produto funcionando ao vivo. Fixture/dado sintético não pode ser apresentado como coleta real. O componente local descrito no material técnico não deve ser tratado como implantação pública.

### 2:30–3:25 — Modelo de negócio e go-to-market (rubrica: modelo de negócio e go-to-market, 2,0)

**Fala sugerida:**

“Os cidadãos são os usuários previstos e o acesso básico gratuito é uma hipótese de produto. Os compradores potenciais seriam instituições, como municípios ou consórcios, que poderiam avaliar uma camada de apresentação, integração e suporte. O caminho proposto é conversar com usuários e áreas institucionais, definir um piloto delimitado e só então avaliar contratação. Não temos preço validado nem comprador confirmado.”

**Nota de evidência:** relacionar à proposta e às hipóteses em [`docs/modelo-negocio.md`](docs/modelo-negocio.md). Não apresentar os cenários aritméticos do documento como cotação, pesquisa de mercado, preço proposto ou disposição a pagar observada.

### 3:25–4:10 — Indicadores, impacto e ODS (rubrica: indicadores de negócio/impacto e ODS, 1,5)

**Fala sugerida:**

“Antes de um piloto, definiria como observar atualização e disponibilidade da fonte, compreensão dos avisos em tarefas com usuários e encaminhamento aos canais oficiais. A proposta se relaciona aos ODS 11, Cidades e Comunidades Sustentáveis, e 13, Ação contra a Mudança Global do Clima. Essa relação é de alinhamento temático: não tenho linha de base nem evidência de impacto.”

**Nota de evidência:** mostrar indicadores como plano de medição, não resultados; apresentar a ligação aos ODS sem alegar contribuição ou impacto demonstrado. Qualquer evidência de usuário citada deve ter método e data reais.

### 4:10–4:35 — Viabilidade, custos e pedido (rubrica: viabilidade/custo e pedido, 1,0)

**Fala sugerida:**

“Um piloto precisaria de fonte autorizada, monitoramento, revisão dos limites e acordo com o órgão parceiro. Custos e capacidade operacional ainda precisam ser levantados para o escopo definido; não apresentamos uma estimativa como se já estivesse validada. Nosso pedido é conversar com usuários e instituições interessadas para desenhar e avaliar um piloto, sem presumir parceria ou contratação.”

**Nota de evidência:** explicar dependências e limites reais. Não inventar custos, acordo, autorização ou parceiro; demonstrar que o pedido é para validação futura.

### 4:35–5:00 — Integrante, clareza e encerramento (rubrica: clareza, ritmo, apresentação do integrante e duração até 5 minutos, 1,5)

**PROMPT — integrante real:** `[Apresentar Eduardo de Oliveira Nistal — RM94524 como único integrante e responsável pelo envio.]`

**Fala sugerida:**

“Sou Eduardo de Oliveira Nistal, RM94524, único integrante do projeto Alerta Cidade. Quero validar, com cidadãos e instituições, se informação pública rastreável pode ser apresentada de forma compreensível e segura. Este vídeo mostra o estado real do MVP e as hipóteses que ainda preciso testar.”

**Nota de evidência:** o integrante único aparece e se identifica; áudio e ritmo são compreensíveis; vídeo final não excede cinco minutos. Incluir legendas, testar a URL do vídeo sem autenticação e confirmar o envio no Teams.

## Lista de cenas e gravação

| Tempo | Enquadramento/plano | O que mostrar | Condição de evidência |
|---|---|---|---|
| 0:00–0:40 | Eduardo em câmera; inserir captura da fonte em tela dividida | Identificação, problema, fonte oficial com URL e horário | Mostrar dado existente e contexto. Se não houver pesquisa com usuários, declarar que a validação está pendente. |
| 0:40–1:00 | Câmera; cartão simples com proposta de valor | O que o produto pretende organizar e seus limites | Apresentar como proposta, não como benefício medido. |
| 1:00–2:30 | Captura de tela contínua do navegador; incluir cursor e URL | MVP público real, origem/horário dos dados e um fluxo implementado | A URL ainda está pendente. Não gravar esta cena como demonstração concluída até o MVP público funcionar. Não substituir falha por mockup. |
| 2:30–3:25 | Câmera com slide de modelo de negócio | Usuários, compradores potenciais e caminho de validação | Identificar como hipótese; não exibir cenário aritmético como venda/preço comprovado. |
| 3:25–4:10 | Câmera com slide de indicadores e ODS | Indicadores propostos e relação temática com ODS 11 e 13 | Rotular indicadores como plano; não afirmar impacto ou linha de base inexistente. |
| 4:10–4:35 | Câmera com lista curta de dependências | Fonte autorizada, monitoramento, parceiro e custos ainda a avaliar | Não exibir orçamento, parceiro ou deploy sem comprovação. |
| 4:35–5:00 | Câmera frontal; cartão final com nome e RM | Integrante único, pedido e encerramento | Revisar áudio, legenda, duração total ≤5 min e identificação. |

Gravar tela e câmera com cortes discretos, mantendo uma captura íntegra do fluxo do MVP. Se um pré-requisito falhar, pausar a gravação e corrigir o ambiente; não montar uma sequência que sugira uma execução que não aconteceu.

## Conferência de gravação e envio

- [ ] Eduardo de Oliveira Nistal — RM94524 aparece e se identifica como integrante único.
- [ ] Evidência de usuário é real, com método e data, ou a ausência de validação é declarada.
- [ ] MVP público foi aberto e demonstrado ao vivo; falhas e funções ausentes não foram encenadas.
- [ ] Fonte oficial, URL e data/horário de consulta foram mostrados.
- [ ] Fixture sintética não foi apresentada como dado real; números, preços e impacto não foram narrados como fatos.
- [ ] Gravação real revisada, com duração de até cinco minutos.
- [ ] Vídeo publicado como não listado; link testado sem autenticação.
- [ ] Link real de envio no Teams registrado após o envio, até 19/11/2026 às 23h55.

**Status:** gravação, publicação e envio pendentes.<br>
**URL do vídeo real:** `[PREENCHER somente após gravação/publicação]`<br>
**Link de envio no Teams:** `[PREENCHER somente após enviar]`
