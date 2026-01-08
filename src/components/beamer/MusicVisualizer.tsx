import { useEffect, useRef, useState } from 'react';
import { Mic, MicOff, Volume2 } from 'lucide-react';

interface MusicVisualizerProps {
  className?: string;
}

export function MusicVisualizer({ className = '' }: MusicVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);

  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startVisualizer = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();

      analyser.fftSize = 256;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength) as Uint8Array;

      source.connect(analyser);

      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
      dataArrayRef.current = dataArray;

      setIsActive(true);
      setError(null);

      animate();
    } catch (err) {
      setError('Mikrofon-Zugriff verweigert');
      setIsActive(false);
    }
  };

  const stopVisualizer = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    setIsActive(false);
  };

  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas || !analyserRef.current || !dataArrayRef.current) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const analyser = analyserRef.current;
    const dataArray = dataArrayRef.current;
    const bufferLength = analyser.frequencyBinCount;

    const draw = () => {
      animationRef.current = requestAnimationFrame(draw);

      // @ts-expect-error - Web Audio API TypeScript type mismatch
      analyser.getByteFrequencyData(dataArray);

      // Clear canvas with gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#0a0a0f');
      gradient.addColorStop(1, '#1a1a2e');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw frequency bars
      const barWidth = (canvas.width / bufferLength) * 2.5;
      let barHeight;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        barHeight = (dataArray[i] / 255) * canvas.height * 0.8;

        // Create gradient for each bar
        const barGradient = ctx.createLinearGradient(0, canvas.height - barHeight, 0, canvas.height);
        barGradient.addColorStop(0, '#3B82F6');
        barGradient.addColorStop(0.5, '#60A5FA');
        barGradient.addColorStop(1, '#93C5FD');

        ctx.fillStyle = barGradient;
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

        // Add glow effect
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#3B82F6';

        x += barWidth + 1;
      }

      // Draw waveform overlay (circular)
      ctx.shadowBlur = 0;
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.5)';
      ctx.lineWidth = 3;
      ctx.beginPath();

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = Math.min(canvas.width, canvas.height) / 3;

      for (let i = 0; i < bufferLength; i++) {
        const angle = (i / bufferLength) * Math.PI * 2;
        const amplitude = (dataArray[i] / 255) * radius * 0.5;
        const x = centerX + Math.cos(angle) * (radius + amplitude);
        const y = centerY + Math.sin(angle) * (radius + amplitude);

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }

      ctx.closePath();
      ctx.stroke();

      // Draw center circle
      const avgAmplitude = dataArray.reduce((sum, val) => sum + val, 0) / bufferLength;
      const pulseRadius = radius * 0.3 * (1 + avgAmplitude / 255);

      const centerGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, pulseRadius);
      centerGradient.addColorStop(0, 'rgba(59, 130, 246, 0.8)');
      centerGradient.addColorStop(1, 'rgba(59, 130, 246, 0)');

      ctx.fillStyle = centerGradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, pulseRadius, 0, Math.PI * 2);
      ctx.fill();
    };

    draw();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      stopVisualizer();
    };
  }, []);

  return (
    <div className={`relative bg-wyt-bg-card rounded-lg overflow-hidden ${className}`}>
      <canvas
        ref={canvasRef}
        className="w-full h-full"
      />

      {/* Controls Overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        {!isActive && (
          <div className="flex flex-col items-center gap-4">
            {error ? (
              <>
                <MicOff className="w-16 h-16 text-red-500 mb-2" />
                <p className="text-red-400 font-medium">{error}</p>
                <button
                  onClick={startVisualizer}
                  className="px-6 py-3 bg-wyt-accent hover:bg-wyt-accent-hover text-white rounded-lg font-medium transition-colors"
                >
                  Erneut versuchen
                </button>
              </>
            ) : (
              <>
                <Volume2 className="w-16 h-16 text-wyt-accent mb-2 animate-pulse" />
                <p className="text-wyt-text-muted mb-4">Musik-Visualizer</p>
                <button
                  onClick={startVisualizer}
                  className="px-6 py-3 bg-wyt-accent hover:bg-wyt-accent-hover text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <Mic className="w-5 h-5" />
                  Mikrofon aktivieren
                </button>
                <p className="text-xs text-wyt-text-muted mt-2">Browser wird um Erlaubnis fragen</p>
              </>
            )}
          </div>
        )}
      </div>

      {/* Active Indicator */}
      {isActive && (
        <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs text-white font-medium">LIVE</span>
          </div>
        </div>
      )}

      {/* Stop Button */}
      {isActive && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
          <button
            onClick={stopVisualizer}
            className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg font-medium transition-colors backdrop-blur-sm flex items-center gap-2"
          >
            <MicOff className="w-4 h-4" />
            Stoppen
          </button>
        </div>
      )}
    </div>
  );
}
