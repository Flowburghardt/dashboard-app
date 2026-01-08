import { motion, AnimatePresence } from 'framer-motion';
import { ImageIcon, Upload } from 'lucide-react';
import type { RecentImage } from './types';

interface RecentUploadsProps {
  images: RecentImage[];
  className?: string;
}

export function RecentUploads({ images, className = '' }: RecentUploadsProps) {
  if (images.length === 0) {
    return (
      <div className={`flex flex-col items-center justify-center bg-wyt-bg-card rounded-lg p-6 ${className}`}>
        <ImageIcon className="w-12 h-12 text-wyt-text-muted mb-3" />
        <p className="text-wyt-text-muted text-sm">Keine Uploads vorhanden</p>
      </div>
    );
  }

  return (
    <div className={`bg-wyt-bg-card rounded-lg p-6 ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        <Upload className="w-5 h-5 text-wyt-accent" />
        <h3 className="text-lg font-bold text-wyt-text">Neue Uploads</h3>
      </div>

      <div className="grid grid-cols-4 gap-3">
        <AnimatePresence mode="popLayout">
          {images.slice(0, 4).map((image, index) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ delay: index * 0.1 }}
              className="relative aspect-square rounded-lg overflow-hidden bg-wyt-bg group cursor-pointer"
            >
              <img
                src={image.url}
                alt={`Upload von ${image.user_name}`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />

              {/* Overlay with user info */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-white text-xs font-semibold truncate">
                    {image.user_name}
                  </p>
                  <p className="text-white/70 text-[10px] truncate">
                    {image.category_name}
                  </p>
                </div>
              </div>

              {/* New Badge */}
              {index === 0 && (
                <div className="absolute top-2 right-2 bg-wyt-accent px-2 py-0.5 rounded-full">
                  <span className="text-white text-[10px] font-bold uppercase">Neu</span>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
