# Relatório técnico — Secure DevOps Tools & Cloud Computing

## Identificação e ficha técnica do MVP

- Integrante único e responsável pelo envio: **Eduardo de Oliveira Nistal — RM94524**.
- Produto: Alerta Cidade — MVP Node.js 20+, porta 3000, previsão pública de chuva demonstrativa, sem dados pessoais necessários.
- URL pública: **pendente de provisionamento**.

## Arquitetura

`GitHub → Gitleaks + Semgrep + Trivy → build Docker não-root → GHCR → Terraform Azure Container Apps + Log Analytics → URL HTTPS`

O Compose local adiciona Prometheus e Grafana, com quatro painéis: tráfego, erros, latência e memória residente. Regras de alerta cobrem taxa de erro e indisponibilidade.

## Segurança e execução bloqueada/corrigida

O workflow falha se Gitleaks/Semgrep/Trivy encontrar problema de severidade configurada. O cenário de achado real e a execução corrigida devem ser demonstrados com commits e logs do GitHub Actions. **Nenhuma execução de CI foi realizada; não há evidência de bloqueio/correção.**

## Infraestrutura como código e segredos

Terraform cria Resource Group, Log Analytics e Container Apps com ingresso HTTPS na aplicação. State e `.tfvars` reais não devem entrar no repositório. O token de ingestão é sensível e fornecido por `TF_VAR_ingest_token`; GitHub OIDC requer `AZURE_CLIENT_ID`, `AZURE_TENANT_ID`, `AZURE_SUBSCRIPTION_ID` como secrets e nomes de recursos como variables. Nunca abrir porta administrativa para `0.0.0.0/0`; não existe painel administrativo de cloud exposto pelo MVP.

## Observabilidade

Prometheus coleta tráfego (`http_requests_total`), erros (`http_errors_total`), latência da última requisição e RSS (`process_resident_memory_bytes`). Dashboard e alertas estão versionados. **Prints, métrica ao vivo e alerta disparado pendentes**, pois Compose/Prometheus/Grafana não foram executados.

## Responsabilidade compartilhada

- Equipe: código, validação de payload, controle do token, atualização de dependências, mínimo de dados e revisão dos alertas.
- Provedor: segurança física, hypervisor e serviços gerenciados, conforme o serviço Azure contratado.
- Compartilhada: IAM, rede, logs, retenção, disponibilidade, imagem e resposta a incidentes.

## LGPD e localização de dados

O MVP demonstrativo não pede nome, conta ou localização precisa. Dados meteorológicos e metadados públicos transitam e são gravados no volume de dados da aplicação/serviço de hospedagem escolhido. **Região, retenção e transferências internacionais ainda precisam ser decididas e documentadas antes do deploy.** O token é segredo operacional, não dado do cidadão.

## Custo

**Não há cotação nem uso medido nesta entrega.** As quantidades de
`docs/carga-sintetica.csv` são premissas hipotéticas de planejamento apenas para
tráfego, retenção e computação; não são preços, orçamento, medição nem previsão
de fatura. A arquitetura de referência cita Azure, mas isso não representa
provedor/região aprovados para uma cotação ou implantação.

| Evidência/campo | Situação |
|---|---|
| Provedor e região de custo | Pendente de decisão e validação da equipe |
| Tarifas cotadas, moeda e estimativa mensal | Pendente; nenhum preço foi consultado |
| Fonte oficial e data da consulta | Pendente; não há cotação |
| Uso real/consumo medido | Pendente; nenhum ambiente cloud foi medido |
| URL de implantação | Pendente; não houve deploy |
| Resultado de CI | Pendente; GitHub Actions não foi executado |
| Evidência de alerta ao vivo | Pendente; Prometheus/Grafana não foram executados em ambiente real |

Para obter preços depois, a equipe deve aprovar provedor, região, retenção e
configuração; consultar a página ou calculadora oficial do provedor para os
SKUs e unidades de cobrança selecionados; registrar a URL oficial, moeda e data
da consulta junto às premissas; e recalcular os três perfis sintéticos sem
apresentá-los como consumo. Após implantação, preencher o uso real somente com
métricas/faturamento do período observado, registrando janela e fonte
separadamente. O template `docs/custo-template.csv` mantém esses campos vazios
até que existam evidências verificáveis. Definir orçamento e alerta aprovados
antes de aplicar Terraform.

## Reprodutibilidade

1. Seguir `docs/runbook.md` e rodar o teste focado de documentação e `npm test`
   localmente; isso não comprova CI.
2. Configurar `GRAFANA_ADMIN_PASSWORD` fora do repositório e executar o Compose
   apenas para validação local.
3. Antes do deploy, provisionar infraestrutura aprovada, backend/state remoto
   protegido, OIDC, RBAC, GHCR e secrets/variables conforme o runbook.
4. Revisar a execução real do GitHub Actions, health da URL retornada e
   telemetria/alerta configurados; registrar evidências somente após verificar.

## Evidências e links

Repositório público, execução barrada/corrigida, resultado de CI, URL pública,
dashboard/alerta ao vivo, uso medido, cotação oficial e PDF final com links:
**pendentes**. Os comandos deste relatório são instruções, não registros de
execução. Não foram inventadas evidências.
