# Databricks notebook source
# Requer upload de arquivos de pelo menos duas datas ao Volume workspace/gs/chegada.

from pyspark.sql import functions as F

base = "/Volumes/workspace/gs/chegada"
checkpoint = f"{base}/_controle/checkpoint_open_meteo"
schema = f"{base}/_controle/schema_open_meteo"

(
    spark.readStream.format("cloudFiles")
    .option("cloudFiles.format", "json")
    .option("cloudFiles.schemaLocation", schema)
    .load(f"{base}/open_meteo")
    .withColumn("arquivo_origem", F.col("_metadata.file_path"))
    .withColumn("carregado_em", F.current_timestamp())
    .writeStream.option("checkpointLocation", checkpoint)
    .trigger(availableNow=True)
    .toTable("workspace.gs.bronze_open_meteo")
)

(
    spark.readStream.format("cloudFiles")
    .option("cloudFiles.format", "json")
    .option("cloudFiles.schemaLocation", f"{base}/_controle/schema_ibge")
    .option("multiLine", "true")
    .load(f"{base}/ibge_municipios")
    .withColumn("arquivo_origem", F.col("_metadata.file_path"))
    .withColumn("carregado_em", F.current_timestamp())
    .writeStream.option("checkpointLocation", f"{base}/_controle/checkpoint_ibge")
    .trigger(availableNow=True)
    .toTable("workspace.gs.bronze_ibge")
)

# Valide contagens por arquivo antes/depois de cada lote; reexecutar deve adicionar zero duplicatas.
