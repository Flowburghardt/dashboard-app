import { useState, useEffect } from 'react';
import { Camera, CameraOff } from 'lucide-react';

interface CameraFeedProps {
  url: string;
  className?: string;
  showControls?: boolean;
}

export function CameraFeed({ url, className = '', showControls = false }: CameraFeedProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
  }, [url]);

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  if (!url) {
    return (
      <div className={`flex flex-col items-center justify-center bg-wyt-bg-card rounded-lg ${className}`}>
        <CameraOff className="w-16 h-16 text-wyt-text-muted mb-4" />
        <p className="text-wyt-text-muted text-sm">Keine Kamera konfiguriert</p>
        <p className="text-wyt-text-muted text-xs mt-1">Kamera-URL in Settings einstellen</p>
      </div>
    );
  }

  return (
    <div className={`relative bg-wyt-bg-card rounded-lg overflow-hidden ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-wyt-bg-card z-10">
          <div className="flex flex-col items-center">
            <Camera className="w-12 h-12 text-wyt-accent animate-pulse mb-2" />
            <p className="text-wyt-text-muted text-sm">Kamera lädt...</p>
          </div>
        </div>
      )}

      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-wyt-bg-card z-10">
          <div className="flex flex-col items-center">
            <CameraOff className="w-16 h-16 text-red-500 mb-4" />
            <p className="text-red-400 text-sm font-medium">Kamera nicht erreichbar</p>
            <p className="text-wyt-text-muted text-xs mt-1">URL: {url}</p>
          </div>
        </div>
      )}

      {/* MJPEG Stream via img tag (most compatible) */}
      <img
        src={url}
        alt="IP Camera Feed"
        className="w-full h-full object-cover"
        onLoad={handleLoad}
        onError={handleError}
      />

      {showControls && !hasError && (
        <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs text-white font-medium">LIVE</span>
          </div>
        </div>
      )}
    </div>
  );
}
