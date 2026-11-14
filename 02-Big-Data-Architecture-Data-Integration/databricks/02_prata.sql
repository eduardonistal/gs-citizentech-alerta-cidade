CREATE TABLE IF NOT EXISTS workspace.gs.prata_previsao (
  local_id STRING,
  data DATE,
  latitude DOUBLE,
  longitude DOUBLE,
  precipitacao_mm DOUBLE,
  probabilidade_pct INT,
  arquivo_origem STRING,
  carregado_em TIMESTAMP
)
USING DELTA;

CREATE OR REPLACE TEMP VIEW lote_prata AS
SELECT
  '3550308' AS local_id,
  TO_DATE(dados.time) AS data,
  CAST(latitude AS DOUBLE) AS latitude,
  CAST(longitude AS DOUBLE) AS longitude,
  CAST(dados.precipitation_sum AS DOUBLE) AS precipitacao_mm,
  CAST(dados.precipitation_probability_max AS INT) AS probabilidade_pct,
  arquivo_origem,
  carregado_em
FROM workspace.gs.bronze_open_meteo
LATERAL VIEW EXPLODE(arrays_zip(
  daily.time,
  daily.precipitation_sum,
  daily.precipitation_probability_max
)) AS dados;

CREATE OR REPLACE TABLE workspace.gs.controle_qualidade AS
SELECT 'data_nula' AS regra, COUNT(*) AS barrados FROM lote_prata WHERE data IS NULL
UNION ALL
SELECT 'precipitacao_nula' AS regra, COUNT(*) AS barrados FROM lote_prata WHERE precipitacao_mm IS NULL
UNION ALL
SELECT 'precipitacao_negativa' AS regra, COUNT(*) AS barrados FROM lote_prata WHERE precipitacao_mm < 0
UNION ALL
SELECT 'probabilidade_fora_intervalo' AS regra, COUNT(*) AS barrados FROM lote_prata
WHERE probabilidade_pct < 0 OR probabilidade_pct > 100;

CREATE OR REPLACE TEMP VIEW lote_prata_valido AS
SELECT * FROM lote_prata
WHERE data IS NOT NULL
  AND precipitacao_mm >= 0
  AND probabilidade_pct BETWEEN 0 AND 100;

MERGE INTO workspace.gs.prata_previsao AS alvo
USING lote_prata_valido AS novo
ON alvo.local_id = novo.local_id AND alvo.data = novo.data
WHEN MATCHED THEN UPDATE SET *
WHEN NOT MATCHED THEN INSERT *;

-- Registre contagens barradas por cada regra antes da publicação da Ouro.
