# wytspace Event Dashboard

Event-Dashboard für das wytspace Studio Event am 10.01.2025. Zeigt Live-Kamera, Rankings, neue Uploads, Countdown und Musik-Visualizer auf einem Beamer (Full-HD, 16:9).

**Production URL:** https://dash.wytspace.studio

## Features

### 4 Modi (Keyboard-gesteuert)

1. **LIVE Dashboard** (Taste `1`)
   - IP-Kamera Feed (live)
   - Top 5 Rankings (foto-challenge)
   - Neue Uploads (letzte 4 Bilder)
   - Countdown Timer
   - Link zur Slideshow-App

2. **Slideshow** (Taste `2`)
   - Eingebettete Slideshow-App
   - Fullscreen-fähig

3. **Musik-Visualizer** (Taste `3`)
   - Audio-reaktive Visualisierung
   - Mikrofon-Input vom Rechner
   - Frequenzbars + Circular Waveform

4. **Camera-Only** (Taste `4`)
   - Fullscreen Kamera-Feed

### Weitere Shortcuts

- `Space` - Auto-Rotation zwischen Modi (alle 30s: Live → Slideshow → Visualizer → Camera)
- `F` - Fullscreen Toggle
- `ESC` - Fullscreen beenden

## Setup

### 1. Dependencies installieren

```bash
npm install
```

### 2. Umgebungsvariablen konfigurieren

Erstelle `.env` aus `.env.example`:

```bash
cp .env.example .env
```

Anpassen:

```env
# FotoChallenge API (läuft auf Port 3000)
VITE_FOTO_CHALLENGE_API=http://localhost:3000/api

# IP-Kamera Stream URL
VITE_CAMERA_URL=http://192.168.1.100:8080/video

# Slideshow App URL
VITE_SLIDESHOW_URL=http://localhost:5173
```

### 3. Dev Server starten

```bash
npm run dev
```

Dashboard läuft auf: `http://localhost:5174`

## IP-Kamera Setup

### MJPEG-Stream (empfohlen für Budget-Kameras)

Die meisten günstigen IP-Kameras (TP-Link Tapo, Reolink, etc.) unterstützen MJPEG:

```env
VITE_CAMERA_URL=http://192.168.1.100:8080/video
```

**Kamera-Empfehlungen (30-50€, Akku):**

1. **TP-Link Tapo C410** (~64€) - Akku + Solar, WLAN, RTSP/MJPEG
2. **Reolink Argus 3** (~80€) - Akku, gute Qualität
3. **Pearl Budget-Kameras** (~40€) - No-Name, solide

**Offenes WLAN (ohne Passwort):**
- Bei Setup in der Kamera-App "Kein Passwort" auswählen
- Manche Apps verlangen ein leeres Passwortfeld

### RTSP-Stream (bessere Qualität)

Falls deine Kamera RTSP unterstützt, musst du einen RTSP-zu-HTTP Proxy verwenden (Browser können kein RTSP nativ):

```bash
# Docker: RTSP Simple Server
docker run -p 8554:8554 aler9/rtsp-simple-server
```

Dann in `.env`:
```env
VITE_CAMERA_URL=http://localhost:8554/stream1
```

## Countdown Timer

Der Countdown läuft bis zu einem festen Zeitpunkt. Aktuell nur via Code anpassbar:

```typescript
// In src/components/Dashboard.tsx
const defaultSettings: DashboardSettings = {
  countdownEndTime: '2025-01-10T20:00:00', // ISO 8601 Format
  // ...
};
```

**TODO:** Admin-Panel zum Einstellen

## Deployment

### Vite Build

```bash
npm run build
```

Output: `dist/` Ordner

### Coolify / VPS

1. Git Push zu `main` Branch
2. Coolify baut automatisch via Dockerfile
3. Environment Variables in Coolify setzen:
   - `VITE_FOTO_CHALLENGE_API`
   - `VITE_CAMERA_URL`
   - `VITE_SLIDESHOW_URL`

## Tech Stack

- **React 19** + **TypeScript**
- **Vite** (Build Tool)
- **Tailwind CSS** (Styling)
- **Framer Motion** (Animations)
- **Web Audio API** (Musik-Visualizer)

## Troubleshooting

### Kamera zeigt "Nicht erreichbar"

1. Prüfe Kamera-URL in `.env`
2. Teste URL im Browser: `http://192.168.1.100:8080/video`
3. CORS-Problem? Kamera muss CORS-Header setzen oder Proxy verwenden

### Mikrofon-Zugriff verweigert

1. Browser fragt um Erlaubnis - auf "Zulassen" klicken
2. HTTPS erforderlich (außer localhost)
3. In Chrome: `chrome://settings/content/microphone`

### API-Verbindung schlägt fehl

1. FotoChallenge Backend läuft? (`http://localhost:3000/api/votes/leaderboard/beamer`)
2. CORS aktiviert im Backend?
3. Richtige API-URL in `.env`?

## Lizenz

MIT
