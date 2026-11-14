# PortaRemédios IoT — molde 3D + ESP32

Caixa semanal de remédios (7 casinhas) com **sensor reed + imã em cada tampa**. Se a casinha do dia **não for aberta** no horário configurado, o **ESP32** envia alerta para o celular (webhook / n8n / Discord / app).

## O que tem nesta pasta

| Item | Descrição |
|------|-----------|
| `openscad/porta-remedios.scad` | Molde paramétrico (corpo, tampas, montagem, explodido) |
| `stl/` | STL prontos (corpo + tampa) gerados por script |
| `scripts/gerar-stl.mjs` | Regenera os STL sem OpenSCAD |
| `preview/index.html` | Preview 3D interativo no navegador |
| `firmware/porta_remedios_esp32/` | Sketch Arduino para ESP32 |
| `porta-remedios-conceito.jpg` | Render de conceito |
| `BOM.md` | Lista de materiais |

## Como gerar / obter o STL

**Rápido (já incluso):** use `stl/corpo-porta-remedios.stl` e imprima `tampa-porta-remedios.stl` **7 vezes**.

**Regenerar sem OpenSCAD:**

```powershell
node .\IoT-PortaRemedios\scripts\gerar-stl.mjs
```

**Versão completa (dobradiças, filetes, labels):**

1. Instale [OpenSCAD](https://openscad.org/).
2. Abra `openscad/porta-remedios.scad`.
3. No customizer, escolha `peca`: `corpo` ou `tampa_todas`.
4. **F6** → **Export as STL**.

Impressão sugerida: PLA/PETG, camada 0,2 mm, preenchimento 20–30%, corpo com base no leito.

Dimensões aproximadas do corpo: **~268 × 44 × 30 mm** (ajustáveis no `.scad`).

## Lógica do sensor

```
Tampa fechada → imã próximo ao reed → circuito fechado → GPIO LOW (INPUT_PULLUP)
Tampa aberta  → reed abre            → GPIO HIGH
```

No horário da dose + margem (`GRACE_MIN`), se a casinha do dia **nunca** foi para HIGH → **alarme** via HTTP POST.

## Montagem rápida

1. Imprima corpo + 7 tampas.
2. Cole imãs de Ø6×2 mm nas cavidades das tampas (supercola / epóxi).
3. Encaixe reed switches nos bolsos traseiros; passe os fios pelo canal inferior até a baia.
4. Fixe o ESP32 DevKit nos furos M2; USB fica alinhado ao corte lateral.
5. Pinos sugeridos: GPIO **32, 33, 25, 26, 27, 14, 12** (um por dia) + GND comum.
6. Grave o firmware, configure Wi-Fi e `WEBHOOK_URL`.

## Preview

Abra `preview/index.html` no navegador (duplo clique ou live server).

## Observação

Projeto separado do MVP **Alerta Cidade** deste workspace — é um molde/hardware para adesão a medicação com ESP32.
