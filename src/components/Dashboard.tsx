import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBeamerData } from '../hooks/useBeamerData';
import { LiveDashboard } from './beamer/LiveDashboard';
import { MusicVisualizer } from './beamer/MusicVisualizer';
import { CameraFeed } from './beamer/CameraFeed';
import { SlideshowView } from './beamer/SlideshowView';
import { LeaderboardView } from './beamer/LeaderboardView';
import { TimerControlModal } from './beamer/TimerControlModal';
import type { BeamerMode, DashboardSettings } from './beamer/types';

const fadeTransition = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.5 },
};

// Default settings (can be overridden via localStorage or env)
const defaultSettings: DashboardSettings = {
  cameraUrl: import.meta.env.VITE_CAMERA_URL || '',
  // Set to event time: 10. Januar 2025, 20:00 Uhr
  countdownEndTime: '2025-01-10T20:00:00',
  slideshowUrl: import.meta.env.VITE_SLIDESHOW_URL || 'http://localhost:5176',
  leaderboardUrl: import.meta.env.VITE_LEADERBOARD_URL || 'https://foto.wytspace.studio/beamer',
  fotoChallengeApiUrl: import.meta.env.VITE_FOTO_CHALLENGE_API || 'http://localhost:3000/api',
};

export function Dashboard() {
  const [mode, setMode] = useState<BeamerMode>('live');
  const [autoSwitch, setAutoSwitch] = useState(false);
  const [settings, setSettings] = useState<DashboardSettings>(defaultSettings);
  const [showTimerModal, setShowTimerModal] = useState(false);
  const { data, recentImages, isLoading, error, isConnected } = useBeamerData(5000);

  // Update settings and persist to localStorage
  const updateSettings = useCallback((updates: Partial<DashboardSettings>) => {
    setSettings((prev) => {
      const newSettings = { ...prev, ...updates };
      localStorage.setItem('dashboardSettings', JSON.stringify(newSettings));
      return newSettings;
    });
  }, []);

  // Load settings from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('dashboardSettings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSettings((prev) => ({ ...prev, ...parsed }));
      } catch (e) {
        console.error('Failed to parse saved settings', e);
      }
    }
  }, []);

  // Auto-switch between modes (disabled by default)
  useEffect(() => {
    if (!autoSwitch) return;

    const timer = setInterval(() => {
      setMode((prev) => {
        if (prev === 'live') return 'slideshow';
        if (prev === 'slideshow') return 'visualizer';
        if (prev === 'visualizer') return 'camera';
        return 'live';
      });
    }, 30000); // 30 seconds

    return () => clearInterval(timer);
  }, [autoSwitch]);

  // Keyboard controls
  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    switch (e.key) {
      case '1':
        setMode('live');
        setAutoSwitch(false);
        break;
      case '2':
        setMode('slideshow');
        setAutoSwitch(false);
        break;
      case '3':
        setMode('visualizer');
        setAutoSwitch(false);
        break;
      case '4':
        setMode('camera');
        setAutoSwitch(false);
        break;
      case '5':
        setMode('leaderboard');
        setAutoSwitch(false);
        break;
      case ' ':
        e.preventDefault();
        setAutoSwitch((prev) => !prev);
        break;
      case 't':
      case 'T':
        setShowTimerModal(true);
        break;
      case 'f':
      case 'F':
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch(() => {});
        } else {
          document.exitFullscreen().catch(() => {});
        }
        break;
      case 'Escape':
        if (document.fullscreenElement) {
          document.exitFullscreen().catch(() => {});
        }
        break;
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  // Prevent scrolling
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-[#0a0a0f] to-[#1a1a2e] text-white flex flex-col overflow-hidden">
      {/* Header */}
      <header className="flex-shrink-0 text-center pt-6 pb-3">
        <img
          src="/LICHT-BLICK-RAUM-TYPO-Logo.svg"
          alt="Licht.Blick.Raum"
          className="h-20 mx-auto"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      </header>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {error && !isConnected ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-2xl text-red-400 mb-2">Verbindungsfehler</p>
              <p className="text-wyt-text-muted">{error}</p>
              <p className="text-wyt-text-muted text-sm mt-2">
                API: {settings.fotoChallengeApiUrl}
              </p>
            </div>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {mode === 'live' ? (
              <motion.div key="live" {...fadeTransition} className="h-full">
                <LiveDashboard
                  data={data}
                  recentImages={recentImages}
                  settings={settings}
                  isLoading={isLoading}
                  onTimerClick={() => setShowTimerModal(true)}
                />
              </motion.div>
            ) : mode === 'slideshow' ? (
              <motion.div key="slideshow" {...fadeTransition} className="h-full p-6">
                <SlideshowView url={settings.slideshowUrl} className="h-full" />
              </motion.div>
            ) : mode === 'visualizer' ? (
              <motion.div key="visualizer" {...fadeTransition} className="h-full p-6">
                <MusicVisualizer className="h-full" />
              </motion.div>
            ) : mode === 'camera' ? (
              <motion.div key="camera" {...fadeTransition} className="h-full p-6">
                <CameraFeed url={settings.cameraUrl} className="h-full" showControls />
              </motion.div>
            ) : (
              <motion.div key="leaderboard" {...fadeTransition} className="h-full p-6">
                <LeaderboardView apiUrl={settings.fotoChallengeApiUrl} className="h-full" />
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>

      {/* Footer / Status Bar */}
      <footer className="flex-shrink-0 px-8 py-3 flex items-center justify-between text-sm text-wyt-text-muted">
        {/* Left: wytspace logo */}
        <div className="flex items-center gap-4">
          <img
            src="/wytspace-logo-white.svg"
            alt="wytspace"
            className="h-5 opacity-50"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>

        {/* Center: Connection status & update time */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
                isConnected ? 'bg-green-500' : 'bg-red-500'
              }`}
            />
            <span className="text-xs">{isConnected ? 'Live' : 'Offline'}</span>
          </div>
          {data?.lastUpdate && (
            <span className="text-xs opacity-60">
              {new Date(data.lastUpdate).toLocaleTimeString('de-DE')}
            </span>
          )}
        </div>

        {/* Right: Mode indicator & controls hint */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-xs">
            <span className={mode === 'live' ? 'text-wyt-accent font-semibold' : 'opacity-60'}>
              Live
            </span>
            <span className="opacity-40">/</span>
            <span className={mode === 'slideshow' ? 'text-wyt-accent font-semibold' : 'opacity-60'}>
              Slideshow
            </span>
            <span className="opacity-40">/</span>
            <span className={mode === 'visualizer' ? 'text-wyt-accent font-semibold' : 'opacity-60'}>
              Visualizer
            </span>
            <span className="opacity-40">/</span>
            <span className={mode === 'camera' ? 'text-wyt-accent font-semibold' : 'opacity-60'}>
              Camera
            </span>
            <span className="opacity-40">/</span>
            <span className={mode === 'leaderboard' ? 'text-wyt-accent font-semibold' : 'opacity-60'}>
              Leaderboard
            </span>
            {autoSwitch && (
              <span className="ml-1 text-xs bg-wyt-accent/20 text-wyt-accent px-1.5 py-0.5 rounded text-[10px]">
                AUTO
              </span>
            )}
          </div>
          <div className="text-[10px] opacity-40">
            [1] Live [2] Slideshow [3] Visualizer [4] Camera [5] Leaderboard [T] Timer [Space] Auto [F] Fullscreen
          </div>
        </div>
      </footer>

      {/* Timer Control Modal */}
      <TimerControlModal
        isOpen={showTimerModal}
        onClose={() => setShowTimerModal(false)}
        settings={settings}
        onSave={updateSettings}
      />
    </div>
  );
}
