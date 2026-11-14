# Robotic Process Automation

Integrante único e responsável pelo envio: **Eduardo de Oliveira Nistal — RM94524**.

## Execução ponta a ponta (verificada)

```powershell
$env:GS_INGEST_TOKEN='defina-um-segredo-local'
node .\MVP\server.mjs
# outro terminal:
npm run rpa
```

Em 14/11/2026 a automação coletou Open-Meteo, aplicou decisão/repetição por data e publicou 3 alertas no MVP. Log sanitizado: `logs/run-2026-11-14T18-05-44-172Z.jsonl`.

## Alternativa n8n

Importe `workflow/Alerta-Cidade-n8n.json`, configure Header Auth (`Authorization: Bearer …`) alinhado a `GS_INGEST_TOKEN` e agende a execução.

## Testes

```powershell
node --test .\test\process.test.mjs .\test\run-automation.test.mjs
node --test ..\MVP\test\ingest.test.mjs
```

BPMN/PDD: `docs/processo.bpmn`. Relatório: `docs/relatorio-tecnico.md`.  
Vídeo local (narração pt-BR): [`../videos/05-rpa-demo.mp4`](../videos/05-rpa-demo.mp4).  
YouTube e envio no Teams: pendentes.
