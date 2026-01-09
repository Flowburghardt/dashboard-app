import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLeaderboardData } from '../../hooks/useLeaderboardData';
import { HeroLeaderboard } from './HeroLeaderboard';
import { CategoryGridView } from './CategoryGridView';

type LeaderboardSubView = 'hero' | 'grid';

interface LeaderboardViewProps {
  apiUrl: string;
  className?: string;
}

export function LeaderboardView({ apiUrl, className = '' }: LeaderboardViewProps) {
  const { data, isLoading, error, isConnected } = useLeaderboardData(apiUrl);
  const [subView, setSubView] = useState<LeaderboardSubView>('hero');

  // Keyboard handler for Shift+2 (Grid View toggle)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.shiftKey && e.code === 'Digit2') {
        setSubView(prev => prev === 'grid' ? 'hero' : 'grid');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
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
      <div className={`flex items-center justify-center ${className}`}>
        <div className="text-center">
          <p className="text-2xl text-red-400 mb-2">Verbindungsfehler</p>
          <p className="text-wyt-text-muted">{error || 'Keine Verbindung zum Server'}</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <p className="text-wyt-text-muted text-lg">Keine Daten verfügbar</p>
      </div>
    );
  }

  return (
    <div className={`overflow-hidden flex flex-col ${className}`}>
      {subView === 'grid' && data.categories ? (
        <CategoryGridView categories={data.categories} overall={data.overall} />
      ) : (
        <HeroLeaderboard entries={data.overall} />
      )}
    </div>
  );
}
