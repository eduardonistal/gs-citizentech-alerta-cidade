# Relatório técnico — Big Data Architecture & Data Integration

## Identificação

- Integrante único e responsável pelo envio: **Eduardo de Oliveira Nistal — RM94524**.
- Produto: Alerta Cidade
- Pergunta do MVP: como apresentar, com fonte e data, previsão pública de chuva para o ponto demonstrativo?

## 1. Diagrama do fluxo

`Open-Meteo + IBGE → Airflow DAG paralelo → chegada/{fonte}/{data}.json → upload em Volume Databricks → Auto Loader Bronze → limpeza/MERGE Prata → fato + dimensões Ouro → GET /api/alerts no MVP`

O Databricks Free Edition não se conecta diretamente ao Airflow; o upload ao Volume é manual e em lotes, conforme o PDF.

### Evidência local de coleta (APIs reais)

Em 14/11/2026, `scripts/collect-sources.mjs` coletou **dois lotes** de datas distintas nas mesmas fontes do DAG:

| Lote | Data lógica | Arquivos em `chegada/` |
|---|---|---|
| 1 | 2026-11-13 | `open_meteo/open_meteo_2026-11-13.json`, `ibge_municipios/ibge_municipios_2026-11-13.json` |
| 2 | 2026-11-14 | `open_meteo/open_meteo_2026-11-14.json`, `ibge_municipios/ibge_municipios_2026-11-14.json` |

Inventário e metadados: `data/coleta-evidencia.json`. Isso demonstra fontes reais e pasta de pouso; **não substitui** prints do Airflow Graph/Grid nem contagens do Databricks.

## 2. Fontes

| Origem | Formato | Frequência | Dados pessoais |
|---|---|---|---|
| Open-Meteo Forecast API | JSON | diária no DAG | não |
| API de Localidades IBGE | JSON | diária no DAG | não |

## 3. Requisitos 01–09 (na ordem)

1. Duas fontes relevantes, ambas públicas; Open-Meteo é externa. **Atendido.**
2. DAG agendado em `dags/gs_coleta.py` grava em `chegada/`. **Código pronto; execução no Airflow pendente de ambiente.**
3. Duas coletas em paralelo + verificação; sem chaves no código. **Código pronto.** Coleta local equivalente executada.
4. Dois lotes de datas distintas gerados localmente em `chegada/`. **Upload ao Volume Databricks pendente.**
5. Auto Loader / checkpoint em `databricks/01_bronze.py`. **Contagens Databricks pendentes.**
6. Prata com MERGE e regras em `databricks/02_prata.sql`. **Contagens por regra pendentes.**
7. Ouro dimensional + 5 SQL em `databricks/03_ouro.sql`. **Resultados Databricks pendentes.**
8. Sem dados pessoais; contrato MVP `/api/alerts`. Print pós-execução pendente.
9. README e este relatório com integrante identificado. URL pública do repositório pendente.

## 4. Evidência Airflow

Anexar prints legíveis de Graph e Grid com execuções concluídas após subir o DAG no Airflow 3.

## 5. Contagens incrementais

| Execução | Arquivos novos | Bronze antes | Bronze depois | Duplicatas |
|---|---:|---:|---:|---:|
| Lote 1 (2026-11-13) | 2 (local) | pendente Databricks | pendente | pendente |
| Lote 2 (2026-11-14) | 2 (local) | pendente Databricks | pendente | pendente |
| Reexecução | 0 esperado | pendente | pendente | 0 esperado |

## 6. Consultas SQL e interpretação

Q1–Q5 estão em `databricks/03_ouro.sql` (previsão por dia, maiores precipitações, média por nível, cobertura municipal, dias de chuva intensa como indicador potencial). Salvar resultados após execução no warehouse.

## 7. Conclusão e repositório

Pipeline e amostras reais de `chegada/` preparados. Restam Airflow/Databricks com prints, repositório público e envio no Teams por Eduardo de Oliveira Nistal — RM94524 — até 19/11/2026 às 23h55.
