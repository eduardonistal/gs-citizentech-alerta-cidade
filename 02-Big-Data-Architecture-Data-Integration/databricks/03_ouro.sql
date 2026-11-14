CREATE OR REPLACE TABLE workspace.gs.dim_local AS
SELECT CAST(municipio.id AS STRING) AS local_id,
       municipio.nome,
       municipio.microrregiao.mesorregiao.UF.nome AS estado
FROM workspace.gs.bronze_ibge
LATERAL VIEW EXPLODE(municipios) AS municipio
WHERE municipio.id = 3550308;

CREATE OR REPLACE TABLE workspace.gs.dim_data AS
SELECT DISTINCT data FROM workspace.gs.prata_previsao;

CREATE OR REPLACE TABLE workspace.gs.fato_previsao AS
SELECT
  local_id,
  data,
  precipitacao_mm,
  probabilidade_pct,
  CASE
    WHEN precipitacao_mm >= 50 OR probabilidade_pct >= 85 THEN 'alto'
    WHEN precipitacao_mm >= 20 OR probabilidade_pct >= 60 THEN 'atencao'
    ELSE 'informativo'
  END AS nivel_demonstrativo
FROM workspace.gs.prata_previsao;

-- Q1 — previsão por dia exibida ao cidadão
SELECT d.data, f.precipitacao_mm, f.probabilidade_pct, f.nivel_demonstrativo
FROM workspace.gs.fato_previsao f JOIN workspace.gs.dim_data d USING (data)
ORDER BY d.data;

-- Q2 — dias com maior precipitação
SELECT data, precipitacao_mm FROM workspace.gs.fato_previsao ORDER BY precipitacao_mm DESC LIMIT 10;

-- Q3 — probabilidade média por nível demonstrativo
SELECT nivel_demonstrativo, AVG(probabilidade_pct) AS media_pct
FROM workspace.gs.fato_previsao GROUP BY nivel_demonstrativo;

-- Q4 — cobertura territorial preparada para extensão
SELECT l.estado, COUNT(*) AS previsoes
FROM workspace.gs.fato_previsao f JOIN workspace.gs.dim_local l USING (local_id)
GROUP BY l.estado;

-- Q5 — impacto potencial (dias de alta precipitação; não é impacto observado)
SELECT COUNT(*) AS dias_com_chuva_intensa
FROM workspace.gs.fato_previsao WHERE precipitacao_mm >= 50;

-- Publicar somente os campos necessários. Não há dados pessoais nesta Ouro demonstrativa.
