import { motion } from 'framer-motion';
import { Trophy, Star } from 'lucide-react';
import type { BeamerEntry } from './types';

interface RankingsProps {
  entries: BeamerEntry[];
  className?: string;
  limit?: number;
}

export function Rankings({ entries, className = '', limit = 5 }: RankingsProps) {
  const topEntries = entries.slice(0, limit);

  if (topEntries.length === 0) {
    return (
      <div className={`flex flex-col items-center justify-center bg-wyt-bg-card rounded-lg p-6 ${className}`}>
        <Trophy className="w-12 h-12 text-wyt-text-muted mb-3" />
        <p className="text-wyt-text-muted text-sm">Keine Votes vorhanden</p>
      </div>
    );
  }

  return (
    <div className={`bg-wyt-bg-card rounded-lg p-6 flex flex-col ${className}`}>
      <div className="flex items-center gap-2 mb-4 flex-shrink-0">
        <Trophy className="w-6 h-6 text-wyt-accent" />
        <h3 className="text-xl font-bold text-wyt-text">Top {limit}</h3>
      </div>

      <div className="space-y-3 overflow-y-auto scrollbar-hide flex-1">
        {topEntries.map((entry, index) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center gap-4 bg-wyt-bg-light rounded-lg p-3 hover:bg-wyt-bg transition-colors"
          >
            {/* Rank Badge */}
            <div
              className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                entry.rank === 1
                  ? 'bg-yellow-500/20 text-yellow-500'
                  : entry.rank === 2
                  ? 'bg-gray-400/20 text-gray-400'
                  : entry.rank === 3
                  ? 'bg-orange-600/20 text-orange-600'
                  : 'bg-wyt-accent/20 text-wyt-accent'
              }`}
            >
              {entry.rank}
            </div>

            {/* User Info */}
            <div className="flex-1 min-w-0">
              <p className="text-base font-semibold text-wyt-text truncate">
                {entry.user_name}
              </p>
              <p className="text-xs text-wyt-text-muted truncate">
                {entry.challenge_title}
              </p>
            </div>

            {/* Stars */}
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
              <span className="text-xl font-bold text-wyt-text tabular-nums">
                {entry.total_stars}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
