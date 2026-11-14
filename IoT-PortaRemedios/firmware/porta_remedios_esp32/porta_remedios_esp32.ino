/**
 * PortaRemédios — firmware base ESP32
 * 7 reed switches (NC com tampa fechada + imã) → LOW = fechada, HIGH = aberta
 * Se no horário previsto a casinha NÃO for aberta → dispara alerta (Serial + webhook).
 *
 * Ajuste WIFI / WEBHOOK e a grade de horários antes de gravar.
 */

#include <WiFi.h>
#include <HTTPClient.h>
#include <time.h>

// ---------- Wi-Fi / alerta ----------
const char* WIFI_SSID = "SUA_REDE";
const char* WIFI_PASS = "SUA_SENHA";
// Ex.: webhook Discord, n8n, IFTTT, Firebase, etc.
const char* WEBHOOK_URL = "https://seu-endpoint.exemplo/alerta";

// Pinos dos 7 reed switches (um por dia). Use INPUT_PULLUP.
const int REED_PINS[7] = {32, 33, 25, 26, 27, 14, 12};
const char* DAY_NAME[7] = {"SEG", "TER", "QUA", "QUI", "SEX", "SAB", "DOM"};

// Horário alvo por dia (hora local 0-23, minuto). -1 = desativado.
int doseHour[7]   = {8, 8, 8, 8, 8, 9, 9};
int doseMinute[7] = {0, 0, 0, 0, 0, 0, 0};

// Janela: se não abrir até dose + GRACE_MIN → alarme
const int GRACE_MIN = 15;

bool alertSentToday[7] = {false, false, false, false, false, false, false};
bool openedToday[7]    = {false, false, false, false, false, false, false};
int lastYday = -1;

bool isOpen(int i) {
  // Reed + imã: tampa fechada fecha o circuito → LOW com PULLUP
  return digitalRead(REED_PINS[i]) == HIGH;
}

void connectWifi() {
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASS);
  Serial.print("WiFi");
  for (int i = 0; i < 40 && WiFi.status() != WL_CONNECTED; i++) {
    delay(250);
    Serial.print(".");
  }
  Serial.println(WiFi.status() == WL_CONNECTED ? " OK" : " FALHOU");
}

void syncTime() {
  configTime(-3 * 3600, 0, "pool.ntp.org", "time.nist.gov"); // UTC-3 Brasil
  struct tm ti;
  for (int i = 0; i < 20 && !getLocalTime(&ti); i++) delay(200);
}

bool sendAlert(int dayIndex) {
  if (WiFi.status() != WL_CONNECTED) return false;
  HTTPClient http;
  http.begin(WEBHOOK_URL);
  http.addHeader("Content-Type", "application/json");
  String body = String("{\"evento\":\"dose_perdida\",\"dia\":\"") + DAY_NAME[dayIndex] +
                "\",\"msg\":\"Casinha " + DAY_NAME[dayIndex] + " nao foi aberta no horario.\"}";
  int code = http.POST(body);
  http.end();
  Serial.printf("Alerta %s → HTTP %d\n", DAY_NAME[dayIndex], code);
  return code > 0 && code < 400;
}

void resetDayCounters(int yday) {
  if (yday == lastYday) return;
  lastYday = yday;
  for (int i = 0; i < 7; i++) {
    alertSentToday[i] = false;
    openedToday[i] = false;
  }
  Serial.println("Novo dia — contadores zerados");
}

void setup() {
  Serial.begin(115200);
  for (int i = 0; i < 7; i++) pinMode(REED_PINS[i], INPUT_PULLUP);
  connectWifi();
  syncTime();
}

void loop() {
  struct tm ti;
  if (!getLocalTime(&ti)) {
    delay(1000);
    return;
  }
  resetDayCounters(ti.tm_yday);

  // tm_wday: 0=dom ... 6=sab → mapeamos para índice SEG=0 ... DOM=6
  int idxHoje = (ti.tm_wday + 6) % 7; // seg=0 ... dom=6

  for (int i = 0; i < 7; i++) {
    if (isOpen(i)) openedToday[i] = true;
  }

  // Só avalia a casinha do dia corrente
  int i = idxHoje;
  if (doseHour[i] >= 0) {
    int nowMin = ti.tm_hour * 60 + ti.tm_min;
    int dueMin = doseHour[i] * 60 + doseMinute[i];
    int deadline = dueMin + GRACE_MIN;

    if (nowMin >= dueMin && nowMin <= deadline && isOpen(i)) {
      openedToday[i] = true;
    }

    if (nowMin > deadline && !openedToday[i] && !alertSentToday[i]) {
      if (sendAlert(i)) alertSentToday[i] = true;
      else Serial.println("Falha ao enviar alerta — tentará de novo");
    }
  }

  // telemetria leve
  static unsigned long lastPrint = 0;
  if (millis() - lastPrint > 5000) {
    lastPrint = millis();
    Serial.printf("%02d:%02d hoje=%s aberta=%d\n",
                  ti.tm_hour, ti.tm_min, DAY_NAME[i], openedToday[i]);
  }

  delay(200);
}
