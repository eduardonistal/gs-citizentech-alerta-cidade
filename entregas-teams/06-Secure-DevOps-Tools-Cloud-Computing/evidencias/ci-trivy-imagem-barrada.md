# CI barrada — Trivy image (HIGH)

- Run: https://github.com/eduardonistal/gs-citizentech-alerta-cidade/actions/runs/43637722906
- Commit: 540be98
- Job security: success (Gitleaks/Semgrep/Trivy config/TF validate)
- Job build: failure — Trivy encontrou 10 HIGH em pacotes npm do base image node:22-alpine (brace-expansion, ip-address, pacote, picomatch, sigstore)
- Correção: Dockerfile remove npm/corepack do runtime (app não usa dependências npm em produção)
- Log completo: ci-trivy-imagem-barrada-43637722906.log
