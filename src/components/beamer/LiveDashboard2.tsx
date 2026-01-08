import { motion } from 'framer-motion';
import { UploadsTicker } from './UploadsTicker';
import type { RecentImage } from './types';

interface LiveDashboard2Props {
  recentImages: RecentImage[];
  visibleCount: number;
  newImageIds: Set<number>;
  onClearNewImages: () => void;
  className?: string;
}

export function LiveDashboard2({
  recentImages,
  visibleCount,
  newImageIds,
  onClearNewImages,
  className = '',
}: LiveDashboard2Props) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`flex flex-col h-full relative ${className}`}
    >
      {/* Main Content: Ticker */}
      <div className="flex-1 relative overflow-hidden min-h-0">
        <UploadsTicker
          images={recentImages}
          visibleCount={visibleCount}
          newImageIds={newImageIds}
          onNewImagesShown={onClearNewImages}
          tickerInterval={4000}
          pauseDuration={20000}
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
