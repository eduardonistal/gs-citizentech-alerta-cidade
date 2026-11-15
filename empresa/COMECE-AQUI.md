# Comece aqui — Entrega GS Alerta Cidade

**Objetivo:** um ZIP com tudo para maximizar nota nas 6 disciplinas.  
**Você (Founder):** só envia no Teams.  
**Prazo PDF:** 19/11/2026 23h55.

## Onde está o pacote

1. Abra `entrega-final/AlertaCidade-GS-RM94524-ENTREGA-COMPLETA.zip`
2. Ou use os 6 ZIPs individuais em `entregas-teams/*.zip` (mesmo conteúdo por disciplina)

## Como enviar no Teams (1 disciplina por canal)

| Disciplina | Pasta / ZIP | Anexar / linkar |
|---|---|---|
| Generative AI | `01-Generative-AI-for-Engineering` | `ENTREGA.md` + PDF + `video-demo.mp4` + repo |
| Big Data | `02-Big-Data-Architecture-Data-Integration` | PDF + evidências Airflow + `chegada/` |
| BI & Startup | `03-Business-Intelligence-Startup-Development` | pitch MP4 + `modelo-negocio.md` + MVP |
| Computer Vision | `04-Applied-Computer-Vision` | PDF + dataset + video |
| RPA | `05-Robotic-Process-Automation` | PDF + BPMN + logs + video |
| Secure DevOps | `06-Secure-DevOps-Tools-Cloud-Computing` | PDF + evidências CI/Prometheus + TF |

## Links fixos (colar se o portal pedir URL)

- Repo: https://github.com/eduardonistal/gs-citizentech-alerta-cidade
- Vídeos (release): https://github.com/eduardonistal/gs-citizentech-alerta-cidade/releases/tag/videos-pt-br-2026-11-14
- CI verde: https://github.com/eduardonistal/gs-citizentech-alerta-cidade/actions
- MVP: ver `LINKS-MESTRE.json` (túnel Cloudflare quando a máquina estiver ligada)

## Se o professor pedir YouTube não listado

1. Suba os 4 MP4 de `videos/` (ou da pasta da disciplina) como **Não listado**
2. Cole as URLs em cada `LINKS.json` → campo `youtube`
3. Re-gere o ZIP com `npm run pack-entrega` (opcional)

## Rubrica

Leia `empresa/playbooks/RUBRICA-NOTA-10.md` — mapeia cada item do PDF ao artefato no ZIP.
