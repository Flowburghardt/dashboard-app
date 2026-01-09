import { NewUploadOverlay } from './NewUploadOverlay';
import type { RecentImage } from './types';

interface SlideshowViewProps {
  url: string;
  className?: string;
  recentImages?: RecentImage[];
  newImageIds?: Set<number>;
  onImageShown?: (id: number) => void;
}

export function SlideshowView({
  url,
  className = '',
  recentImages = [],
  newImageIds = new Set(),
  onImageShown,
}: SlideshowViewProps) {
  return (
    <div className={`relative bg-wyt-bg-card rounded-lg overflow-hidden ${className}`}>
      <iframe
        src={url}
        title="Slideshow"
        className="w-full h-full border-0"
        allow="autoplay; fullscreen"
      />
      {/* New Upload Overlay */}
      <NewUploadOverlay
        recentImages={recentImages}
        newImageIds={newImageIds}
        onImageShown={onImageShown}
      />
    </div>
  );
}
