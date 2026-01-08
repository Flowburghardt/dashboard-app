# 📋 wytspace Event Dashboard - Komplette Setup-Anleitung

Event-Dashboard für das wytspace Studio Event am 10.01.2025
Zeigt Live-Kamera, Rankings, neue Uploads, Countdown und Musik-Visualizer auf einem Beamer (Full-HD, 16:9).

---

## 🎮 Features im Überblick

### 3 Modi (Keyboard-gesteuert)

**1. LIVE Dashboard (Taste `1`)**
```
┌─────────────────────────────────────────┐
│  IP-KAMERA (groß)  │  RANKING TOP 5     │
│                    │  ⭐ Max - 42       │
│                    │  ⭐ Lisa - 38      │
├────────────────────┼────────────────────┤
│  NEUE UPLOADS      │  COUNTDOWN  LINK   │
│  [img][img][img]   │   12:45     [→]    │
└─────────────────────────────────────────┘
```
- IP-Kamera Feed (live)
- Top 5 Rankings (foto-challenge)
- Neue Uploads (letzte 4 Bilder)
- Countdown Timer
- Link zur Slideshow-App

**2. Musik-Visualizer (Taste `2`)**
- Audio-reaktive Visualisierung
- Mikrofon-Input vom Rechner (Browser fragt um Erlaubnis)
- Frequenzbars + Circular Waveform
- Fullscreen-Modus

**3. Camera-Only (Taste `3`)**
- Fullscreen Kamera-Feed ohne UI

### Weitere Shortcuts
- `Space` - Auto-Rotation zwischen Modi (alle 30s)
- `F` - Fullscreen Toggle
- `ESC` - Fullscreen beenden

---

## 🚀 Quick Start (Lokale Entwicklung)

### 1. Repository Setup

```bash
cd dashboard-app

# Dependencies installieren
npm install

# .env Datei erstellen
cp .env.example .env
```

### 2. Umgebungsvariablen konfigurieren

Öffne `.env` und passe an:

```env
# FotoChallenge API (Backend muss laufen auf Port 3000)
VITE_FOTO_CHALLENGE_API=http://localhost:3000/api

# IP-Kamera Stream URL (siehe Kamera-Setup unten)
VITE_CAMERA_URL=http://192.168.1.100:8080/video

# Slideshow App URL
VITE_SLIDESHOW_URL=http://localhost:5173
```

### 3. Dev Server starten

```bash
npm run dev
# → Dashboard läuft auf: http://localhost:5173
```

### 4. Voraussetzungen prüfen

- ✅ FotoChallenge Backend läuft auf `http://localhost:3000`
- ✅ IP-Kamera ist im selben WLAN und Stream-URL ist bekannt
- ✅ Slideshow-App läuft (optional)

---

## 🎥 IP-Kamera Setup (Detailliert)

### Schritt 1: Kamera kaufen

Nach meiner Recherche **empfohlen für dein Setup** (Budget 30-50€, Akku, offenes WLAN):

#### ✅ Top-Empfehlung: TP-Link Tapo C410 (~64€)

**Warum:**
- Akkubetrieben + Solar-Panel Kit (läuft quasi unbegrenzt)
- WLAN (unterstützt offenes WLAN ohne Passwort)
- MJPEG & RTSP Stream (Browser-kompatibel)
- Gute Tapo-App für Setup
- 2K Auflösung, gute Qualität

**Wo kaufen:**
- Amazon: ~64€
- MediaMarkt/Saturn: ~70€

**Alternative (Budget):**

#### Option 2: Pearl Budget-Kameras (~40-50€)
- Akkubetrieben
- MJPEG-Stream
- No-Name Marken, aber funktional
- Link: pearl.de

#### Option 3: Reolink Argus 3 (~80€)
- Beste Qualität, aber über Budget
- Akku-betrieben
- Sehr gute App

---

### Schritt 2: Kamera einrichten (TP-Link Tapo Beispiel)

