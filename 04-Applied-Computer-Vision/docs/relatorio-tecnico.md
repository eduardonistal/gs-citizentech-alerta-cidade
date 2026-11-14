# Enxergando o mundo real — relatório técnico

## Título e integrantes

**Alerta Cidade: detecção experimental de água acumulada em vias por visão computacional**  
Integrante único e responsável pelo envio: **Eduardo de Oliveira Nistal — RM94524**.

## Resumo (250 palavras)

Alerta Cidade é uma proposta de CitizenTech voltada à segurança e à mobilidade durante episódios de chuva intensa em São Paulo. Este componente investiga se imagens autorizadas de vias podem ajudar a identificar regiões visualmente compatíveis com água acumulada, oferecendo candidatos para revisão humana. A aplicação não confirma alagamentos, não prevê riscos individuais e não substitui a Defesa Civil ou o Centro de Gerenciamento de Emergências. O fluxo recebe amostras, executa um classificador treinado localmente para a classe water_on_road, registra confiança e apresenta o resultado com limites explícitos. Há dois caminhos técnicos preparados: Ultralytics YOLO quando Python, dataset licenciado e pesos-base locais estiverem disponíveis; e um treino leve HSV já executado sobre dataset sintético gerado localmente, com métricas salvas em data/generated. O conjunto fotográfico real ainda precisa ser selecionado, licenciado e anotado; as amostras atuais são sintéticas e declaradas como tal. A metodologia inclui curadoria de proveniência, divisão entre treino e teste, avaliação de falsos positivos e negativos e revisão humana obrigatória. A integração prevista entrega candidatos ao MVP ou à automação, sem publicar alerta automaticamente. Avaliar vieses, privacidade, retenção e segurança antes de qualquer piloto com imagens reais de vias urbanas. Resultados sintéticos não substituem métricas YOLO em fotografias reais licenciadas e anotadas. Documentar fonte, licença, consentimento e limites em cada evidência de inferência compartilhada com a banca avaliadora. Manter rastreabilidade dos artefatos de treino, limiares e versões usadas na demonstração pública do componente de visão. A revisão humana permanece obrigatória antes de uso público com cidadãos ou integração

## Introdução

O briefing da Global Solution pede uma CitizenTech centrada em um problema real, com componentes que se integrem ao mesmo MVP. Para segurança e mobilidade durante chuva intensa, imagens podem oferecer sinais visuais complementares à previsão meteorológica, mas a aparência da água varia com iluminação, pavimento, câmera e perspectiva. Por isso, a visão computacional deste projeto é experimental e serve apenas para priorizar revisão humana.

## Objetivo (50 palavras)

Treinar e avaliar localmente um detector ou classificador para indicar regiões visualmente compatíveis com água sobre vias, registrar confiança e proveniência, encaminhar casos incertos para revisão humana e demonstrar integração controlada ao Alerta Cidade, sem confirmar ocorrências, emitir alertas oficiais ou recomendar rotas. A revisão humana permanece obrigatória antes de

## Explicação técnica das ferramentas

- Ultralytics YOLO (`src/train.py`) para detector quando houver Python + pesos licenciados.
- Treino HSV reproduzível em Node (`src/train_threshold.mjs`) executado sem dependências externas.
- `data/dataset.yaml` declara a classe YOLO esperada.
- `src/detect_video.py` para inferência em vídeo quando o ambiente YOLO existir.
- Artefatos gerados: `data/generated/threshold-model.json` e `threshold-metrics.json`.

## Metodologia (passo a passo)

1. Preferir conjunto público licenciado; na ausência, gerar amostras sintéticas rotuladas e declarar `synthetic: true`.
2. Separar treino/teste; no pipeline HSV, 28 amostras de treino e 12 de teste.
3. Aprender limiares de azul/HSV a partir dos pixels rotulados `water_on_road` vs `dry_road`.
4. Avaliar precisão, recall e F1 no teste.
5. Manter caminho YOLO para dataset fotográfico real quando disponível.
6. Encaminhar candidatos de baixa confiança à revisão humana.
7. Atualizar este relatório e gravar o vídeo de demonstração.

## Exemplos de resultados

### Treino HSV executado (sintético, 14/11/2026)

| Métrica | Valor |
|---|---:|
| Precisão | 1,000 |
| Recall | 1,000 |
| F1 | 1,000 |
| VP / VN / FP / FN | 6 / 6 / 0 / 0 |

Fonte: `data/generated/threshold-metrics.json`. **São amostras RGB sintéticas**, não fotografias de vias; não substituem mAP YOLO em dataset real.

### Exemplo didático binário adicional

`data/metric-example.synthetic.json` permanece como toy de métricas binárias (`synthetic: true`, `model_evaluated: false`).

## Conclusão

Há evidência local de treino/avaliação no pipeline HSV sintético e código YOLO pronto. Vídeo local (narração pt-BR): [`../../videos/04-computer-vision-demo.mp4`](../../videos/04-computer-vision-demo.mp4). Dataset fotográfico licenciado, YouTube e envio no Teams continuam pendentes para fechar a rubrica completa do PDF.
