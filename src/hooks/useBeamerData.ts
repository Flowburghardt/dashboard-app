import { useState, useEffect, useRef, useCallback } from 'react';
import type { BeamerData, RecentImage } from '../components/beamer/types';

// Default to localhost, but allow override via env var
const API_BASE = import.meta.env.VITE_FOTO_CHALLENGE_API || 'http://localhost:3000/api';
// Backend base for image URLs (without /api suffix)
const BACKEND_BASE = API_BASE.replace('/api', '');

export function useBeamerData(pollInterval = 5000) {
  const [data, setData] = useState<BeamerData | null>(null);
  const [recentImages, setRecentImages] = useState<RecentImage[]>([]);
  const [previousData, setPreviousData] = useState<BeamerData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(true);
  const failedAttempts = useRef(0);

  const fetchData = useCallback(async () => {
    try {
      // Fetch leaderboard data
      const leaderboardResponse = await fetch(`${API_BASE}/votes/leaderboard/beamer`);
      if (!leaderboardResponse.ok) {
        throw new Error('Failed to fetch leaderboard data');
      }
      const newData: BeamerData = await leaderboardResponse.json();

      // Convert relative image URLs to absolute URLs
      newData.overall = newData.overall.map((entry) => ({
        ...entry,
        url: entry.url.startsWith('http') ? entry.url : BACKEND_BASE + entry.url,
        user_profile_image: entry.user_profile_image?.startsWith('http')
          ? entry.user_profile_image
          : entry.user_profile_image
            ? BACKEND_BASE + entry.user_profile_image
            : null,
      }));

      // Convert category image URLs too
      if (newData.categories) {
        newData.categories = newData.categories.map((category) => ({
          ...category,
          top5: category.top5.map((entry) => ({
            ...entry,
            url: entry.url.startsWith('http') ? entry.url : BACKEND_BASE + entry.url,
            user_profile_image: entry.user_profile_image?.startsWith('http')
              ? entry.user_profile_image
              : entry.user_profile_image
                ? BACKEND_BASE + entry.user_profile_image
                : null,
          })),
        }));
      }

      // Extract recent images from leaderboard (top 4 entries)
      const recent: RecentImage[] = newData.overall.slice(0, 4).map((entry) => ({
        id: entry.id,
        url: entry.url, // Already absolute from above conversion
        user_name: entry.user_name,
        category_name: entry.category_name || entry.challenge_title,
        uploaded_at: new Date().toISOString(), // We don't have timestamp, use current
      }));
      setRecentImages(recent);

      setPreviousData(data);
      setData(newData);
      setError(null);
      setIsConnected(true);
      failedAttempts.current = 0;
    } catch (err) {
      failedAttempts.current++;

      if (failedAttempts.current >= 3) {
        setIsConnected(false);
      }

      setError(err instanceof Error ? err.message : 'Verbindungsfehler');
    } finally {
      setIsLoading(false);
    }
  }, [data]);

  useEffect(() => {
    fetchData();

    const timer = setInterval(fetchData, pollInterval);

    return () => clearInterval(timer);
  }, [fetchData, pollInterval]);

  // Check if there were ranking changes
  const hasChanges = useCallback(() => {
    if (!data || !previousData) return false;

    // Compare overall rankings
    const currentIds = data.overall.map(e => e.id).join(',');
    const previousIds = previousData.overall.map(e => e.id).join(',');

    return currentIds !== previousIds;
  }, [data, previousData]);

  return {
    data,
    recentImages,
    previousData,
    isLoading,
    error,
    isConnected,
    hasChanges: hasChanges(),
    refetch: fetchData,
  };
}
