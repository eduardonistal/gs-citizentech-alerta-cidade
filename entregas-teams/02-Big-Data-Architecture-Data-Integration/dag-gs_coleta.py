"""DAG compatível com Airflow 2.x (TaskFlow) para evidências Graph/Grid."""
from __future__ import annotations

import json
import os
from datetime import datetime
from pathlib import Path
from tempfile import NamedTemporaryFile

import requests
from airflow.decorators import dag, task

ARRIVAL = Path(os.environ.get("GS_ARRIVAL_DIR", "/opt/airflow/data/chegada"))
LATITUDE = float(os.environ.get("GS_LATITUDE", "-23.55"))
LONGITUDE = float(os.environ.get("GS_LONGITUDE", "-46.63"))


def _write_json(collection: str, ds: str, payload: object) -> str:
    directory = ARRIVAL / collection
    directory.mkdir(parents=True, exist_ok=True)
    target = directory / f"{collection}_{ds}.json"
    with NamedTemporaryFile("w", encoding="utf-8", dir=directory, delete=False) as handle:
        json.dump(payload, handle, ensure_ascii=False)
        temporary = Path(handle.name)
    temporary.replace(target)
    return str(target)


@dag(
    dag_id="gs_alerta_cidade_coleta",
    description="Coleta paralela de previsão pública e metadados territoriais",
    schedule="@daily",
    start_date=datetime(2026, 10, 1),
    catchup=False,
    max_active_runs=1,
    tags=["gs", "citizentech", "dados-publicos"],
)
def gs_alerta_cidade_coleta():
    @task
    def collect_weather(ds: str | None = None) -> str:
        if not ds:
            raise ValueError("Airflow não informou a data lógica da execução")
        response = requests.get(
            "https://api.open-meteo.com/v1/forecast",
            params={
                "latitude": LATITUDE,
                "longitude": LONGITUDE,
                "daily": "precipitation_sum,precipitation_probability_max",
                "timezone": "America/Sao_Paulo",
                "forecast_days": 7,
            },
            timeout=30,
        )
        response.raise_for_status()
        return _write_json("open_meteo", ds, response.json())

    @task
    def collect_ibge(ds: str | None = None) -> str:
        if not ds:
            raise ValueError("Airflow não informou a data lógica da execução")
        response = requests.get(
            "https://servicodados.ibge.gov.br/api/v1/localidades/municipios/3550308",
            timeout=30,
        )
        response.raise_for_status()
        return _write_json("ibge_municipios", ds, response.json())

    @task
    def verify_arrival(weather_path: str, ibge_path: str) -> dict:
        weather = Path(weather_path)
        ibge = Path(ibge_path)
        if not weather.exists() or not ibge.exists():
            raise FileNotFoundError("Arquivos de chegada ausentes após coleta")
        return {
            "weather_bytes": weather.stat().st_size,
            "ibge_bytes": ibge.stat().st_size,
            "weather": str(weather),
            "ibge": str(ibge),
        }

    weather = collect_weather()
    ibge = collect_ibge()
    verify_arrival(weather, ibge)


gs_alerta_cidade_coleta()
