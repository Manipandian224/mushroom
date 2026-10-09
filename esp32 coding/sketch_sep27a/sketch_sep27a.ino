#include <Arduino.h>
#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <HTTPClient.h>
#include <DHT.h>

// =============== WIFI =================
const char* WIFI_SSID = "Poco m6 5g ag";
const char* WIFI_PASSWORD = "zxcvbnmz";

// ============== FIREBASE ==============
const char* FIREBASE_HOST =
  "https://mushroom-pro-default-rtdb.firebaseio.com";

// ============ SENSOR PINS =============
#define DHT_PIN       4
#define DHT_TYPE      DHT22
#define SOIL_A0       34
#define GAS_D0        25

// ============ RELAY PINS ==============
#define RELAY_FAN     18
#define RELAY_PUMP    19

// Most relay modules are active LOW
#define RELAY_ON      LOW
#define RELAY_OFF     HIGH

#define GAS_DETECTED  LOW

// ========== SOIL CALIBRATION ==========
#define SOIL_DRY_VALUE 4095
#define SOIL_WET_VALUE 1500

// =========== FAN TEMPERATURE ==========
#define FAN_ON_TEMP   30.0
#define FAN_OFF_TEMP  30.0

// ============== PUMP ==================
#define PUMP_START_MOISTURE 30

const unsigned long PUMP_RUN_TIME = 5000;
const unsigned long PUMP_COOLDOWN = 30000;

// ============ FIREBASE TIMER ===========
unsigned long previousFirebaseTime = 0;
const unsigned long FIREBASE_INTERVAL = 5000;

// ============== STATES =================
bool fanState = false;
bool pumpState = false;

unsigned long pumpStartTime = 0;
unsigned long lastPumpStopTime = 0;

DHT dht(DHT_PIN, DHT_TYPE);

// ============ WIFI CONNECTION ==========
void connectWiFi() {
  if (WiFi.status() == WL_CONNECTED) return;

  Serial.println("Connecting to WiFi...");
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 30) {
    delay(500);
    Serial.print(".");
    attempts++;
  }

  Serial.println();

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("WiFi connected");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println("WiFi connection failed");
  }
}

// ============ SOIL MOISTURE ============
int readSoilMoisture() {
  int raw = analogRead(SOIL_A0);

  int moisture = map(
    raw,
    SOIL_DRY_VALUE,
    SOIL_WET_VALUE,
    0,
    100
  );

  return constrain(moisture, 0, 100);
}

// ============ FAN CONTROL ==============
void controlFan(float temperature) {
  if (temperature > FAN_ON_TEMP && !fanState) {
    digitalWrite(RELAY_FAN, RELAY_ON);
    fanState = true;
    Serial.println("COOLING FAN ON");
  }

  if (temperature < FAN_OFF_TEMP && fanState) {
    digitalWrite(RELAY_FAN, RELAY_OFF);
    fanState = false;
    Serial.println("COOLING FAN OFF");
  }

  // At exactly 30°C, retain the previous state.
}

// ============ PUMP CONTROL =============
void controlPump(int soilMoisture) {
  if (pumpState) {
    if (millis() - pumpStartTime >= PUMP_RUN_TIME) {
      digitalWrite(RELAY_PUMP, RELAY_OFF);
      pumpState = false;
      lastPumpStopTime = millis();
      Serial.println("WATER PUMP OFF");
    }
    return;
  }

  if (soilMoisture <= PUMP_START_MOISTURE) {
    if (lastPumpStopTime == 0 ||
        millis() - lastPumpStopTime >= PUMP_COOLDOWN) {
      digitalWrite(RELAY_PUMP, RELAY_ON);
      pumpState = true;
      pumpStartTime = millis();
      Serial.println("WATER PUMP ON");
    }
  }
}

// ============ FIREBASE UPLOAD ===========
void sendToFirebase(
  float temperature,
  float humidity,
  int soilMoisture,
  bool gasDetected,
  bool fanOn,
  bool pumpOn
) {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("Firebase skipped: WiFi disconnected");
    return;
  }

  WiFiClientSecure client;
  client.setInsecure(); // Testing only

  HTTPClient http;
  String url = String(FIREBASE_HOST) + "/mushroom.json";

  if (!http.begin(client, url)) {
    Serial.println("Firebase connection failed");
    return;
  }

  http.addHeader("Content-Type", "application/json");

  String json = "{";
  json += "\"temperature\":" + String(temperature, 2);
  json += ",\"humidity\":" + String(humidity, 2);
  json += ",\"soilMoisture\":" + String(soilMoisture);
  json += ",\"gasDetected\":" + String(gasDetected ? "true" : "false");
  json += ",\"fan\":" + String(fanOn ? "true" : "false");
  json += ",\"pump\":" + String(pumpOn ? "true" : "false");
  json += ",\"lastUpdate\":" + String(millis());
  json += "}";

  int httpCode = http.PUT(json);

  Serial.print("Firebase HTTP code: ");
  Serial.println(httpCode);

  if (httpCode > 0) {
    Serial.println(http.getString());
  } else {
    Serial.println(http.errorToString(httpCode));
  }

  http.end();
}

// ============ SETUP ====================
void setup() {
  Serial.begin(115200);
  delay(1000);

  analogReadResolution(12);

  pinMode(SOIL_A0, INPUT);
  pinMode(GAS_D0, INPUT);
  pinMode(RELAY_FAN, OUTPUT);
  pinMode(RELAY_PUMP, OUTPUT);

  digitalWrite(RELAY_FAN, RELAY_OFF);
  digitalWrite(RELAY_PUMP, RELAY_OFF);

  dht.begin();

  Serial.println("Smart Mushroom System Starting");

  connectWiFi();
}

// ============ MAIN LOOP ================
void loop() {
  if (WiFi.status() != WL_CONNECTED) {
    connectWiFi();
  }

  float temperature = dht.readTemperature();
  float humidity = dht.readHumidity();

  int soilRaw = analogRead(SOIL_A0);
  int soilMoisture = readSoilMoisture();

  bool gasDetected =
    (digitalRead(GAS_D0) == GAS_DETECTED);

  if (!isnan(temperature)) {
    controlFan(temperature);
  } else {
    Serial.println("DHT22 reading failed");
  }

  controlPump(soilMoisture);

  Serial.println("------------------------------");

  Serial.print("Temperature: ");
  if (!isnan(temperature)) {
    Serial.print(temperature);
    Serial.println(" C");
  } else {
    Serial.println("ERROR");
  }

  Serial.print("Humidity: ");
  if (!isnan(humidity)) {
    Serial.print(humidity);
    Serial.println(" %");
  } else {
    Serial.println("ERROR");
  }

  Serial.print("Soil raw: ");
  Serial.println(soilRaw);

  Serial.print("Soil moisture: ");
  Serial.print(soilMoisture);
  Serial.println("%");

  Serial.print("Gas detected: ");
  Serial.println(gasDetected ? "YES" : "NO");

  Serial.print("Fan: ");
  Serial.println(fanState ? "ON" : "OFF");

  Serial.print("Pump: ");
  Serial.println(pumpState ? "ON" : "OFF");

  if (millis() - previousFirebaseTime >= FIREBASE_INTERVAL ||
      previousFirebaseTime == 0) {
    previousFirebaseTime = millis();

    sendToFirebase(
      isnan(temperature) ? 0 : temperature,
      isnan(humidity) ? 0 : humidity,
      soilMoisture,
      gasDetected,
      fanState,
      pumpState
    );
  }

  delay(1000);
}