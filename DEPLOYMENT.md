# Deployment Guide - wytspace Event Dashboard

Anleitung für Deployment auf Coolify / VPS.

---

## 🐳 Docker Build & Run (Lokal testen)

### Build

```bash
docker build -t dashboard-app .
```

### Run

```bash
docker run -p 3000:3000 \
  -e VITE_FOTO_CHALLENGE_API=http://localhost:3000/api \
  -e VITE_CAMERA_URL=http://192.168.1.100:8080/stream/1 \
  -e VITE_SLIDESHOW_URL=http://localhost:5173 \
  dashboard-app
```

Dashboard läuft auf: `http://localhost:3000`

---

## 🚀 Coolify Deployment

### 1. Repository Setup

1. **Git Repository erstellen** (falls noch nicht vorhanden)
   ```bash
   cd dashboard-app
   git init
   git add .
   git commit -m "Initial dashboard app"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **In Coolify:**
   - New Application → From Git
   - Repository URL eingeben
   - Branch: `main`
   - Build Pack: `Dockerfile`

### 2. Environment Variables

In Coolify unter **Environment Variables** eintragen:

```env
# FotoChallenge API (Production URL)
VITE_FOTO_CHALLENGE_API=https://challenge.w-y-t.space/api

# IP-Kamera Stream URL
# WICHTIG: Muss öffentlich erreichbar sein oder via VPN/Tailscale
VITE_CAMERA_URL=http://192.168.1.100:8080/stream/1

# Slideshow App URL (Production)
VITE_SLIDESHOW_URL=https://slideshow.w-y-t.space

# Optional: Port (default: 3000)
PORT=3000
```

### 3. Domain konfigurieren

- Domain: `dashboard.w-y-t.space` (oder beliebig)
- SSL: Automatisch via Let's Encrypt

### 4. Deploy

- Klick auf **Deploy**
- Coolify baut automatisch via Dockerfile
- Dashboard läuft auf: `https://dashboard.w-y-t.space`

---

## ⚠️ Wichtige Hinweise

### IP-Kamera Erreichbarkeit

**Problem:** IP-Kamera ist meist nur im lokalen WLAN erreichbar (z.B. `192.168.1.100`).

**Lösungen:**

#### Option A: VPN/Tailscale (empfohlen)
1. **Tailscale** auf Event-Rechner und VPS installieren
2. Kamera über Tailscale-IP ansprechen: `http://100.64.x.x:8080/stream/1`
3. In Coolify: `VITE_CAMERA_URL=http://100.64.x.x:8080/stream/1`

#### Option B: RTSP-Proxy auf Event-Rechner
1. Auf Event-Rechner (lokales Netzwerk):
   ```bash
   docker run -d -p 8080:8080 \
     -e RTSP_URL=rtsp://192.168.1.100:554/stream1 \
     ullaakut/rtspatt
   ```
2. Event-Rechner IP öffentlich via Tunneling (ngrok, cloudflared)
3. In Coolify: `VITE_CAMERA_URL=https://tunnel-url.com/stream`

#### Option C: Kamera nur lokal (kein Cloud-Dashboard)
- Dashboard lokal auf Event-Rechner hosten
- Kein Coolify, nur `npm run dev` oder Docker lokal

### Build-Time vs Runtime

**Wichtig:** Vite ersetzt `import.meta.env.VITE_*` zur **Build-Zeit**!

Das bedeutet:
- Environment Variables müssen beim **Build** gesetzt sein
- Coolify setzt diese automatisch vor dem Build
- Änderungen erfordern **Rebuild** (nicht nur Neustart)

**Alternative (Runtime Config):**
Falls du Variablen zur Laufzeit ändern willst, musst du sie in `public/config.json` auslagern und via Fetch laden.

---

## 📊 Monitoring

### Logs anschauen

In Coolify:
- **Logs** Tab → Echtzeit-Logs
- Filter nach Errors: `error|failed|ECONNREFUSED`

### Health Check

```bash
# Dashboard erreichbar?
curl https://dashboard.w-y-t.space

# FotoChallenge API erreichbar?
curl https://challenge.w-y-t.space/api/votes/leaderboard/beamer
```

---

## 🔄 Updates deployen

### Automatisch (Git Push)

```bash
git add .
git commit -m "Update dashboard"
git push origin main
```

Coolify baut automatisch neu.

### Manuell in Coolify

- **Redeploy** Button klicken
- Oder: **Rebuild** für frischen Build

---

## 🐛 Troubleshooting

### Build schlägt fehl

```bash
# Lokal testen:
npm run build

# Dockerfile lokal testen:
docker build -t dashboard-app .
```

### Dashboard zeigt "API Verbindung fehlgeschlagen"

1. Prüfe Environment Variable: `VITE_FOTO_CHALLENGE_API`
2. Teste API direkt: `curl https://challenge.w-y-t.space/api/votes/leaderboard/beamer`
3. CORS aktiviert im Backend?

### Kamera zeigt "Nicht erreichbar"

1. Ist `VITE_CAMERA_URL` richtig?
2. Ist Kamera von VPS erreichbar? (Test: `curl http://192.168.1.100:8080/stream/1`)
3. Nutze VPN/Tailscale für private IP-Adressen

### Countdown zeigt falsche Zeit

- Timezone-Problem: Server-Timezone vs. Browser-Timezone
- Lösung: Verwende ISO 8601 mit Timezone: `2025-01-10T20:00:00+01:00`

---

## 📦 Alternative: Static Hosting (ohne Docker)

Falls kein Docker gewünscht:

```bash
# 1. Build lokal
npm run build

# 2. dist/ Ordner zu Netlify/Vercel/Cloudflare Pages hochladen
# Environment Variables in Platform-Settings setzen
```

**Wichtig:** Vite-Env-Vars werden zur Build-Zeit ersetzt!

---

## 🔒 Sicherheit

- **Kamera-Stream:** Nicht öffentlich exposen ohne Auth
- **HTTPS:** Pflicht für Mikrofon-Zugriff (Web Audio API)
- **CORS:** Backend muss CORS-Header setzen für Dashboard-Domain

---

Bei Problemen: GitHub Issues oder direkt melden.
