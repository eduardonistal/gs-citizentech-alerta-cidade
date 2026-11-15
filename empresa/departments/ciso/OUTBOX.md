# CISO — segurança da entrega

Data: 2026-11-15

## Evidências no ZIP (DevOps)

- Gitleaks: barrada → limpa (`evidencias/ci-gitleaks-*`)
- Trivy imagem: barrada → corrigida (`ci-trivy-imagem-barrada*` + pipeline sucesso)
- Semgrep + Terraform validate no CI
- Pipeline verde: https://github.com/eduardonistal/gs-citizentech-alerta-cidade/actions

## Política

- Sem secrets no repositório
- Teto R$ 0 (sem Azure apply pago)
- MVP via Cloudflare Tunnel documentado

## GO

**GO** para nota DevOps com evidência barrada/corrigida + observabilidade firing.
