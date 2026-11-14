# Dados e proveniência

**Status: pendente.** Nenhuma imagem está incluída; não usar screenshots de redes sociais nem imagens com pessoas identificáveis sem base legal/consentimento.

`metric-example.synthetic.json` contém apenas rótulos binários sintéticos para ilustrar cálculos de precisão, recall e F1. É um exemplo didático, não tem proveniência de imagens e não representa treinamento YOLO, mAP de detecção de objetos ou desempenho de modelo (`synthetic: true`, `model_evaluated: false`).

Antes do treinamento, registrar:

- URL/fonte pública de cada imagem e data de obtenção;
- licença que permita treinamento e redistribuição das imagens/anotações;
- critérios de inclusão e exclusão e política de rostos/placas;
- anotador, revisão dos rótulos e divisão treino/validação/teste por origem;
- equilíbrio de chuva, iluminação, perspectiva, pavimento, regiões e falsos positivos.

Estrutura esperada: `images/{train,val,test}/` e `labels/{train,val,test}/`, com rótulos YOLO. Fontes reais e licenças, pesos treinados, métricas YOLO e evidências da demonstração permanecem pendentes. Sem essa curadoria, não há alegação de desempenho.
