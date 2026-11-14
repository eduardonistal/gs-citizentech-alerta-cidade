# Modelo de negócio — Alerta Cidade

Integrante único e responsável pelo envio: **Eduardo de Oliveira Nistal — RM94524**.

> **Rascunho de proposta.** Os segmentos, canais, parcerias, receitas e indicadores abaixo são hipóteses para validação; não representam pesquisa de mercado, compradores identificados, preço validado ou impacto alcançado. O MVP e os materiais técnicos disponíveis não comprovam adoção nem disposição a pagar.

## Proposta e limites do produto

Alerta Cidade é uma proposta de interface que organiza informações públicas sobre chuva, mostra fonte e horário e encaminha a pessoa aos canais oficiais. A proposta não confirma alagamentos, não recomenda rotas e não substitui Defesa Civil ou outros órgãos responsáveis.

## Segmentos, usuários e compradores

| Papel | Segmento proposto | Necessidade a validar |
|---|---|---|
| Usuários | Moradores de áreas urbanas expostas a chuva intensa; pessoas que precisam interpretar informação pública durante deslocamentos | Encontrar e compreender informação pública atual, sua origem, horário e limites |
| Compradores institucionais potenciais | Municípios, consórcios públicos e órgãos de gestão de risco/Defesa Civil | Distribuir informação pública rastreável, integrar fontes e avaliar compreensão e operação |
| Parceiros potenciais, não necessariamente compradores | Órgãos responsáveis por dados, organizações comunitárias e instituições locais | Verificar origem, termos de uso, encaminhamento oficial e participação em testes |

**Distinção importante:** cidadãos são os usuários previstos; a hipótese de pagador é institucional. Nenhum segmento, comprador ou parceiro foi confirmado por entrevistas ou contrato.

## Proposta de valor — hipótese

- **Para usuários:** reunir informação pública com linguagem simples, fonte e horário visíveis e encaminhamento aos canais oficiais.
- **Para compradores institucionais potenciais:** oferecer uma camada de apresentação e integração de informação pública, com origem rastreável e possibilidade de medir disponibilidade e compreensão em um piloto.
- **Limite:** não afirmar redução de incidentes, prevenção comprovada, alertas oficiais ou recomendação de rota sem evidência e autorização apropriadas.

As fontes identificadas no material técnico incluem Open-Meteo, Defesa Civil Nacional, CGE São Paulo e API de Localidades do IBGE. Antes de qualquer publicação ou integração, devem ser confirmados atualidade, atribuição, termos de uso, disponibilidade e adequação de cada fonte.

## Canais e relacionamento — hipóteses

- **Usuários:** aplicação web; possível encaminhamento a partir de páginas ou canais oficiais, condicionado à autorização e parceria.
- **Compradores:** conversas de descoberta com áreas municipais e consórcios; demonstração do MVP; definição conjunta de um piloto; eventual contratação conforme regras de compras aplicáveis.
- **Relacionamento e suporte:** implantação, orientação de uso, atendimento e monitoramento operacional seriam definidos com cada instituição. A capacidade de prestar esses serviços ainda precisa ser avaliada.

Nenhum canal, parceria, processo de compra ou relacionamento comercial está confirmado.

## Sustentabilidade financeira — hipótese

Uma possibilidade a validar é manter acesso básico gratuito aos cidadãos e buscar sustentabilidade por meio de contrato institucional para painel, integração, implantação e suporte. O modelo, quem paga, o que seria contratado, a forma de contratação e o preço não foram validados.

### Cenários aritméticos de receita bruta anual

**Todos os valores e quantidades a seguir são placeholders arbitrários de planejamento, apenas para discussão; não são cotações, preços propostos, dados de mercado, previsão ou evidência de disposição a pagar.** As contagens de clientes observados e a disposição a pagar observada permanecem em branco.

| Municípios hipotéticos | Mensalidade hipotética por município | Cálculo de receita bruta anual |
|---:|---:|---|
| 1 | R$ 5.000 | 1 × R$ 5.000 × 12 = R$ 60.000 |
| 3 | R$ 10.000 | 3 × R$ 10.000 × 12 = R$ 360.000 |
| 10 | R$ 15.000 | 10 × R$ 15.000 × 12 = R$ 1.800.000 |

São multiplicações ilustrativas de quantidade hipotética por mensalidade hipotética e doze meses. Não estimam mercado, preço validado, receita alcançada ou lucro; não descontam custos, tributos, inadimplência, duração de venda ou outras despesas.

| Informação observada | Registro |
|---|---|
| Clientes institucionais observados |  |
| Disposição a pagar observada |  |

## Escopo proposto para um piloto

**Hipótese de escopo, sujeita à autorização e ao desenho conjunto com o parceiro:** testar o produto em uma área delimitada, usando fonte(s) pública(s) escolhida(s) e verificadas com o órgão responsável. O piloto deve:

