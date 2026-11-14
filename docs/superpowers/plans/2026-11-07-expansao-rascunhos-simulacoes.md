# Expansão dos materiais CitizenTech Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Enriquecer os materiais locais das seis disciplinas com propostas completas e simulações reproduzíveis, distinguindo explicitamente hipóteses, dados sintéticos e resultados realmente observados.

**Architecture:** Manter o MVP e os artefatos atuais; acrescentar fixtures determinísticas e pequenos avaliadores offline apenas onde demonstram comportamento útil sem exigir serviços externos. Documentação compartilhada define rótulos de estado e as diferenças entre uma simulação local e uma evidência de submissão.

**Tech Stack:** Node.js 20+ e APIs padrão do Node; JSON/JSONL/CSV/Markdown; ferramentas e dependências que já existem no pacote. Sem novas dependências por padrão.

**Spec:** `docs/superpowers/specs/2026-11-07-expansao-rascunhos-simulacoes-design.md`

## Global Constraints

- O PDF original da disciplina é a fonte de verdade para requisitos e formatos.
- Project-Based Maker Lab permanece fora do escopo.
- Não inventar integrantes/RMs, pesquisa ou validação de usuários, evidências, métricas empíricas, custos cotados, deploys, vídeos ou links.
- Marcar com clareza toda hipótese, dado de demonstração e saída sintética.
- Não mudar o status `not_run` dos benchmarks externos/modelos nem transformar exemplos em evidência de execução real.
- Não publicar, provisionar infraestrutura, criar contas ou usar credenciais.
- O diretório GS não é um repositório Git. Para a execução delegada, criar uma cópia temporária com Git sob a pasta da sessão; commits/worktrees ficam somente nessa cópia. Aplicar os arquivos revisados de volta em GS sem copiar metadados `.git`.

## Review Focus

- **Dado sintético lido como dado real:** cada fixture e saída de simulação precisa ter metadado inequívoco `synthetic` e aviso visível nos relatórios.
- **Benchmark local confundido com resultado de modelo:** testar que o relatório offline declara `model_evaluated: false`; manter o benchmark Ollama separado.
- **Dados inválidos ou duplicados no pipeline demonstrativo:** testar rejeição/normalização determinística e idempotência da fixture.
- **Métricas de visão confundidas com treino YOLO:** limitar o exemplo a métricas calculadas sobre vetores artificiais e dizer explicitamente que não avalia um detector treinado.
- **Custo ilustrativo confundido com cotação:** manter preços e fonte/data em branco até consulta oficial, mesmo quando houver cenário de carga hipotético.

---

### Task 1: Clarifying shared delivery status

**Files:**
- Modify: `README.md`
- Modify: `CHECKLIST_ENTREGAS.md`
- Modify: `FICHA_TECNICA_MVP.md`

**Interfaces:**
- Produces four status labels shared by all reports: `Verificado localmente`, `Proposta/hipótese`, `Simulado (sintético)`, `Pendente (equipe/ambiente externo)`.
- Reports and the checklist use those labels without changing the state of work not actually performed.

- [ ] **Step 1: Add a shared status legend and fact-vs-hypothesis rules**

  State that an executed local test may be reported as verified locally, but does not prove a public integration or submission; explicitly list what requires real team, service, or human validation.

- [ ] **Step 2: Update the six-course checklist**

  For each rubric requirement, identify the prepared material, any locally verified test, synthetic example, and remaining real evidence separately. Keep the original deadline and portal requirements sourced to the PDF.

- [ ] **Step 3: Verify status consistency**

  Search the three files for unsupported claims that any external submission or live integration is complete; expected: none.

---

### Task 2: Adding an offline synthetic GenAI retrieval benchmark

