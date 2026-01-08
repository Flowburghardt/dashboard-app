interface SlideshowViewProps {
  url: string;
  className?: string;
}

export function SlideshowView({ url, className = '' }: SlideshowViewProps) {
  return (
    <div className={`relative bg-wyt-bg-card rounded-lg overflow-hidden ${className}`}>
      <iframe
        src={url}
        title="Slideshow"
        className="w-full h-full border-0"
        allow="autoplay; fullscreen"
      />
    </div>
  );
}
