# Secure DevOps Tools & Cloud Computing — Deploy Blindado

Integrante único e responsável pelo envio: **Eduardo de Oliveira Nistal — RM94524**.

## Arquivos

- `Dockerfile`: imagem Node enxuta, usuário não-root.
- `compose.yaml`: MVP, Prometheus e Grafana locais.
- `../.github/workflows/devsecops.yml`: workflow acionável do GitHub com Gitleaks, Semgrep, Trivy, build e deploy Azure via OIDC.
- `terraform/`: Container Apps com ingress público na porta 3000 e Log Analytics.
- `observability/`: coleta Prometheus, regras de alerta e dashboard Grafana.
- `docs/relatorio-tecnico.md`: arquitetura, responsabilidades, privacidade e orçamento a preencher.

## Validação local

Requer Docker Engine/Compose:

```powershell
node --test .\06-Secure-DevOps-Tools-Cloud-Computing\test\docs.test.mjs
npm test
docker compose -f .\06-Secure-DevOps-Tools-Cloud-Computing\compose.yaml config
docker compose -f .\06-Secure-DevOps-Tools-Cloud-Computing\compose.yaml up --build
```

MVP em `http://localhost:3000`, Prometheus em `http://localhost:9090`, Grafana em `http://localhost:3001`. Grafana exige `GRAFANA_ADMIN_PASSWORD`; configure-o fora do repositório.

## Publicação

O deploy requer GitHub Actions habilitado, imagem pública ou autenticação GHCR, Azure subscription e secrets/variables descritos no relatório. Nada foi implantado nem foi criada URL pública ou estimativa de custo real nesta entrega.

O backend do Terraform é remoto Azure Storage e **exige** informar `resource_group_name`, `storage_account_name`, `container_name` e `key` em `terraform init -backend-config=...`. Prepare o storage/state com controle de acesso antes do primeiro `plan`; nunca migre state para o repositório. O secret `TF_VAR_ingest_token` deve ser injetado de um secret manager.

## Runbook e custos

Consulte [`docs/runbook.md`](docs/runbook.md) para pré-condições, comandos,
resultados esperados, diagnóstico, rollback, secrets e observabilidade. Os
comandos de teste local não equivalem a uma execução de GitHub Actions ou a um
deploy.

[`docs/carga-sintetica.csv`](docs/carga-sintetica.csv) contém somente perfis
hipotéticos de tráfego, retenção e computação para planejamento. Não são preços
de provedor, cotação nem uso medido. O template
[`docs/custo-template.csv`](docs/custo-template.csv) deixa provedor, região,
tarifas, origem/data de preço, uso medido, URL, resultado de CI e evidência de
alerta em branco até validação real. Para preencher, a equipe deve primeiro
aprovar provedor/região e configuração, consultar a página ou calculadora oficial
de preços para os SKUs escolhidos, guardar URL e data, e separar estimativas das
métricas/faturas efetivamente observadas após implantação.