1. **Tapo-App installieren** (iOS/Android)
2. **Kamera aktivieren** (QR-Code scannen in App)
3. **WLAN verbinden:**
   - In App: "WLAN-Einstellungen"
   - Netzwerk auswählen: Dein offenes Studio-WLAN
   - Passwort: **LEER LASSEN** oder "Kein Passwort" auswählen
   - Bestätigen

4. **IP-Adresse notieren:**
   - In App: Einstellungen → Geräteinfo → IP-Adresse
   - Beispiel: `192.168.1.100`

---

### Schritt 3: Stream-URL finden

#### Option A: MJPEG-Stream (einfachste Methode)

**TP-Link Tapo:**
```
http://192.168.1.100:8080/stream/1
```

**Alternative URLs zum Testen:**
```
http://192.168.1.100:8080/video
http://192.168.1.100/stream
http://192.168.1.100:554/stream1
```

**Testen im Browser:**
```bash
# URL im Browser öffnen - sollte Live-Stream zeigen
http://192.168.1.100:8080/stream/1
```

Falls **kein Stream** sichtbar:
- Prüfe Kamera-Dokumentation für korrekte URL
- Versuche Port `554` oder `80`
- Google: "TP-Link Tapo C410 MJPEG URL"

#### Option B: RTSP-Stream (bessere Qualität, komplexer)

Falls Kamera nur RTSP unterstützt, brauchst du einen **RTSP-zu-HTTP Proxy** (Browser können kein RTSP nativ):

```bash
# Docker Container starten
docker run -d -p 8554:8554 aler9/rtsp-simple-server

# Kamera-RTSP-URL in Proxy einspeisen
# Beispiel: rtsp://192.168.1.100:554/stream1
```

Dann in `.env`:
```env
VITE_CAMERA_URL=http://localhost:8554/stream1
```

---

### Schritt 4: URL in Dashboard eintragen

Öffne `dashboard-app/.env` und trage ein:

```env
VITE_CAMERA_URL=http://192.168.1.100:8080/stream/1
```

Dashboard neu starten:
```bash
npm run dev
```

Drücke Taste `3` → Camera-Only Modus sollte Stream zeigen!

---

## ⏱️ Countdown Timer einstellen

Der Countdown läuft bis zu einem **festen Zeitpunkt** (z.B. Event-Start, Runden-Ende).

### Aktuell: Manuell im Code

Öffne `src/components/Dashboard.tsx` und finde Zeile ~17:

```typescript
const defaultSettings: DashboardSettings = {
  cameraUrl: import.meta.env.VITE_CAMERA_URL || '',
  countdownEndTime: '2025-01-10T20:00:00', // ← HIER ANPASSEN!
  slideshowUrl: import.meta.env.VITE_SLIDESHOW_URL || 'http://localhost:5173',
  fotoChallengeApiUrl: import.meta.env.VITE_FOTO_CHALLENGE_API || 'http://localhost:3000/api',
};
```

**Format:** ISO 8601 (`YYYY-MM-DDTHH:mm:ss`)

**Beispiele:**
- Event am 10. Januar 2025 um 20:00 Uhr: `2025-01-10T20:00:00`
- Nächste Runde in 30 Minuten: `2025-01-10T15:30:00`

**Countdown deaktivieren:**
```typescript
countdownEndTime: null, // Zeigt "Kein Countdown aktiv"
```

### TODO (für später):
- Admin-Panel zum Live-Einstellen des Countdowns
- LocalStorage für Persistenz

---

## 🔥 Am Event-Tag: Workflow

### 1. Alle Systeme starten

```bash
# Terminal 1: FotoChallenge Backend
cd foto-challenge-web-app/backend
npm run dev

# Terminal 2: Dashboard
cd dashboard-app
npm run dev

# Terminal 3: Slideshow (optional)
cd slideshow-app
npm run dev
```

### 2. Beamer vorbereiten

1. Dashboard im Browser öffnen: `http://localhost:5173`
2. **Fullscreen aktivieren:** Taste `F`
3. **Modus wählen:**
   - Taste `1` = LIVE Dashboard (Haupt-Ansicht)
   - Taste `2` = Musik-Visualizer (während Musik läuft)
   - Taste `3` = Camera-Only (nur Kamera)

