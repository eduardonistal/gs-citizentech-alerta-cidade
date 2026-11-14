# Checklist de capturas — Big Data

**Responsável:** Eduardo de Oliveira Nistal — RM94524.  
**Objetivo:** reunir evidências reais para o PDF da disciplina. O simulador local não substitui nenhuma captura do Airflow ou Databricks.

## Capturas necessárias

| # | Captura/arquivo | O que precisa ficar legível | Verificação antes de anexar |
|---|---|---|---|
| 1 | Arquitetura ponta a ponta | Duas fontes, Airflow, chegada/Volume, Bronze, Prata, Ouro e integração com MVP | URL, nome de fonte, direção do fluxo e limites do MVP coerentes com a execução. |
| 2 | Fontes de dados | Open-Meteo e API de Localidades IBGE | URL, campos usados, data de coleta e atribuição/licença aplicável. |
| 3 | Airflow — Graph | DAG agendado, duas tarefas de coleta em paralelo e verificação de arquivos | Execução concluída e dependências visíveis; não usar captura de DAG apenas importado. |
| 4 | Airflow — Grid/logs | Data/hora e estado das execuções | Incluir execuções de sucesso e tratar falhas sem esconder erros. |
| 5 | Dois lotes no Volume | Arquivos com datas distintas e nomes por fonte/data | Mostrar os dois lotes reais e a data; não usar somente `forecast.synthetic.json`. |
| 6 | Bronze incremental | Checkpoint e contagens antes/depois dos dois lotes | Registrar arquivos novos, linhas lidas, duplicatas e reexecução idempotente. |
| 7 | Prata | MERGE e pelo menos três regras de qualidade | Para cada regra, registrar contagens antes/depois e valores inválidos removidos. |
| 8 | Ouro | Uma tabela fato e duas dimensões | Mostrar esquema, chaves/relacionamentos e ausência de dados pessoais desnecessários. |
| 9 | Consultas | Cinco consultas executadas, incluindo a análise de impacto | Salvar SQL, resultados e interpretação; chamar o indicador de potencial, não impacto observado. |
| 10 | MVP | Tela/endpoint exibindo dado integrado com fonte e data | Mostrar a tela real depois da ingestão e diferenciar informação meteorológica de ocorrência confirmada. |

## Registro de cada evidência

Para cada captura, anotar data/hora, ambiente, execução/lote relacionado e breve legenda. Usar recortes legíveis sem esconder erros, identificadores sensíveis ou contexto que altere a interpretação. Não fabricar prints nem preencher contagens com estimativas.

**Status:** Airflow/Databricks ainda não foram executados; todas as evidências acima permanecem pendentes.
