interface LeaderboardViewProps {
  url: string;
  className?: string;
}

export function LeaderboardView({ url, className = '' }: LeaderboardViewProps) {
  return (
    <div className={`relative bg-wyt-bg-card rounded-lg overflow-hidden ${className}`}>
      <iframe
        src={url}
        title="Leaderboard"
        className="w-full h-full border-0"
        allow="autoplay; fullscreen"
      />
    </div>
  );
}
