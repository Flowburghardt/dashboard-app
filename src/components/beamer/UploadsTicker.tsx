import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { RecentImage } from './types';
import { getCategoryStyle } from '../../utils/categoryConfig';

interface UploadsTickerProps {
  images: RecentImage[];
  visibleCount: number;
  newImageIds: Set<number>;
  onNewImagesShown?: () => void;
  tickerInterval?: number;
  pauseDuration?: number;
  className?: string;
}

export function UploadsTicker({
  images,
  visibleCount,
  newImageIds,
  onNewImagesShown,
  tickerInterval = 4000,
  pauseDuration = 5000,
  className = '',
}: UploadsTickerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const pauseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const previousNewImageCount = useRef(0);

  // Get visible images based on current index
  const getVisibleImages = useCallback(() => {
    if (images.length === 0) return [];
    if (images.length <= visibleCount) return images;

    const visible: RecentImage[] = [];
    for (let i = 0; i < visibleCount; i++) {
      const index = (currentIndex + i) % images.length;
      visible.push(images[index]);
    }
    return visible;
  }, [images, currentIndex, visibleCount]);

  // Handle new images - pause ticker and reset to start
  useEffect(() => {
    if (newImageIds.size > 0 && newImageIds.size !== previousNewImageCount.current) {
      // New images detected - pause and reset
      setIsPaused(true);
      setCurrentIndex(0);

      // Clear any existing timeout
      if (pauseTimeoutRef.current) {
        clearTimeout(pauseTimeoutRef.current);
      }

      // Resume after pause duration
      pauseTimeoutRef.current = setTimeout(() => {
        setIsPaused(false);
        onNewImagesShown?.();
      }, pauseDuration);

      previousNewImageCount.current = newImageIds.size;
    } else if (newImageIds.size === 0) {
      previousNewImageCount.current = 0;
    }

    return () => {
      if (pauseTimeoutRef.current) {
        clearTimeout(pauseTimeoutRef.current);
      }
    };
  }, [newImageIds, pauseDuration, onNewImagesShown]);

  // Ticker animation - advance index periodically
  useEffect(() => {
    if (isPaused || images.length <= visibleCount) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, tickerInterval);

    return () => clearInterval(interval);
  }, [isPaused, images.length, visibleCount, tickerInterval]);

  const visibleImages = getVisibleImages();

  if (images.length === 0) {
    return (
      <div className={`flex items-center justify-center h-full ${className}`}>
        <p className="text-wyt-text-muted text-xl">Noch keine Bilder hochgeladen</p>
      </div>
    );
  }

  // Calculate grid columns based on visible count
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
  }[visibleCount] || 'grid-cols-5';

  // Calculate max width for centered layout with fewer images
  // For 1-2 images: constrain width to keep them centered and not too large
  // For 3-5 images: use full width with minimal padding
  const maxWidthClass = visibleCount <= 2 ? 'max-w-4xl' : '';
  const paddingClass = visibleCount <= 2 ? 'px-8' : 'px-4';

  return (
    <div className={`flex items-center justify-center h-full ${className}`}>
      <div className={`grid ${gridCols} gap-6 w-full ${maxWidthClass} mx-auto ${paddingClass}`}>
        <AnimatePresence mode="popLayout">
          {visibleImages.map((image, index) => {
            const isNew = newImageIds.has(image.id);
            const categoryStyle = getCategoryStyle(image.category_name);

            return (
              <motion.div
                key={image.id}
                layout
                initial={{ opacity: 0, x: 100, scale: 0.9 }}
                animate={{
                  opacity: 1,
                  x: 0,
                  scale: isNew ? 1.02 : 1,
                }}
                exit={{ opacity: 0, x: -100, scale: 0.9 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                  layout: { duration: 0.3 },
                }}
                className="relative"
              >
                <div
                  className={`
                    relative overflow-hidden rounded-2xl bg-wyt-bg-card
                    aspect-[3/4] w-full
                    ${isNew ? 'ring-4 ring-wyt-accent ring-opacity-80 shadow-[0_0_30px_rgba(59,130,246,0.4)]' : ''}
                  `}
                >
                  {/* Image */}
                  <img
                    src={image.url}
                    alt={`Foto von ${image.user_name}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />

                  {/* New badge */}
                  {isNew && (
                    <motion.div
                      initial={{ scale: 0, rotate: -20 }}
                      animate={{ scale: 1, rotate: 0 }}
                      className="absolute top-3 right-3 bg-wyt-accent text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg"
                    >
                      NEU!
                    </motion.div>
                  )}

                  {/* Gradient overlay with info */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                    <p className="text-white font-semibold text-lg truncate">
                      {image.user_name}
                    </p>
                    <div
                      className="inline-block px-2 py-0.5 rounded text-xs font-medium mt-1"
                      style={{
                        backgroundColor: categoryStyle.bgLight,
                        color: categoryStyle.color,
                        borderColor: categoryStyle.borderColor,
                      }}
                    >
                      {image.category_name}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Ticker indicator (subtle dots showing position) */}
      {images.length > visibleCount && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
          {images.map((_, index) => (
            <div
              key={index}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                index >= currentIndex && index < currentIndex + visibleCount
                  ? 'bg-wyt-accent w-3'
                  : 'bg-wyt-text-muted/30'
              }`}
            />
          ))}
        </div>
      )}

      {/* Pause indicator */}
      {isPaused && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-wyt-accent/90 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg"
          >
            Neues Foto eingetroffen!
          </motion.div>
        </div>
      )}
    </div>
  );
}
