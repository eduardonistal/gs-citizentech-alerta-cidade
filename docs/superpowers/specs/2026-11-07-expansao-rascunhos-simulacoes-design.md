# Expansão dos materiais CitizenTech — proposta de design

## Intenção

Completar o pacote local das seis disciplinas restantes com propostas, análises, exemplos e simulações reproduzíveis para o MVP Alerta Cidade. O material deve ser útil para a equipe revisar e finalizar, sem confundir uma hipótese ou uma simulação com pesquisa, métrica, integração ou evidência real.

## Abordagens consideradas

1. **Somente ampliar narrativas e deixar resultados em branco.** Menor esforço, mas não demonstra os componentes técnicos que já podem ser exercitados localmente.
2. **Ampliar narrativas e incluir simulações locais sintéticas, rotuladas.** Dá à equipe materiais mais concretos e reproduzíveis, mantendo limites claros sobre o que ainda precisa de validação. **Escolhida**, conforme preferência do usuário.
3. **Inventar resultados, equipe e evidências como se fossem reais.** Rejeitada: isso produziria uma submissão enganosa e não é aceitável.

## Objetivos

- Alinhar as seis pastas e o checklist a um vocabulário de estado comum: verificado localmente, proposta/hipótese, simulação sintética e pendente de validação externa.
- Ampliar plano de negócio, roteiro de apresentação, arquitetura, critérios de aceitação, avaliação e runbooks.
- Acrescentar dados e execuções sintéticas determinísticas quando forem úteis e tecnicamente honestas.
- Distinguir resultados de testes realmente executados de metas ou resultados ilustrativos.
- Manter Project-Based Maker Lab fora do escopo.

## Não objetivos e limites

- Não inventar nomes, RMs, equipe, entrevistas, testes de usuários, validação institucional, métricas empíricas, custos cotados, deploys, screenshots, gravações, URLs públicas ou submissões.
- Não apresentar dados sintéticos, métricas simuladas, mockups ou resultados locais como evidência real.
- Não publicar em GitHub/YouTube/Teams, criar contas, usar credenciais ou executar serviços externos.
- Não substituir alertas de órgãos oficiais nem afirmar que a solução foi validada por cidadãos ou autoridades.
- O PDF original da disciplina é a fonte de verdade para requisitos e formatos de submissão; se houver divergência, revalidar o checklist contra esse PDF.

## Conteúdo previsto

- **IA Generativa:** explicitar hipótese de uso, protocolo de avaliação, conjunto sintético de perguntas/ground truth, limites e campos para resultados reais de baseline/RAG/agente. Endpoints locais permanecem restritos.
- **Big Data:** documentar esquema, qualidade, idempotência, tratamento de falhas e consultas; incluir fixture determinística e exemplo de transformação local. Não simular execução Airflow/Databricks como execução real.
- **BI e Startup:** completar proposta de valor, segmentos hipotéticos, canais, riscos, modelo de sustentabilidade e roteiro de pitch com marcações para validação/equipe. Projeções serão cenários, com premissas explícitas, não previsões validadas.
- **Computer Vision:** definir protocolo de dataset/licença, rótulos, divisão sem vazamento, métricas e demonstração. Qualquer fixture sintética será identificada como tal; sem alegar desempenho em imagens reais de alagamento.
- **RPA:** detalhar fluxo, contratos, cenários de exceção e teste local. Distinguir testes automatizados locais de importação/execução real no n8n.
- **DevOps/Cloud:** detalhar threat model, pipeline, observabilidade, operação e planilha/fórmulas de custo com campos de preço verificável. Não alegar deploy ou custo realizado.
- **Checklist geral:** indicar por requisito o que é material preparado, o que foi realmente executado e o que depende da equipe/ambiente externo.

## Arquivos a revisar

- `CHECKLIST_ENTREGAS.md`, `README.md` e `FICHA_TECNICA_MVP.md`
- READMEs e relatórios em `01-Generative-AI-for-Engineering` a `06-Secure-DevOps-Tools-Cloud-Computing`
- `03-Business-Intelligence-Startup-Development/roteiro-pitch.md`
- Fixtures, scripts e testes dos componentes que receberem simulações
- PDFs gerados a partir dos relatórios, quando suas fontes forem atualizadas

## Critérios de aceitação

1. Todo dado criado para demonstração está marcado como sintético; premissas e metas são distinguidas de resultados medidos.
2. Nenhuma afirmação de pesquisa, resultado externo, deploy, custo ou evidência aparece sem execução ou fonte verificável.
3. Simulações são determinísticas e possuem instruções de reprodução e testes adequados.
4. As seis disciplinas continuam alinhadas ao mesmo MVP; Maker Lab permanece excluída.
5. Checklist e PDFs refletem o estado real após validação.
6. As limitações que não são apenas credenciais — como equipe, validação humana, gravação e execução de serviços — continuam visíveis.

## Decisões deixadas ao implementador

Usar apenas ferramentas já presentes no pacote, evitar dependências novas quando fixtures e testes Node/Python existentes bastarem e manter conteúdo em português onde o material atual já usa português, respeitando o idioma exigido em cada disciplina. Nomes, RMs e decisões da equipe ficam como campos a preencher.
