# CI corrigida — pipeline verde

- Run: https://github.com/eduardonistal/gs-citizentech-alerta-cidade/actions/runs/43638056256
- Commit: e1def23 (Strip npm from runtime image so Trivy image scan can pass.)
- Jobs: security=success, build=success, deploy=success
- Barrada anterior (Trivy HIGH no npm do base): run 43637722906 — ver ci-trivy-imagem-barrada.md
- Gitleaks barrada→limpa: ci-gitleaks-blocked.txt / ci-gitleaks-clean.txt