**Files:**
- Create: `01-Generative-AI-for-Engineering/avaliacao/retrieval-benchmark.mjs`
- Create: `01-Generative-AI-for-Engineering/avaliacao/retrieval-results.synthetic.json`
- Create: `01-Generative-AI-for-Engineering/avaliacao/casos-falha-sinteticos.md`
- Modify: `01-Generative-AI-for-Engineering/test/rag.test.mjs`
- Modify: `01-Generative-AI-for-Engineering/README.md`
- Modify: `01-Generative-AI-for-Engineering/docs/relatorio-tecnico.md`

**Interfaces:**
- Consumes: `retrieveKnowledge(question, docs, limit)` and `recallAtK(rankedIds, relevantIds, k)` from `src/rag.mjs`.
- Produces: an offline JSON report with `synthetic: true`, `model_evaluated: false`, fixture IDs, recall@1/recall@3 and a note that results apply only to the fixture.
- Does not write to or replace `avaliacao/results.json`; `erros-reais.md` remains pending until actual Ollama execution.

- [ ] **Step 1: Add tests for synthetic report shape and model separation**

  Assert the benchmark's fixture is reproducible, JSON output includes `synthetic: true` and `model_evaluated: false`, and it never calls Ollama.

- [ ] **Step 2: Run the targeted test and verify failure**

  Run: `node --test 01-Generative-AI-for-Engineering/test/rag.test.mjs`
  Expected: new synthetic-report assertions fail before implementation.

- [ ] **Step 3: Implement the offline retrieval benchmark**

  Use the existing `base/knowledge.jsonl` and `avaliacao/test_cases.jsonl`; record only retrieval measurements over these authored cases. Do not score generated answer quality or change `results.json`.

- [ ] **Step 4: Add explicitly synthetic failure examples**

  Put representative failure modes in `casos-falha-sinteticos.md` as test scenarios, not as the five real model errors. Keep `erros-reais.md` unchanged.

- [ ] **Step 5: Run the targeted test**

  Run: `node --test 01-Generative-AI-for-Engineering/test/rag.test.mjs`
  Expected: all tests pass, with output labeled as synthetic and no model inference.

- [ ] **Step 6: Explain scope in the README and report**

  Separate retrieval fixture results from actual baseline/RAG/agent evaluation, which remains pending.

---

### Task 3: Simulating the Big Data pipeline with deterministic fixtures

**Files:**
- Create: `02-Big-Data-Architecture-Data-Integration/data/forecast.synthetic.json`
- Create: `02-Big-Data-Architecture-Data-Integration/scripts/simulate-pipeline.mjs`
- Create: `02-Big-Data-Architecture-Data-Integration/test/simulate-pipeline.test.mjs`
- Modify: `02-Big-Data-Architecture-Data-Integration/README.md`
- Modify: `02-Big-Data-Architecture-Data-Integration/docs/relatorio-tecnico.md`

**Interfaces:**
- Consumes: a JSON fixture with an explicit synthetic-data marker and forecast records with dates, precipitation and probability.
- Produces: deterministic Bronze/Prata/Ouro demonstration summaries and counts; re-running the same fixture does not duplicate records.
- Does not claim Airflow or Databricks ran.

- [ ] **Step 1: Add tests for schema validation, invalid measurements, and idempotence**

  Verify valid synthetic records survive the transformation, malformed or out-of-range records are rejected, and repeating input does not increase unique output counts.

- [ ] **Step 2: Run the targeted test and verify failure**

  Run: `node --test 02-Big-Data-Architecture-Data-Integration/test/simulate-pipeline.test.mjs`
  Expected: tests fail because the simulator is not implemented.

- [ ] **Step 3: Add a small deterministic fixture and standard-library simulator**

  Label the fixture and all outputs synthetic; keep source URLs and run timestamps out of fields that could imply a real collection.

- [ ] **Step 4: Run the targeted test and documented example**

  Run: `node --test 02-Big-Data-Architecture-Data-Integration/test/simulate-pipeline.test.mjs`
  Expected: all fixture, validation, and idempotence tests pass.

- [ ] **Step 5: Document the simulated layer flow and remaining Airflow/Databricks proof**

  Do not fill the report's real batch counts, execution screenshots, or platform results from simulator output.

