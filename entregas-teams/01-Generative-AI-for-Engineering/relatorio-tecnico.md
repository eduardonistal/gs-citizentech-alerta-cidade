# Relatório técnico — Generative AI for Engineering

## Identificação

- Produto: Alerta Cidade
- Integrante único e responsável pelo envio: **Eduardo de Oliveira Nistal — RM94524**.
- Componente: agente local de orientação preventiva sobre previsão meteorológica e fontes oficiais

## Ficha técnica

A IA responde perguntas restritas à previsão pública de chuva, aos limites da demonstração e a fontes oficiais. Não confirma alagamento, não prescreve rota e não substitui autoridades. O modelo deve recusar perguntas sem evidência.

## Pipeline

`pergunta → (baseline sem contexto | recuperação lexical expandida → trechos curados) → mesmo LLM local Ollama → sanitização/validação JSON/citações → resposta ou recusa`

O modo `baseline` consulta o mesmo modelo sem contexto; `rag` usa recuperação e instrução de fundamentação; `agent` acrescenta instrução especializada de prevenção e encaminhamento. Esta especialização é um agente por prompt, não fine-tuning. Modelo da rodada corrigida: `qwen2.5:7b` (temperatura 0).

```text
[usuário] → retrieveKnowledge(+sinônimos)
          → lacksAnswerableEvidence? → recusa
          → Ollama /api/generate (JSON schema)
          → sanitize + attachMissingCitations
          → validateGroundedAnswer → MVP /api/ask
```

## Base de conhecimento

| ID | Fonte | Formato/licença | Trechos |
|---|---|---|---:|
| meteo-precipitation | Open-Meteo docs | JSONL; consultar licença/atribuição vigentes antes de publicar | 1 |
| defesa-civil-guidance | Defesa Civil Nacional | JSONL derivado de fonte pública; confirmar termos de uso | 1 |
| cgesp | CGE São Paulo | JSONL derivado de fonte pública; confirmar termos de uso | 1 |
| ibge-localidades | API de Localidades IBGE | JSONL; consultar termos de uso/atribuição | 1 |

Todos os trechos ficam em `base/knowledge.jsonl` com URL de origem. São resumos curtos, não cópias integrais dos sites.

## Avaliação e desempenho

`avaliacao/test_cases.jsonl` contém seis perguntas com gabarito, incluindo casos de recusa ("não consta"). Limiar de recuperação: **ao menos 1 termo lexical coincidente após expansão de sinônimos**; no conjunto atual, recall@1 = 0,875 e recall@3 = 1,000. Rodada corrigida em 14/11/2026 com `qwen2.5:7b`:

| Modo | Saída válida | Recall de citações | Acurácia responder/recusar | Task compliance | Recall recuperação @1/@3 |
|---|---:|---:|---:|---:|---:|
| Baseline sem contexto | 1,000 | 0,000¹ | 0,333 | 0,333 | 0,875 / 1,000 |
| RAG | 1,000 | 1,000 | 1,000 | 1,000 | 0,875 / 1,000 |
| Agente | 1,000 | 1,000 | 1,000 | 1,000 | 0,875 / 1,000 |

¹ Baseline não recebe contexto e não pode citar fontes. Task compliance exige decisão correta de responder/recusar e cobertura das citações esperadas. No placar, RAG e agente (1,000) superam o mesmo modelo sem contexto (0,333).

Os cinco erros observados na rodada `3b` e as correções estão em `avaliacao/erros-reais.md`. A saída inicial permanece em `avaliacao/results.initial-prompt.json`.

## Reprodutibilidade

1. Instalar Node.js 20+ e Ollama.
2. Executar `ollama pull qwen2.5:7b`.
3. `$env:OLLAMA_MODEL='qwen2.5:7b'; node avaliacao/benchmark.mjs`
4. Revisar `avaliacao/results.json` e o notebook `notebooks/benchmark.ipynb`.

## Segurança, explicabilidade e LGPD

Inferência somente em Ollama local. Citações precisam existir no contexto recuperado. A base não contém dados pessoais. Respostas encaminham a fontes oficiais e não automatizam decisão de risco individual.

## Conclusão e links

Código, base, casos, notebook, placar e erros estão nesta pasta. Repositório: https://github.com/eduardonistal/gs-citizentech-alerta-cidade. Vídeo local: [`../../videos/01-generative-ai-demo.mp4`](../../videos/01-generative-ai-demo.mp4). YouTube não listado e envio no Teams: **pendentes** (Eduardo de Oliveira Nistal — RM94524).
