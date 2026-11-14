# MVP — Alerta Cidade

Aplicação de demonstração em Node.js sem dependências npm. A tela principal apresenta status/fonte/dados (fixture marcada como sintética por padrão), aponta para canais oficiais e permite perguntar à base local com RAG.

## Iniciar

```powershell
node .\MVP\server.mjs
```

Abra `http://localhost:3000`. Endpoints:

- `GET /api/health`
- `GET /api/alerts`
- `POST /api/ask` — depende de Ollama local; retorna erro explícito se indisponível.
- `POST /api/alerts/import` — requer `GS_INGEST_TOKEN` e payload Open-Meteo validado.
- `GET /metrics` — Prometheus.

Para ingestão, defina `GS_INGEST_TOKEN` apenas no ambiente. Não há usuário ou localização individual no esquema. As regras de precipitação são heurísticas de demonstração, não alertas oficiais.