4. **Auto-Rotation:** Taste `Space` (wechselt alle 30s zwischen Modi)

### 3. Troubleshooting während Event

**Kamera zeigt "Nicht erreichbar":**
- Ist Kamera eingeschaltet? (Akku voll?)
- Ist Kamera im WLAN? (In Router-Admin prüfen)
- Teste URL im Browser: `http://192.168.1.100:8080/stream/1`

**Rankings zeigen keine Daten:**
- Läuft FotoChallenge Backend? (`http://localhost:3000/api/votes/leaderboard/beamer`)
- CORS aktiviert im Backend?

**Mikrofon-Visualizer funktioniert nicht:**
- Hast du "Zulassen" geklickt im Browser?
- Chrome: `chrome://settings/content/microphone`
- HTTPS erforderlich (außer localhost)

**Neue Uploads erscheinen nicht:**
- Polling-Intervall ist 5 Sekunden
- Prüfe API: `http://localhost:3000/api/images?limit=4&sort=newest`

---

## 🏗️ Deployment (Coolify / VPS)

### Option 1: Mit Dockerfile

```bash
# 1. Build
docker build -t dashboard-app .

# 2. Run
docker run -p 3000:3000 \
  -e VITE_FOTO_CHALLENGE_API=https://challenge.w-y-t.space/api \
  -e VITE_CAMERA_URL=http://192.168.1.100:8080/stream/1 \
  -e VITE_SLIDESHOW_URL=https://slideshow.w-y-t.space \
  dashboard-app
```

### Option 2: Coolify Auto-Deploy

1. Git Push zu `main` Branch
2. Coolify baut automatisch via Dockerfile
3. Environment Variables in Coolify setzen:
   - `VITE_FOTO_CHALLENGE_API`
   - `VITE_CAMERA_URL`
   - `VITE_SLIDESHOW_URL`

**Wichtig:** Kamera-URL muss öffentlich erreichbar sein (oder VPN/Tailscale)!

---

## 📦 Build für Produktion

```bash
# TypeScript Check + Vite Build
npm run build

# Output: dist/ Ordner (statische Files)
# Kann mit beliebigem HTTP-Server gehostet werden:
npx serve dist
```

---

## 🛠️ Tech Stack

- **React 19** + **TypeScript**
- **Vite 7** (Build Tool, ESM)
- **Tailwind CSS 3** (Styling)
- **Framer Motion** (Animations)
- **Web Audio API** (Musik-Visualizer)
- **Lucide React** (Icons)

---

## 📚 Weitere Ressourcen

### Kamera-Recherche Quellen:
- [Heise: Beste kabellose Überwachungskameras](https://www.heise.de/bestenlisten/testsieger/top-10-die-beste-kabellose-ueberwachungskamera-im-test-akku-wlan-lte-und-solar/0spn5e4)
- [Pearl: Akkubetriebene IP-Kameras](https://www.pearl.de/mtrkw-11256-akkubetriebene-ip-full-hd-ueberwachungskameras-mit-apps.shtml)
- [TP-Link Tapo Store](https://de.store.tapo.com/collections/akku-kamera)

### FotoChallenge API Dokumentation:
- Leaderboard: `GET /api/votes/leaderboard/beamer`
- Neue Bilder: `GET /api/images?limit=4&sort=newest`

---

## ✅ Checkliste für Event-Tag

- [ ] Kamera aufgeladen (oder Solar-Panel angeschlossen)
- [ ] Kamera im WLAN eingeloggt (offenes Netz)
- [ ] Stream-URL getestet im Browser
- [ ] FotoChallenge Backend läuft
- [ ] Dashboard läuft und zeigt Daten
- [ ] Countdown richtig eingestellt
- [ ] Beamer/Monitor angeschlossen
- [ ] Fullscreen aktiviert (Taste F)
- [ ] Mikrofon-Erlaubnis erteilt (für Visualizer)
- [ ] Auto-Rotation getestet (Taste Space)

---

**Viel Erfolg beim Event am 10.01.2025! 🎉**

Bei Fragen: GitHub Issues oder direkt melden.
