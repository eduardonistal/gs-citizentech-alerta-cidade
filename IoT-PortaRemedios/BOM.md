# Lista de materiais (BOM)

## Impressão 3D

- Filamento PLA ou PETG (~80–120 g)
- 1× corpo (`peca = "corpo"`)
- 7× tampas (`peca = "tampa_todas"`)
- 7× pinos de dobradiça Ø2 mm × ~12 mm (filament ou arame)

## Eletrônica

| Qtd | Item | Função |
|-----|------|--------|
| 1 | ESP32 DevKit V1 / WROOM-32 (30 pinos) | Wi-Fi + lógica |
| 7 | Reed switch normalmente aberto (NA) glass/plastic | Detecta abertura |
| 7 | Ímã neodímio Ø6 × 2 mm (N35+) | Fecha o reed com a tampa |
| 1 | Cabo USB-C / micro-USB | Alimentação / gravação |
| — | Fio AWG 28–30 | Ligação reed → GPIO |
| opcional | Buzzer ativo 5 V / 3,3 V | Alarme local |
| opcional | Powerbank / fonte 5 V | Uso sem PC |

## Consumíveis

- Supercola / epóxi (imãs e reeds)
- Termorretrátil ou fita kapton
- Parafusos M2 × 6–8 mm (4×) para o DevKit

## App / nuvem (escolha uma)

- Webhook **n8n** → push / e-mail / Telegram
- Discord Incoming Webhook
- IFTTT / Make
- Firebase Cloud Messaging (requer app)
