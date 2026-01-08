import { motion } from 'framer-motion';
import { useLeaderboardData } from '../../hooks/useLeaderboardData';
import { HeroLeaderboard } from './HeroLeaderboard';

interface LeaderboardViewProps {
  apiUrl: string;
  className?: string;
}

export function LeaderboardView({ apiUrl, className = '' }: LeaderboardViewProps) {
  const { data, isLoading, error, isConnected } = useLeaderboardData(apiUrl);

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center bg-wyt-bg-card rounded-lg ${className}`}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-wyt-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-wyt-text-muted text-lg">Lade Leaderboard...</p>
        </motion.div>
      </div>
    );
  }

  if (error || !isConnected) {
    return (
      <div className={`flex items-center justify-center bg-wyt-bg-card rounded-lg ${className}`}>
        <div className="text-center">
          <p className="text-2xl text-red-400 mb-2">Verbindungsfehler</p>
          <p className="text-wyt-text-muted">{error || 'Keine Verbindung zum Server'}</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className={`flex items-center justify-center bg-wyt-bg-card rounded-lg ${className}`}>
        <p className="text-wyt-text-muted text-lg">Keine Daten verfügbar</p>
      </div>
    );
  }

  return (
    <div className={`bg-wyt-bg-card rounded-lg overflow-hidden flex flex-col ${className}`}>
      <HeroLeaderboard entries={data.overall} />
    </div>
  );
}
