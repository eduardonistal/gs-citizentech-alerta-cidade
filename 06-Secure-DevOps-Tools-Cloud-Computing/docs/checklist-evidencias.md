# Checklist de evidências — Secure DevOps

**Responsável:** Eduardo de Oliveira Nistal — RM94524.  
**Objetivo:** coletar as evidências exigidas após autorização e execução real. O teto de gasto informado é R$ 0; não criar recursos cloud pagos.

## Capturas e registros

| # | Evidência | O que registrar | Salvaguarda |
|---|---|---|---|
| 1 | Build e Compose | Imagens/serviços iniciados e usuário não-root dentro do container | Não exibir variáveis secretas nem valores do `.env`. |
| 2 | Terraform | Plano aplicado apenas em ambiente aprovado; recursos e região | State remoto e `.tfvars` reais fora do repositório; nenhum `apply` com orçamento R$ 0. |
| 3 | CI — bloqueio | Execução real de Gitleaks, Semgrep e Trivy que falha por achado controlado | Não introduzir segredo real; usar fixture inofensivo aprovado e remover após teste. |
| 4 | CI — correção | Nova execução com o achado resolvido e verificações aprovadas | Mostrar commits/execuções correspondentes; não substituir logs reais por captura editada. |
| 5 | Deploy e health | URL HTTPS, estado e verificação de disponibilidade | Pendente de autorização e provedor; nunca publicar um endpoint não protegido. |
| 6 | Dashboard | Quatro painéis: tráfego (`http_requests_total`), erros (`http_errors_total`), latência da última requisição e RSS (`process_resident_memory_bytes`) | Só capturar dados de execução; identificar janela e ambiente. |
| 7 | Alerta | Regra configurada e alerta efetivamente disparado/recuperado | Mostrar horário e estado; não alegar disparo a partir de configuração estática. |
| 8 | Custo | Provedor, região, URL oficial da tarifa e data da consulta; depois, uso medido | O teto autorizado é R$ 0. Não criar recurso faturável; manter preço e uso como pendentes. |

## Registro e segurança

Anotar comando/execução, commit, ambiente, data/hora e legenda para cada evidência. Mascarar secrets e dados pessoais. Manter evidências sintéticas claramente marcadas e separadas de execução real.

**Status:** Compose, Terraform, CI, Prometheus e Grafana ainda não foram executados aqui. Sem autorização de custo positivo, o deploy público permanece bloqueado; esta lista não comprova execução.
