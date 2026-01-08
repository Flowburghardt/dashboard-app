import type { BeamerEntry } from './types';

interface LeaderCardProps {
  entry: BeamerEntry;
  variant: 'hero' | 'podium' | 'runner-up' | 'mini';
}

const rankColors: Record<number, { border: string; badge: string }> = {
  1: {
    border: 'ring-yellow-500/50',
    badge: 'bg-yellow-500 text-black',
  },
  2: {
    border: 'ring-gray-400/50',
    badge: 'bg-gray-400 text-black',
  },
  3: {
    border: 'ring-amber-600/50',
    badge: 'bg-amber-600 text-black',
  },
};

const defaultRankStyle = {
  border: 'ring-wyt-border',
  badge: 'bg-wyt-bg-light text-white',
};

export function LeaderCard({ entry, variant }: LeaderCardProps) {
  const rankStyle = rankColors[entry.rank] || defaultRankStyle;

  // Mini variant for small inline displays
  if (variant === 'mini') {
    return (
      <div className="flex items-center gap-2 p-2 rounded-lg bg-wyt-bg-light/50">
        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${rankStyle.badge}`}>
          {entry.rank}
        </div>
        <div className="w-12 aspect-[3/4] rounded overflow-hidden flex-shrink-0">
          <img src={entry.url} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{entry.user_name}</p>
        </div>
        <div className="text-yellow-400 text-sm font-bold">
          ★ {entry.total_stars}
        </div>
      </div>
    );
  }

  // Runner-up variant for #4-#8
  if (variant === 'runner-up') {
    return (
      <div className="relative overflow-hidden rounded-xl h-[15vh] aspect-[3/4]">
        <img src={entry.url} alt="" className="w-full h-full object-cover" />

        <div className={`absolute top-2 left-2 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold ${rankStyle.badge}`}>
          {entry.rank}
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
          <p className="text-sm font-medium truncate">{entry.user_name}</p>
          <div className="text-yellow-400 text-sm font-bold">
            ★ {entry.total_stars}
          </div>
        </div>
      </div>
    );
  }

  // Podium variant - Top 3 large portraits
  if (variant === 'podium') {
    const isFirst = entry.rank === 1;
    const imageHeight = isFirst ? 'h-[48vh]' : 'h-[40vh]';

    return (
      <div className={`relative overflow-hidden rounded-2xl ring-2 ${rankStyle.border} ${imageHeight} aspect-[3/4]`}>
        <img
          src={entry.url}
          alt=""
          className="w-full h-full object-cover"
        />

        <div className={`absolute top-4 left-4 w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold ${rankStyle.badge}`}>
          {entry.rank}
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
          <p className={`font-semibold truncate ${isFirst ? 'text-2xl' : 'text-xl'}`}>
            {entry.user_name}
          </p>
          <p className="text-white/80 text-sm truncate mb-2">
            {entry.challenge_title}
          </p>
          <div className={`text-yellow-400 font-bold ${isFirst ? 'text-3xl' : 'text-2xl'}`}>
            ★ {entry.total_stars}
          </div>
        </div>
      </div>
    );
  }

  // Hero variant (fallback)
  return (
    <div className={`relative overflow-hidden rounded-2xl ring-2 ${rankStyle.border} h-[48vh] aspect-[3/4]`}>
      <img
        src={entry.url}
        alt=""
        className="w-full h-full object-cover"
      />

      <div className={`absolute top-4 left-4 w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold ${rankStyle.badge}`}>
        {entry.rank}
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
        <p className="text-2xl font-semibold truncate">{entry.user_name}</p>
        <p className="text-white/80 text-sm truncate mb-2">
          {entry.challenge_title}
        </p>
        <div className="text-yellow-400 text-3xl font-bold">
          ★ {entry.total_stars}
        </div>
      </div>
    </div>
  );
}
