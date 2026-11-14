# Ficha Técnica do MVP — Alerta Cidade

> Proposta de trabalho criada a partir do briefing do PDF. Território, fontes operacionais e necessidade ainda precisam ser validados com cidadãos e órgãos responsáveis.

## Status compartilhado desta ficha

- **Verificado localmente:** conferência documental desta ficha e verificação de existência do arquivo sintético `MVP/data/alerts.sample.json` nesta rodada.
- **Proposta/hipótese:** público-alvo, indicadores, arquitetura alvo e impactos esperados até validação externa.
- **Simulado (sintético):** `MVP/data/alerts.sample.json` e exemplos usados apenas para demonstração.
- **Pendente (equipe/ambiente externo):** validação com cidadãos/órgãos, publicações, deploys, vídeos, métricas de campo, contas e submissões oficiais.

Regra de consistência: em 14/11/2026 houve execução local do MVP com ingestão RPA verificada; isso **não comprova** publicação pública, URL anônima nem entrega no Teams.

## Nome do produto

Alerta Cidade

## Cidadão e território

Moradores, trabalhadores e pessoas em deslocamento na cidade de São Paulo, inicialmente usando uma área demonstrativa central. Interface móvel e de baixo consumo de dados.

## Problema, em uma frase

Informações públicas de chuva e risco urbano estão dispersas e podem ser difíceis de interpretar antes de um deslocamento.

## Proposta de valor

Reunir dados públicos recentes, apresentar uma estimativa preliminar e rastreável de chuva intensa e encaminhar o cidadão a fontes oficiais. O produto não substitui Defesa Civil, não confirma alagamentos e não calcula rotas seguras.

## Perguntas respondidas pelo MVP

- Qual é a previsão pública de chuva para o ponto demonstrativo?
- Quando e de qual fonte veio o dado?
- Qual regra ilustrativa classificou o nível informativo?
- Onde consultar orientação oficial?

## Arquitetura e componentes

1. **MVP:** Node.js HTTP API e página web acessível; contrato `GET /api/alerts`.
2. **Dados:** Airflow coleta Open-Meteo e metadados municipais abertos; Databricks transforma Bronze → Prata → Ouro. No ambiente demonstrativo, `MVP/data/alerts.sample.json` é marcado como sintético.
3. **IA generativa:** consulta local à base curada, resposta JSON com citações e recusa quando não há evidência.
4. **Visão:** classificador/detector experimental de indícios de água em imagens, com revisão humana; não dispara alertas oficiais.
5. **Automação:** fluxo n8n consulta a previsão, aplica regra, registra execução e publica dados no MVP.
6. **Produção:** Docker, GitHub Actions, Gitleaks, Semgrep, Trivy, Terraform e métricas Prometheus.

## Fontes de dados planejadas

- Open-Meteo Forecast API — previsão meteorológica pública, sem chave para o uso documentado.
- API de Localidades do IBGE — metadados territoriais públicos.
- Base de conhecimento curada — orientações institucionais com fonte, URL, data de consulta/licença antes da publicação.
- Imagens de alagamento: aguardam seleção de conjunto público, verificação de licença e curadoria; não há fotos reais incluídas neste pacote.

## IA e limites

- LLM local via Ollama, com RAG e agente especializado.
- Visão computacional experimental; confiança baixa ou caso fora do domínio deve ir para revisão humana.
- Não coletar nomes, rostos, localização precisa ou outros dados pessoais.
- As regras de chuva desta demonstração são apenas heurísticas de software, não limiares oficiais.

## URLs e repositório

- MVP local: `http://localhost:3000`.
- URL pública (túnel ativo enquanto a máquina estiver ligada): `https://silver-carrots-throw.loca.lt` — verificada em 14/11/2026 com `GET /api/health`.
- Repositório público GitHub: https://github.com/eduardonistal/gs-citizentech-alerta-cidade

## Indicadores e ODS

Indicadores a medir depois de um piloto: latência, disponibilidade, proporção de previsões com fonte/data visíveis, cobertura territorial e compreensão do aviso em teste com usuários. Não há resultados de impacto medidos. Alinhamento proposto: ODS 11 (Cidades e Comunidades Sustentáveis) e ODS 13 (Ação Climática).
