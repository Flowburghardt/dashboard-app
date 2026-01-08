import { useState, useEffect, useCallback } from 'react';
import type { BeamerData } from '../components/beamer/types';

export function useLeaderboardData(apiUrl: string, pollInterval = 5000) {
  const [data, setData] = useState<BeamerData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(true);

  // Derive backend base from API URL for image URL conversion
  const backendBase = apiUrl.replace('/api', '');

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch(`${apiUrl}/votes/leaderboard/beamer`);

      if (!response.ok) {
        throw new Error('Failed to fetch leaderboard data');
      }

      const newData: BeamerData = await response.json();

      // Convert relative image URLs to absolute URLs
      newData.overall = newData.overall.map((entry) => ({
        ...entry,
        url: entry.url.startsWith('http') ? entry.url : backendBase + entry.url,
        user_profile_image: entry.user_profile_image?.startsWith('http')
          ? entry.user_profile_image
          : entry.user_profile_image
            ? backendBase + entry.user_profile_image
            : null,
      }));

      // Convert category image URLs too
      if (newData.categories) {
        newData.categories = newData.categories.map((category) => ({
          ...category,
          top5: category.top5.map((entry) => ({
            ...entry,
            url: entry.url.startsWith('http') ? entry.url : backendBase + entry.url,
            user_profile_image: entry.user_profile_image?.startsWith('http')
              ? entry.user_profile_image
              : entry.user_profile_image
                ? backendBase + entry.user_profile_image
                : null,
          })),
        }));
      }

      setData(newData);
      setError(null);
      setIsConnected(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verbindungsfehler');
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  }, [apiUrl, backendBase]);

  useEffect(() => {
    fetchData();
    const timer = setInterval(fetchData, pollInterval);
    return () => clearInterval(timer);
  }, [fetchData, pollInterval]);

  return {
    data,
    isLoading,
    error,
    isConnected,
    refetch: fetchData,
  };
}
