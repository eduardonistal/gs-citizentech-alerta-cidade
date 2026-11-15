# Rubrica — caminho para nota máxima (PDF CitizenTech)

**Produto:** Alerta Cidade · **RM94524** · Maker Lab **excluída**.  
Cada linha aponta o artefato **dentro do ZIP** (ou link público).

## Regras gerais (p. 24)

| Item | Artefato |
|---|---|
| Mesma equipe / mesmo produto | `ENTREGA.md` + `empresa/COMPANY.yaml` |
| Um integrante envia | Eduardo — RM94524 em todos os PDFs/ENTREGA |
| Links públicos na correção | `LINKS-MESTRE.json` + repo GitHub |
| Prazo Teams | Founder envia até 19/11/2026 23h55 |

## 01 Generative AI (p. 29–31)

| Item | Onde no ZIP |
|---|---|
| Base + fontes | `01-.../README.md`, pasta GenAI no repo |
| Casos com “não consta” / recusa | `avaliacao-results.json`, `erros-reais.md` |
| Recall / placar RAG vs baseline vs agente | `avaliacao-results.json`, `benchmark.ipynb` |
| Vídeo narrado PT | `video-demo.mp4` (+ release GitHub) |
| Relatório | `relatorio-tecnico.pdf` |

## 02 Big Data (p. 32–38)

| Item | Onde no ZIP |
|---|---|
| ≥2 fontes reais | `chegada/ibge_*`, `chegada/open_meteo_*` |
| DAG paralelo | `dag-gs_coleta.py` |
| Bronze/Prata/Ouro + evidência | `evidencias/`, relatório |
| Airflow success | `evidencias/airflow/` (runs + prints) |
| Lakehouse / Databricks | lakehouse local + `evidencias/databricks/STATUS.md` |
| LGPD | seção no relatório + CLO |

## 03 BI & Startup (p. 41–42)

| Item | Onde no ZIP |
|---|---|
| Pitch ~5 min | `pitch-alerta-cidade.mp4` |
| Evidência pública | roteiro + Open-Meteo no texto |
| Modelo de negócio + ODS | `modelo-negocio.md` |
| MVP | link em `LINKS.json` |

## 04 Computer Vision (p. 43–44)

| Item | Onde no ZIP |
|---|---|
| Código + treino | repo + `treino-sintetico/` |
| PDF estruturado | `relatorio-tecnico.pdf` |
| Dataset licenciado | `DATASET.md` + `dataset-photos/` |
| Vídeo | `video-demo.mp4` |

## 05 RPA (p. 45–50)

| Item | Onde no ZIP |
|---|---|
| Mapa/BPMN | `processo.bpmn` |
| Decisão + loop + exceções | relatório + runner |
| Logs sanitizados | `logs/` |
| E2E + testes | evidência no relatório; `npm test` no repo |
| Vídeo ≤3 min | `video-demo.mp4` (~1 min) |

## 06 Secure DevOps (p. 51–53)

| Item | Onde no ZIP |
|---|---|
| Dockerfile / Compose / TF | `compose.yaml`, `terraform/` |
| Scanners barram → corrigem | `evidencias/ci-*` |
| CI GitHub Actions | links + logs |
| Prometheus/Grafana alerta | `evidencias/prometheus-*` |
| MVP HTTPS / custo R$0 | `LINKS.json`, `custo-cotacao.md` |

## Lacunas conscientes (não bloqueiam o ZIP)

| Lacuna | Mitigação no pacote |
|---|---|
| YouTube não listado | MP4 no ZIP + release GitHub; Founder publica se o portal exigir |
| Databricks Free UI | Airflow + lakehouse local + STATUS; Founder completa Volume se conseguir |
| Azure pago | CI stub + Cloudflare R$0 documentado |

## Nota esperada

Com o ZIP + envio Teams + links públicos ativos, o pacote cobre **todos os itens locais exigidos**. Itens 100% externos (YouTube OAuth, Databricks CAPTCHA, presença em aula) ficam com o Founder em minutos.