1. identificar a pessoa responsável por cada fonte, confirmar atribuição e termos de uso;
2. exibir fonte, horário de atualização, limites e encaminhamento oficial;
3. testar o fluxo com cidadãos e representantes institucionais recrutados com consentimento e método documentado;
4. registrar disponibilidade e atualização da informação e avaliar compreensão, sem tratar a demonstração como alerta oficial;
5. definir revisão humana, monitoramento, procedimento de indisponibilidade e critérios de interrupção antes de qualquer uso público.

Não há piloto contratado ou executado, participantes recrutados, linha de base ou resultados de impacto disponíveis.

## Riscos e cuidados

| Risco | Tratamento a validar |
|---|---|
| Informação desatualizada ou interpretada como alerta oficial | Exibir fonte e horário; declarar limites; encaminhar aos canais oficiais; definir monitoramento e procedimento de falha |
| Usuário tomar uma decisão insegura a partir da interface | Não confirmar ocorrências nem sugerir rotas; testar compreensão; revisar textos com responsáveis e usuários |
| Mudança de API, licença, atribuição ou disponibilidade | Confirmar termos e dependências com cada fonte; monitorar falhas e manter alternativa de indisponibilidade |
| Baixa adoção ou dificuldade de compreensão | Fazer testes de usabilidade com usuários reais e registrar método, contexto e resultados antes de alegar aceitação |
| Interesse institucional sem contratação ou sustentabilidade | Validar problema, decisor, processo de compra, escopo de serviço e disposição a pagar; não tratar conversa como compromisso |
| Custo operacional e suporte desconhecidos | Levantar custos e capacidade durante o desenho do piloto antes de propor contrato ou preço |
| Exposição de dados pessoais | Minimizar coleta; definir finalidade, retenção, acesso e controles antes de qualquer pesquisa ou operação |

## Registro de hipóteses e validação

Os campos de responsável ficam intencionalmente vazios para preenchimento pela equipe.

| ID | Hipótese / suposição | Evidência necessária | Método de validação proposto | Responsável |
|---|---|---|---|---|
| H1 | Cidadãos conseguem encontrar e compreender fonte, horário e limites mais facilmente na interface proposta | Observações de usuários reais, tarefa, contexto, método, data e resultados registrados | Teste de usabilidade moderado com participantes recrutados e consentidos; registrar problemas e compreensão sem generalizar além da amostra |  |
| H2 | A informação apresentada corresponde a uma necessidade relevante de usuários em situações de chuva | Relatos ou observações reais, com método e contexto documentados | Entrevistas abertas e teste de tarefa com cidadãos; separar evidência observada de interpretação da equipe |  |
| H3 | Um órgão municipal ou consórcio reconhece valor em avaliar uma camada de apresentação e integração de fontes públicas | Entrevistas com decisores e usuários institucionais; problema, processo de decisão e condições de uso documentados | Entrevistas de descoberta sem apresentar intenção como compromisso; pedir validação do fluxo e dos requisitos do piloto |  |
| H4 | Um comprador institucional pode contratar e sustentar implantação, integração e suporte | Requisitos técnicos, jurídicos e de compras; custos operacionais documentados; manifestação explícita do potencial comprador | Mapear processo de contratação com o órgão; elaborar custo de operação com premissas verificáveis; buscar manifestação formal sem presumir venda |  |
| H5 | A disposição a pagar e o formato de contratação podem sustentar o serviço | Respostas observadas de compradores a escopo e preço apresentados, com contexto e método registrados | Entrevistas de preço ou proposta-piloto claramente identificada; registrar respostas reais sem projetá-las para o mercado |  |
| H6 | Fontes públicas selecionadas podem ser usadas de forma confiável e autorizada no piloto | URL, responsável, horário, disponibilidade, atribuição e termos vigentes de cada fonte | Revisão documental e teste técnico; confirmação com responsáveis; registrar data e limitações |  |
| H7 | Indicadores de operação e compreensão podem ser medidos sem confundir atividade com impacto | Definições, instrumentos, linha de base e protocolo de coleta aprovados | Definir indicadores antes do piloto; testar coleta e compreensão; não declarar impacto causal sem desenho adequado |  |

Nenhuma hipótese acima está confirmada por este documento. Evidência, método, data e limitações devem acompanhar qualquer conclusão futura.

## Indicadores a definir antes do piloto

Como candidatos de medição — não como resultados — podem ser definidos atualização e disponibilidade das fontes, cobertura funcional do fluxo, compreensão de fonte e limites em tarefas de usuário, e encaminhamento correto a canais oficiais. Valores observados, metas, linha de base e efeito ainda não estão estabelecidos.

## Próximos passos de validação

1. Confirmar equipe e responsabilidades.
2. Entrevistar usuários e potenciais compradores, registrando método e evidências sem preencher resultados antecipadamente.
3. Confirmar fontes, autorizações, requisitos institucionais e limites do MVP.
4. Definir escopo, protocolo, custos e critérios de interrupção do piloto com um parceiro, se houver interesse confirmado.
5. Atualizar este registro apenas com evidência real datada; manter vazios os dados ainda não observados.
