# GS CitizenTech — Alerta Cidade

Este diretório organiza os entregáveis locais da Global Solution 2026 em seis pastas, uma por disciplina. A última disciplina do PDF, **Project-Based Maker Lab**, foi intencionalmente excluída.

## Produto comum

**Alerta Cidade** é um MVP demonstrativo de informação preventiva sobre chuva intensa e possível alagamento em São Paulo. Usa previsões públicas, explica a origem dos dados e não se apresenta como alerta oficial nem recomenda rotas de evacuação. O foco em segurança e mobilidade é uma proposta inicial baseada no briefing; não foi validada com moradores ou órgãos públicos.

O mesmo produto conecta os componentes de dados, IA generativa, visão computacional, automação e nuvem. A ficha técnica e os contratos estão em [`FICHA_TECNICA_MVP.md`](./FICHA_TECNICA_MVP.md).

## Pastas

1. [`01-Generative-AI-for-Engineering`](./01-Generative-AI-for-Engineering/) — RAG local, agente especializado e avaliação.
2. [`02-Big-Data-Architecture-Data-Integration`](./02-Big-Data-Architecture-Data-Integration/) — Airflow, camadas Bronze/Prata/Ouro e consultas.
3. [`03-Business-Intelligence-Startup-Development`](./03-Business-Intelligence-Startup-Development/) — roteiro do pitch e modelo de negócio.
4. [`04-Applied-Computer-Vision`](./04-Applied-Computer-Vision/) — treinamento e demonstração de detecção de alagamento.
5. [`05-Robotic-Process-Automation`](./05-Robotic-Process-Automation/) — fluxo n8n, tratamento de exceções e integração.
6. [`06-Secure-DevOps-Tools-Cloud-Computing`](./06-Secure-DevOps-Tools-Cloud-Computing/) — container, IaC, CI/CD e observabilidade.
7. [`MVP`](./MVP/) — aplicação integrada de demonstração.

## Rodar o MVP local

Requer Node.js 20 ou superior, sem dependências npm:

```powershell
node .\MVP\server.mjs
```

Abra `http://localhost:3000`. Os dados iniciais são explicitamente sintéticos. Para executá-los:

```powershell
npm test
```

`npm ci` instala a dependência usada somente para regenerar os PDFs com `npm run render-reports`; o servidor e os testes usam apenas Node.js.

## Estado real da entrega

Artefatos locais ampliados e verificados em 14/11/2026: GenAI com placar RAG/agente > baseline (`qwen2.5:7b`), coleta Big Data com dois lotes reais em `chegada/`, RPA ponta a ponta no MVP, treino HSV de visão (sintético) e `npm test` 40/40.

**Repositório público:** https://github.com/eduardonistal/gs-citizentech-alerta-cidade  
**MVP (túnel):** https://sweet-moose-pump.loca.lt  

**Vídeos locais prontos** (narração pt-BR): [`videos/`](./videos/) — regenerar com `npm run generate-videos`.  
**Ainda faltam para 100% do PDF:** YouTube não listado, Teams, Airflow/Databricks com prints e deploy cloud permanente. Detalhes em [`CHECKLIST_ENTREGAS.md`](./CHECKLIST_ENTREGAS.md).

Prazo geral indicado no PDF: **19/11/2026 às 23h55**, no Teams/portal de cada disciplina. O PDF limita cada equipe a cinco alunos da mesma turma e exige a mesma equipe e o mesmo produto em todas as disciplinas. Links públicos devem continuar funcionando durante a correção, que pode ocorrer até uma semana após o encerramento.

## Linguagem compartilhada de status (todas as disciplinas)

Use exatamente os quatro rótulos abaixo em relatórios e checklist:

- **Verificado localmente**: teste executado neste diretório/ambiente local com resultado observado.
- **Proposta/hipótese**: decisão, regra, arquitetura, indicador ou plano ainda sem validação empírica externa.
- **Simulado (sintético)**: dado/exemplo de demonstração fabricado para ilustrar comportamento, sem evidência de operação real.
- **Pendente (equipe/ambiente externo)**: depende de integrante identificado, serviço externo, ambiente institucional ou validação humana fora deste workspace.

Regra factual: **execução local não comprova integração pública, publicação nem submissão acadêmica**.

Exigem evidência real externa: nomes/RMs, validação com usuários/cidadãos, publicação de repositório e vídeo, execução em Teams/portal, deploy/infra provisionada, pipelines em contas reais, custos cotados e métricas coletadas em ambiente real.
