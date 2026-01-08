import { useState, useEffect, useRef, useCallback } from 'react';
import type { BeamerData, RecentImage } from '../components/beamer/types';

// Default to localhost, but allow override via env var
const API_BASE = import.meta.env.VITE_FOTO_CHALLENGE_API || 'http://localhost:3000/api';
// Backend base for image URLs (without /api suffix)
const BACKEND_BASE = API_BASE.replace('/api', '');

export function useBeamerData(pollInterval = 5000, imageLimit = 20) {
  const [data, setData] = useState<BeamerData | null>(null);
  const [recentImages, setRecentImages] = useState<RecentImage[]>([]);
  const [previousData, setPreviousData] = useState<BeamerData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(true);
  const [newImageIds, setNewImageIds] = useState<Set<number>>(new Set());
  const failedAttempts = useRef(0);
  const previousImageIds = useRef<Set<number>>(new Set());

  const fetchData = useCallback(async () => {
    try {
      // Fetch leaderboard data AND recent images in parallel
      const [leaderboardResponse, recentImagesResponse] = await Promise.all([
        fetch(`${API_BASE}/votes/leaderboard/beamer`),
        fetch(`${API_BASE}/images/recent?limit=${imageLimit}`)
      ]);

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

      // Handle recent images from new endpoint
      if (recentImagesResponse.ok) {
        const recentData = await recentImagesResponse.json();
        const recent: RecentImage[] = recentData.map((img: RecentImage) => ({
          id: img.id,
          url: img.url.startsWith('http') ? img.url : BACKEND_BASE + img.url,
          user_name: img.user_name,
          category_name: img.category_name,
          uploaded_at: img.uploaded_at,
        }));

        // Detect new images (IDs that weren't in the previous fetch)
        const currentIds = new Set(recent.map(img => img.id));
        const newIds = new Set<number>();
        for (const id of currentIds) {
          if (!previousImageIds.current.has(id)) {
            newIds.add(id);
          }
        }

        // Update previous IDs for next comparison (only after first load)
        if (previousImageIds.current.size > 0) {
          setNewImageIds(newIds);
        }
        previousImageIds.current = currentIds;

        setRecentImages(recent);
      } else {
        // Fallback: if new endpoint fails, clear recent images
        console.warn('Failed to fetch recent images, using empty array');
        setRecentImages([]);
      }

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
  }, [data, imageLimit]);

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

  // Clear new image IDs (call after animation is done)
  const clearNewImages = useCallback(() => {
    setNewImageIds(new Set());
  }, []);

  return {
    data,
    recentImages,
    previousData,
    isLoading,
    error,
    isConnected,
    hasChanges: hasChanges(),
    newImageIds,
    clearNewImages,
    refetch: fetchData,
  };
}
