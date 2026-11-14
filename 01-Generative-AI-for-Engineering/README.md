# Generative AI for Engineering

Integrante único e responsável pelo envio: **Eduardo de Oliveira Nistal — RM94524**.

Pacote alinhado ao PDF: código/API, base com fontes, casos com gabarito (inclui “não consta”), notebook, relatório, placar das três configurações e cinco erros reais com correção.

## Rodar

Requer Node.js 20+ e Ollama local:

```powershell
ollama pull qwen2.5:7b
$env:OLLAMA_MODEL='qwen2.5:7b'
node .\MVP\server.mjs
```

Endpoint integrado: `POST http://127.0.0.1:3000/api/ask` com `{"question":"...","mode":"rag"|"agent"|"baseline"}`.

Benchmark:

```powershell
$env:OLLAMA_MODEL='qwen2.5:7b'; node .\avaliacao\benchmark.mjs
```

Rodada verificada em 14/11/2026: RAG e agente com task compliance **1,000** frente ao baseline **0,333** no mesmo modelo; recall@3 de recuperação **1,000**. Detalhes em `docs/relatorio-tecnico.md` e `avaliacao/erros-reais.md`.

## Escopo ainda externo

Repositório GitHub público, vídeo e envio no Teams continuam pendentes do aluno.
