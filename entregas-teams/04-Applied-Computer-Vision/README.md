# Applied Computer Vision — Enxergando o mundo real

Integrante único e responsável pelo envio: **Eduardo de Oliveira Nistal — RM94524**.

Componente: indicar regiões compatíveis com água acumulada sobre via e devolver candidatos para revisão humana. Não confirma alagamento nem aciona alertas oficiais.

## Caminho já executado (Node, sintético)

```powershell
npm run vision-train
```

Gera `data/generated/threshold-model.json` e `threshold-metrics.json` (F1 = 1,000 no teste sintético). Declara explicitamente que as amostras não são fotografias reais.

## Caminho YOLO (quando houver Python + dataset licenciado)

1. Documentar origem/licença das imagens em `data/DATASET.md`.
2. Rotular `water_on_road` e configurar `data/dataset.yaml`.
3. `python src/train.py --data data/dataset.yaml --weights <arquivo-local>`.
4. Inferência: `python src/detect_video.py ...`
5. Atualizar `docs/relatorio-tecnico.md` e gravar o vídeo funcional.

## Vídeo

Vídeo local (narração pt-BR): [`../videos/04-computer-vision-demo.mp4`](../videos/04-computer-vision-demo.mp4).  
YouTube não listado e envio no Teams: pendentes.

## Entrega PDF

Resumo (250 palavras) e objetivo (50 palavras) estão em `docs/relatorio-tecnico.md`. Regenerar PDF com `npm run render-reports`.
