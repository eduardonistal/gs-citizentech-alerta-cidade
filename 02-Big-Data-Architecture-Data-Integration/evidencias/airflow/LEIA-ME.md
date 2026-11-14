# Evidências Airflow (14/11/2026)

- UI: http://127.0.0.1:8080 (admin)
- DAG: gs_alerta_cidade_coleta
- 2 execuções success (scheduled + manual)
- Tarefas paralelas: collect_weather || collect_ibge -> verify_arrival
- Prints: 01-dags-home.png, 02-graph.png, 03-grid-details.png
- JSON: dag-runs.json, task-states.json
