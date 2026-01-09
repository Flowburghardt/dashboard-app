import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { RecentImage } from './types';

interface NewUploadOverlayProps {
  recentImages: RecentImage[];
  newImageIds: Set<number>;
  onImageShown?: (id: number) => void;
}

const MAX_QUEUE_SIZE = 10;
const SHOW_DURATION = 3000; // 3 seconds
const ANIMATION_DURATION = 0.8; // seconds

export function NewUploadOverlay({
  recentImages,
  newImageIds,
  onImageShown,
}: NewUploadOverlayProps) {
  const [queue, setQueue] = useState<number[]>([]);
  const [currentImage, setCurrentImage] = useState<RecentImage | null>(null);
  const [phase, setPhase] = useState<'idle' | 'entering' | 'showing' | 'exiting'>('idle');
  const processedIds = useRef<Set<number>>(new Set());
  const showTimeoutRef = useRef<number | null>(null);

  // Add new image IDs to queue when they arrive
  useEffect(() => {
    const newIds = Array.from(newImageIds).filter(
      (id) => !processedIds.current.has(id) && !queue.includes(id)
    );

    if (newIds.length > 0) {
      setQueue((prev) => {
        const combined = [...prev, ...newIds];
        // Limit queue size to MAX_QUEUE_SIZE
        return combined.slice(0, MAX_QUEUE_SIZE);
      });
    }
  }, [newImageIds, queue]);

  // Process queue - show next image when idle
  useEffect(() => {
    if (phase === 'idle' && queue.length > 0) {
      const nextId = queue[0];
      const image = recentImages.find((img) => img.id === nextId);

      if (image) {
        setCurrentImage(image);
        setPhase('entering');
        processedIds.current.add(nextId);
        setQueue((prev) => prev.slice(1));
      } else {
        // Image not found in recentImages, skip it
        setQueue((prev) => prev.slice(1));
      }
    }
  }, [phase, queue, recentImages]);

  // Handle phase transitions
  const handleAnimationComplete = useCallback(() => {
    if (phase === 'entering') {
      setPhase('showing');
      // Start timer to exit after SHOW_DURATION
      showTimeoutRef.current = window.setTimeout(() => {
        setPhase('exiting');
      }, SHOW_DURATION);
    } else if (phase === 'exiting') {
      if (currentImage) {
        onImageShown?.(currentImage.id);
      }
      setCurrentImage(null);
      setPhase('idle');
    }
  }, [phase, currentImage, onImageShown]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (showTimeoutRef.current) {
        clearTimeout(showTimeoutRef.current);
      }
    };
  }, []);

  const getAnimationProps = () => {
    switch (phase) {
      case 'entering':
        return {
          initial: { y: '100vh', opacity: 0, scale: 0.9 },
          animate: { y: '25vh', opacity: 1, scale: 1 },
          transition: { duration: ANIMATION_DURATION, ease: [0, 0, 0.2, 1] as const },
        };
      case 'showing':
        return {
          initial: { y: '25vh', opacity: 1, scale: 1 },
          animate: { y: '25vh', opacity: 1, scale: 1 },
          transition: { duration: 0 },
        };
      case 'exiting':
        return {
          initial: { y: '25vh', opacity: 1, scale: 1 },
          animate: { y: '-100vh', opacity: 0, scale: 0.9 },
          transition: { duration: ANIMATION_DURATION, ease: [0.4, 0, 1, 1] as const },
        };
      default:
        return {
          initial: { y: '100vh', opacity: 0 },
          animate: { y: '100vh', opacity: 0 },
          transition: { duration: 0 },
        };
    }
  };

  return (
    <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
      <AnimatePresence>
        {currentImage && phase !== 'idle' && (
          <motion.div
            key={currentImage.id}
            className="absolute inset-0 flex items-start justify-center"
            {...getAnimationProps()}
            onAnimationComplete={handleAnimationComplete}
          >
            <div className="relative h-[50vh] aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
              {/* Image */}
              <img
                src={currentImage.url}
                alt={`Upload von ${currentImage.user_name}`}
                className="w-full h-full object-cover"
              />
              {/* Gradient overlay for text readability */}
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/80 to-transparent" />
              {/* Username badge */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center gap-3">
                <span className="text-white text-xl font-semibold drop-shadow-lg">
                  {currentImage.user_name}
                </span>
              </div>
              {/* Glow effect */}
              <div className="absolute inset-0 ring-4 ring-wyt-accent/50 rounded-2xl" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
