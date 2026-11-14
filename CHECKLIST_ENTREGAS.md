# Conferência das entregas contra o PDF

**Escopo:** seis disciplinas; Project-Based Maker Lab excluída.  
**Fonte normativa:** [PDF oficial](./docs/Desafio-FIAP-GS-CitizenTech%204ES.pdf).  
**Prazo:** 19/11/2026 às 23h55.  
**Equipe:** Eduardo de Oliveira Nistal — RM94524.

Legenda: **Verificado** = executado localmente com evidência; **Preparado** = artefato pronto; **Pendente externo** = Teams/GitHub/YouTube/contas/cloud.

## Regras gerais (PDF, p. 24)

| Requisito | Situação |
|---|---|
| Mesma equipe e mesmo produto | Verificado nos materiais (integrante único + Alerta Cidade). |
| Um integrante envia cada disciplina | Responsável: Eduardo de Oliveira Nistal — RM94524. |
| Presença nas aulas | Pendente externo (registro FIAP). |
| Enviar no Teams até o prazo | Pendente externo. |
| Links públicos na correção | Repo: https://github.com/eduardonistal/gs-citizentech-alerta-cidade. MVP túnel: `https://sweet-moose-pump.loca.lt`. Vídeos locais prontos em [`videos/`](./videos/) (narração pt-BR); falta publicar no YouTube não listado e colar URLs. |

## Situação por disciplina

| Disciplina | Atendido localmente agora | Ainda pendente para 100% do PDF |
|---|---|---|
| **Generative AI (p. 29–31)** | Base+fontes; 6 casos com “não consta”; recall@1/@3; JSON/citações/recusa; agente vs RAG vs baseline; placar interpretado; 5 erros com correção; notebook; README. Benchmark `qwen2.5:7b` **verificado**: task compliance RAG/agente **1,000** vs baseline **0,333**. Vídeo local: [`videos/01-generative-ai-demo.mp4`](./videos/01-generative-ai-demo.mp4). | YouTube não listado + URL no README + envio Teams. |
| **Big Data (p. 32–38)** | 2 fontes reais; DAG paralelo; Bronze/Prata/Ouro/SQL; LGPD; README; **2 lotes reais** em `chegada/` (13 e 14/11/2026); PDF regenerável. | Airflow Graph/Grid, upload Volume, contagens Databricks, prints, Teams. |
| **BI & Startup (p. 41–42)** | Roteiro 5 min com evidência Open-Meteo verificada (0,10 mm em 14/11/2026); modelo de negócio; ODS 11/13. Vídeo local: [`videos/03-pitch-alerta-cidade.mp4`](./videos/03-pitch-alerta-cidade.mp4). | YouTube não listado + MVP URL estável + Teams. |
| **Computer Vision (p. 43–44)** | Código YOLO + treino HSV **executado** (F1=1,000 sintético); PDF com título, integrante, resumo≈250, objetivo≈50, ferramentas, metodologia, resultados, conclusão. Vídeo local: [`videos/04-computer-vision-demo.mp4`](./videos/04-computer-vision-demo.mp4). | Dataset fotográfico licenciado + YouTube + Teams. |
| **RPA (p. 45–50)** | Mapa/BPMN; decisão+loop; exceções; logs sanitizados; **execução ponta a ponta verificada** (3 itens publicados no MVP); testes sucesso/falha; README. Vídeo local: [`videos/05-rpa-demo.mp4`](./videos/05-rpa-demo.mp4). | YouTube ≤3 min + PDF com links finais + Teams. |
| **Secure DevOps (p. 51–53)** | Dockerfile não-root, Compose, Terraform, workflow Gitleaks/Semgrep/Trivy, dashboard 4 métricas, runbook, template de custo, README. | Docker local/CI real, deploy público, execução barrada+corrigida, alerta disparado, custo cotado, repo público, Teams. Teto cloud informado: R$ 0. |

## Resultado

**Artefatos e execuções locais foram ampliados e os testes passam (40/40).**  
**A submissão ainda não está 100% completa no sentido do PDF**, porque o enunciado exige publicações e evidências externas (GitHub, YouTube, Teams, Airflow/Databricks, cloud) que este ambiente não substitui.

## O que o aluno precisa fazer para fechar 100%

1. Publicar os 4 MP4 de [`videos/`](./videos/) no YouTube como **não listado**, testar em janela anônima e colar as URLs nos READMEs.
2. Manter MVP público (túnel local ou Vercel/Render). Regenerar: `npm run generate-videos`.
3. Subir DAG no Airflow + lotes no Databricks Free Edition e capturar prints.
4. Enviar cada PDF/link no **Teams** da disciplina até 19/11/2026 23h55.
