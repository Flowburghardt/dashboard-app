export interface BeamerEntry {
  rank: number;
  id: number;
  user_id: number;
  user_name: string;
  user_profile_image: string | null;
  challenge_title: string;
  category_name?: string;
  total_stars: number;
  vote_count: number;
  url: string;
}

export interface BeamerCategory {
  id: number;
  name: string;
  slug: string;
  top5: BeamerEntry[];
}

export interface BeamerData {
  overall: BeamerEntry[];
  categories: BeamerCategory[];
  lastUpdate: string;
}

export interface RecentImage {
  id: number;
  url: string;
  user_name: string;
  category_name: string;
  uploaded_at: string;
}

export type BeamerMode = 'hero' | 'grid' | 'ticker' | 'live' | 'visualizer' | 'camera' | 'slideshow' | 'leaderboard';

export interface DashboardSettings {
  cameraUrl: string;
  countdownEndTime: string | null;
  countdownLabel?: string;
  slideshowUrl: string;
  leaderboardUrl: string;
  fotoChallengeApiUrl: string;
}
