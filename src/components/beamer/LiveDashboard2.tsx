import { motion } from 'framer-motion';
import { UploadsTicker } from './UploadsTicker';
import { CountdownTimer } from './CountdownTimer';
import type { RecentImage, DashboardSettings } from './types';

interface LiveDashboard2Props {
  recentImages: RecentImage[];
  settings: DashboardSettings;
  visibleCount: number;
  newImageIds: Set<number>;
  onClearNewImages: () => void;
  onTimerClick?: () => void;
  className?: string;
}

export function LiveDashboard2({
  recentImages,
  settings,
  visibleCount,
  newImageIds,
  onClearNewImages,
  onTimerClick,
  className = '',
}: LiveDashboard2Props) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`flex flex-col h-full ${className}`}
    >
      {/* Header with Timer */}
      <div className="flex-shrink-0 flex items-center justify-between px-8 py-4">
        {/* Left spacer for balance */}
        <div className="w-48" />

        {/* Center: Title or empty */}
        <div className="flex-1" />

        {/* Right: Countdown Timer (compact) */}
        <div className="w-64">
          <CountdownTimer
            endTime={settings.countdownEndTime}
            label={settings.countdownLabel || 'Deadline Uploads'}
            onClick={onTimerClick}
            className="!p-3 !rounded-lg"
          />
        </div>
      </div>

      {/* Main Content: Ticker */}
      <div className="flex-1 relative overflow-hidden min-h-0">
        <UploadsTicker
          images={recentImages}
          visibleCount={visibleCount}
          newImageIds={newImageIds}
          onNewImagesShown={onClearNewImages}
          tickerInterval={4000}
          pauseDuration={5000}
          className="h-full"
        />
      </div>

      {/* Bottom info bar */}
      <div className="flex-shrink-0 px-8 py-3 text-center">
        <p className="text-wyt-text-muted text-sm">
          {recentImages.length} Bilder geladen
          {visibleCount < 5 && (
            <span className="ml-3 text-wyt-accent">
              Anzeige: {visibleCount} {visibleCount === 1 ? 'Bild' : 'Bilder'}
            </span>
          )}
        </p>
      </div>
    </motion.div>
  );
}
