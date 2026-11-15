# Organograma — Alerta Cidade (modo entrega GS)

Espelha a sede IAtelefonista (CEO + áreas), mas com **demandas próprias do PDF CitizenTech**.

```text
                    ┌──────────────┐
                    │   FOUNDER    │  Eduardo — RM94524
                    │  (Teams)     │
                    └──────┬───────┘
                           │
                    ┌──────▼───────┐
                    │ CEO Entrega  │  ZIP único + rubrica
                    └──────┬───────┘
     ┌──────────┬──────────┼──────────┬──────────┬──────────┐
     │          │          │          │          │          │
  GenAI      Dados      BI/Pitch   Visão       RPA     DevSecOps
     │          │          │          │          │          │
   RAG/      Airflow    Modelo     HSV/      n8n+API   CI+TF+
  agente    lakehouse   ODS/pitch  YOLO      BPMN     Prometheus
                           │
                    ┌──────┴──────┐
                 ┌──▼──┐      ┌──▼──┐
                 │ CLO │      │CISO │
                 │LGPD │      │scan │
                 └─────┘      └─────┘
```

## Mandatos

| Área | Entrega PDF | Não faz |
|---|---|---|
| GenAI | base, RAG, agente, métricas, notebook, vídeo | pitch de startup |
| Dados | 2 fontes, DAG, Bronze/Prata/Ouro, evidências | marketing |
| BI | pitch ≤5 min, modelo, ODS | código de pipeline |
| Visão | treino, PDF, dataset, vídeo | RPA |
| RPA | BPMN, exceções, E2E, vídeo ≤3 min | IaC cloud |
| DevOps | Docker/TF/CI/scanners/observabilidade, R$0 | dataset CV |
| CLO | limites do produto, LGPD, “não alerta oficial” | deploy |
| CISO | evidência Gitleaks/Trivy/Semgrep barrada→limpa | pitch |

## Fan-out (regra)

1 comando “montar entrega nota 10” → 6 packs de disciplina + sede `empresa/` + ZIP mestre.  
Conflito de escopo sobe ao CEO → Founder decide o que vai no Teams.