---

### Task 4: Completing the business proposal and pitch draft

**Files:**
- Create: `03-Business-Intelligence-Startup-Development/docs/modelo-negocio.md`
- Modify: `03-Business-Intelligence-Startup-Development/README.md`
- Modify: `03-Business-Intelligence-Startup-Development/roteiro-pitch.md`

**Interfaces:**
- Produces: a proposal for target segments, value proposition, buyer/user separation, channels, sustainability, pilot scope, risks, and a hypothesis-validation plan.
- Any numerical scenario uses explicitly arbitrary planning assumptions and is not labeled market research, validated pricing, or achieved impact.

- [ ] **Step 1: Draft the business model and hypothesis register**

  Include assumptions, evidence needed, validation method, and an owner field for the team to complete; distinguish citizens as users from institutional buyers.

- [ ] **Step 2: Add a sensitivity scenario with clearly hypothetical inputs**

  Show the calculation formula and label all inputs as placeholders for discussion, not quotes or market data. Leave observed customer counts and willingness-to-pay blank.

- [ ] **Step 3: Align the five-minute pitch to the proposal**

  Preserve explicit prompts for real team names, user evidence, live MVP, source/date, actual video, and upload link; do not narrate placeholders as completed work.

- [ ] **Step 4: Check the pitch against the PDF rubric**

  Expected: each required pitch component has a timed section and evidence note; recording and submission remain pending.

---

### Task 5: Adding a synthetic computer-vision metrics example

**Files:**
- Create: `04-Applied-Computer-Vision/data/metric-example.synthetic.json`
- Create: `04-Applied-Computer-Vision/src/evaluate_synthetic_example.mjs`
- Create: `04-Applied-Computer-Vision/test/evaluate_synthetic_example.test.mjs`
- Modify: `04-Applied-Computer-Vision/data/DATASET.md`
- Modify: `04-Applied-Computer-Vision/README.md`
- Modify: `04-Applied-Computer-Vision/docs/relatorio-tecnico.md`

**Interfaces:**
- Consumes: fixed synthetic ground-truth and predicted binary labels from a small authored example.
- Produces: confusion counts, precision, recall, and F1 plus `synthetic: true` and `model_evaluated: false`.
- Does not claim YOLO training, object-detection mAP, real image provenance, or model performance.

- [ ] **Step 1: Test metric calculations and zero-denominator behavior**

  Cover known TP/FP/FN/TN counts, precision/recall/F1, and a class with no positive predictions.

- [ ] **Step 2: Run the targeted test and verify failure**

  Run: `node --test 04-Applied-Computer-Vision/test/evaluate_synthetic_example.test.mjs`
  Expected: new tests fail before implementation.

- [ ] **Step 3: Implement the standard-library synthetic metric example**

  Validate equal, non-empty label arrays and binary values; label output as a toy example, not trained-model evaluation.

- [ ] **Step 4: Run the targeted test**

  Run: `node --test 04-Applied-Computer-Vision/test/evaluate_synthetic_example.test.mjs`
  Expected: all metric and invalid-input tests pass.

- [ ] **Step 5: Document real dataset, training, and evaluation prerequisites**

  Keep actual image sources/licensing, trained weights, YOLO metrics, and demonstration evidence pending.

---

### Task 6: Completing the RPA process and exception handbook

**Files:**
- Modify: `05-Robotic-Process-Automation/README.md`
- Modify: `05-Robotic-Process-Automation/docs/relatorio-tecnico.md`
- Modify: `05-Robotic-Process-Automation/logs/sample.json`
- Modify: `05-Robotic-Process-Automation/test/process.test.mjs`

**Interfaces:**
- Produces: exception matrix for source outage, malformed forecast, unauthorized import, rate limit, and retry exhaustion; sample log explicitly marked as synthetic.
- Reuses the existing `process.mjs` transformation and existing MVP contract; does not claim n8n execution.

