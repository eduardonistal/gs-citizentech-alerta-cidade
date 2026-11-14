# Relatório técnico — Robotic Process Automation

## Identificação

- Integrante único e responsável pelo envio: **Eduardo de Oliveira Nistal — RM94524**.
- CitizenTech: Alerta Cidade
- Problema: atualização operacional de previsão pública e publicação rastreável no MVP.

## Objetivo e benefício ao cidadão

Automatizar a coleta, validação, classificação demonstrativa e publicação de dados meteorológicos públicos, reduzindo atualização manual e mantendo origem/data visíveis. O fluxo não emite alerta oficial.

## Processo e desenho

Agenda/execução → GET Open-Meteo → validação → **decisão + repetição** sobre cada data do retorno → POST autenticado `/api/alerts/import` → auditoria sanitizada.

- BPMN: `docs/processo.bpmn`
- Workflow n8n (alternativa visual): `workflow/Alerta-Cidade-n8n.json`
- Runner executável (Node, ponta a ponta): `src/run-automation.mjs`

## Tecnologias e justificativa

O PDF permite N8N/Python/Power Automate. Aqui:

- **Node.js runner** (`src/run-automation.mjs`) — execução verificável sem depender de UI; mesma lógica de decisão/lote/exceção.
- **n8n** — orquestração visual importável equivalente.
- Open-Meteo sem credencial; token Bearer só em ambiente (`GS_INGEST_TOKEN`).

## Evidência de execução real (14/11/2026)

Com MVP em `http://127.0.0.1:3000` e token de ambiente:

```text
success=true processed=3 published=3 accepted_days=3 rejected_days=0
log=logs/run-2026-11-14T18-05-44-172Z.jsonl
```

O log registra etapas `start` → `collect` → `publish` **sem** token, Authorization ou payload sensível. O MVP passou a servir os alertas ingeridos em `GET /api/alerts`.

## Regras de negócio, decisões e lote

- Percorrer cada data de `daily.time` (estrutura de repetição).
- Decisão: aceitar só datas válidas com precipitação ≥ 0 e probabilidade 0–100.
- Publicar lote no contrato do MVP.

## Exceções e resiliência

| Exceção | Comportamento | Evidência de teste |
|---|---|---|
| Fonte indisponível | Interrompe sem publicar; log `source_unavailable` | `test/run-automation.test.mjs` |
| Previsão inválida | Rejeita lote antes do POST | `test/process.test.mjs` |
| 401/403 | Falha `unauthorized` sem retry cego | código + matriz abaixo |
| 429 | Falha `rate_limited` | código |

## Logs e auditoria

- Execução real: `logs/run-2026-11-14T18-05-44-172Z.jsonl`
- Exemplo sintético didático: `logs/sample.json` (marcado sintético)

## Integração com o MVP

`POST /api/alerts/import` → gravação atômica → `GET /api/alerts`. Testes: `MVP/test/ingest.test.mjs`, `test/process.test.mjs`, `test/run-automation.test.mjs`.

## Vídeo e publicação

Roteiro em `docs/roteiro-video-demo.md`. Vídeo local: [`../../videos/05-rpa-demo.mp4`](../../videos/05-rpa-demo.mp4). YouTube e envio no Teams: **pendentes** (Eduardo de Oliveira Nistal — RM94524, até 19/11/2026 23h55).
