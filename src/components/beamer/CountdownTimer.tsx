import { useState, useEffect } from 'react';
import { Clock, Timer } from 'lucide-react';

interface CountdownTimerProps {
  endTime: string | null;
  className?: string;
  label?: string;
}

export function CountdownTimer({ endTime, className = '', label = 'Nächste Runde' }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
    total: number;
  } | null>(null);

  useEffect(() => {
    if (!endTime) return;

    const calculateTimeLeft = () => {
      const end = new Date(endTime).getTime();
      const now = Date.now();
      const difference = end - now;

      if (difference <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0, total: 0 });
        return;
      }

      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ hours, minutes, seconds, total: difference });
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [endTime]);

  if (!endTime) {
    return (
      <div className={`flex flex-col items-center justify-center bg-wyt-bg-card rounded-lg p-6 ${className}`}>
        <Clock className="w-12 h-12 text-wyt-text-muted mb-3" />
        <p className="text-wyt-text-muted text-sm">Kein Countdown aktiv</p>
      </div>
    );
  }

  if (!timeLeft) {
    return null;
  }

  const isUrgent = timeLeft.total > 0 && timeLeft.total < 60000; // Last minute

  return (
    <div className={`flex flex-col items-center justify-center bg-wyt-bg-card rounded-lg p-6 ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        <Timer className={`w-5 h-5 ${isUrgent ? 'text-red-500' : 'text-wyt-accent'}`} />
        <span className="text-sm text-wyt-text-muted uppercase tracking-wider">{label}</span>
      </div>

      <div className="flex items-center gap-3">
        {/* Hours */}
        {timeLeft.hours > 0 && (
          <>
            <div className="flex flex-col items-center">
              <div className={`text-5xl font-bold tabular-nums ${isUrgent ? 'text-red-500' : 'text-wyt-accent'}`}>
                {String(timeLeft.hours).padStart(2, '0')}
              </div>
              <span className="text-xs text-wyt-text-muted mt-1">STD</span>
            </div>
            <div className={`text-5xl font-bold ${isUrgent ? 'text-red-500' : 'text-wyt-accent'}`}>:</div>
          </>
        )}

        {/* Minutes */}
        <div className="flex flex-col items-center">
          <div className={`text-5xl font-bold tabular-nums ${isUrgent ? 'text-red-500 animate-pulse' : 'text-wyt-accent'}`}>
            {String(timeLeft.minutes).padStart(2, '0')}
          </div>
          <span className="text-xs text-wyt-text-muted mt-1">MIN</span>
        </div>

        <div className={`text-5xl font-bold ${isUrgent ? 'text-red-500' : 'text-wyt-accent'}`}>:</div>

        {/* Seconds */}
        <div className="flex flex-col items-center">
          <div className={`text-5xl font-bold tabular-nums ${isUrgent ? 'text-red-500 animate-pulse' : 'text-wyt-accent'}`}>
            {String(timeLeft.seconds).padStart(2, '0')}
          </div>
          <span className="text-xs text-wyt-text-muted mt-1">SEK</span>
        </div>
      </div>

      {timeLeft.total === 0 && (
        <div className="mt-4 text-center">
          <p className="text-lg font-bold text-green-500">Zeit abgelaufen!</p>
        </div>
      )}
    </div>
  );
}