- [ ] **Step 1: Add tests for sanitization and representative invalid inputs**

  Assert sensitive authorization values are never present in sample logs and invalid payloads cannot yield publishable records.

- [ ] **Step 2: Run the targeted tests and verify failure**

  Run: `node --test 05-Robotic-Process-Automation/test/process.test.mjs`
  Expected: added assertions fail before the fixture/documentation update.

- [ ] **Step 3: Mark the sample log synthetic and document recovery decisions**

  Record only fabricated identifiers and messages that are clearly marked synthetic; do not insert credentials, real tokens, or real run IDs.

- [ ] **Step 4: Run the targeted tests**

  Run: `node --test 05-Robotic-Process-Automation/test/process.test.mjs`
  Expected: all local transformation and sanitization tests pass.

- [ ] **Step 5: Document the n8n import, execution, and real evidence still required**

  Keep execution screenshots and end-to-end integration marked pending.

---

### Task 7: Making DevOps runbooks and cost scenarios actionable

**Files:**
- Create: `06-Secure-DevOps-Tools-Cloud-Computing/docs/runbook.md`
- Create: `06-Secure-DevOps-Tools-Cloud-Computing/docs/carga-sintetica.csv`
- Modify: `06-Secure-DevOps-Tools-Cloud-Computing/README.md`
- Modify: `06-Secure-DevOps-Tools-Cloud-Computing/docs/relatorio-tecnico.md`
- Modify: `06-Secure-DevOps-Tools-Cloud-Computing/docs/custo-template.csv`

**Interfaces:**
- Produces: local verification, CI/deploy, incident response, rollback, secrets, and observability runbooks; a hypothetical workload profile with no provider prices.
- Leaves quoted rates, provider, region, date, CI result, deployment URL, and live alert evidence to verifiable execution.

- [ ] **Step 1: Add a runbook with explicit local and cloud boundaries**

  Include preconditions, command, expected observable state, failure interpretation, rollback, and credential-handling notes; never include secret values.

- [ ] **Step 2: Add a synthetic workload profile**

  Include labeled planning quantities for traffic, retention, and compute only. Keep price cells/source/date blank until checked against official pricing.

- [ ] **Step 3: Update cost template instructions and report**

  Explain that workload assumptions are not a quote or measured usage, and provide a method for the team to fill price/source/date later.

- [ ] **Step 4: Validate CSV structure and sensitive-value absence**

  Expected: files parse as consistent CSV rows, and no credential-like values are present.

---

### Task 8: Regenerating reports and validating the package

**Files:**
- Regenerate: `02-Big-Data-Architecture-Data-Integration/docs/relatorio-tecnico.pdf`
- Regenerate: `04-Applied-Computer-Vision/docs/relatorio-tecnico.pdf`
- Regenerate: `05-Robotic-Process-Automation/docs/relatorio-tecnico.pdf`
- Regenerate: `06-Secure-DevOps-Tools-Cloud-Computing/docs/relatorio-tecnico.pdf`
- Modify if needed: root `package.json` test script

- [ ] **Step 1: Add the new local test files to the root `npm test` command**

  Keep the existing Node.js-only runtime and do not add dependencies without need.

- [ ] **Step 2: Run the full test suite**

  Run: `npm test --prefix C:\Users\Nistal\Desktop\GS`
  Expected: all existing and new tests pass.

- [ ] **Step 3: Validate all JSON, JSONL, CSV, and BPMN/XML artifacts**

  Expected: all fixtures parse; synthetic artifacts include their explicit marker; BPMN remains well-formed.

- [ ] **Step 4: Regenerate the four PDFs**

  Run: `npm run render-reports --prefix C:\Users\Nistal\Desktop\GS`
  Expected: all four PDFs regenerate from the updated Markdown without errors.

- [ ] **Step 5: Reconcile the checklist against the original PDF**

  Expected: the package's locally verified changes are reflected, and no actual team, service, public link, video, user validation, or cost evidence is marked complete.
