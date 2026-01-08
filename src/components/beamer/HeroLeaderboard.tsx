import { LeaderCard } from './LeaderCard';
import type { BeamerEntry } from './types';

interface HeroLeaderboardProps {
  entries: BeamerEntry[];
}

export function HeroLeaderboard({ entries }: HeroLeaderboardProps) {
  if (entries.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-3xl text-wyt-text-muted">Noch keine Bewertungen</p>
      </div>
    );
  }

  const top3 = entries.slice(0, 3);
  const runnerUps = entries.slice(3, 8);

  // Reorder for podium display: [2nd, 1st, 3rd]
  const podiumOrder = top3.length >= 3
    ? [top3[1], top3[0], top3[2]]
    : top3;

  return (
    <div className="flex-1 flex flex-col justify-center px-8">
      {/* Podium - Top 3 */}
      <div className="flex items-end justify-center gap-6 mb-8">
        {podiumOrder.map((entry, index) => {
          const isFirst = entry.rank === 1;
          return (
            <div
              key={entry.id}
              className={isFirst ? 'z-10' : ''}
              style={{ order: index }}
            >
              <LeaderCard entry={entry} variant="podium" />
            </div>
          );
        })}
      </div>

      {/* Runner-ups #4-#8 */}
      {runnerUps.length > 0 && (
        <div className="flex justify-center gap-3">
          {runnerUps.map((entry) => (
            <div key={entry.id}>
              <LeaderCard entry={entry} variant="runner-up" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
