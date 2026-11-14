# Big Data Architecture & Data Integration

Integrante único e responsável pelo envio: **Eduardo de Oliveira Nistal — RM94524**.

## Pipeline

Open-Meteo + IBGE → Airflow 3 (`dags/gs_coleta.py`) → `chegada/` → Volume Databricks → Bronze → Prata → Ouro → MVP.

## Coleta real local (dois lotes)

```powershell
npm run collect-data
```

Gera `chegada/open_meteo/` e `chegada/ibge_municipios/` para **2026-11-13** e **2026-11-14**, com inventário em `data/coleta-evidencia.json`. Em seguida, envie os arquivos ao Volume Databricks em lotes e execute os notebooks/SQL em `databricks/`.

## Simulação sintética

`scripts/simulate-pipeline.mjs` demonstra Bronze→Prata→Ouro em memória a partir de fixture sintético; não substitui Airflow/Databricks.

## Status honesto

Código e amostras de pouso prontos. Prints Airflow Graph/Grid, contagens Bronze/Prata e resultados SQL no Databricks ainda dependem das contas FIAP/equipe. PDF: `docs/relatorio-tecnico.pdf` (regenerar com `npm run render-reports`).
