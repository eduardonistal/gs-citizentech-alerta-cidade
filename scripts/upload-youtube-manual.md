# Publicar os vídeos no YouTube (não listado)

Arquivos prontos em `videos/`:

1. `03-pitch-alerta-cidade.mp4` — Pitch BI (≤5 min)
2. `01-generative-ai-demo.mp4` — GenAI
3. `04-computer-vision-demo.mp4` — Computer Vision
4. `05-rpa-demo.mp4` — RPA (≤3 min)

## Passos

1. Abra https://studio.youtube.com
2. Criar → Enviar vídeos → selecione os 4 MP4
3. Visibilidade: **Não listado**
4. Título sugerido:
   - `Alerta Cidade — Pitch FIAP GS (RM94524)`
   - `Alerta Cidade — Demo Generative AI (RM94524)`
   - `Alerta Cidade — Demo Computer Vision (RM94524)`
   - `Alerta Cidade — Demo RPA (RM94524)`
5. Anexe as legendas `.vtt` da pasta `videos/` quando o Studio pedir
6. Publique, copie as URLs e cole nos READMEs / Teams
7. Teste cada link em janela anônima

Regenerar localmente: `npm run generate-videos`
