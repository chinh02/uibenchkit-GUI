import { useState, useEffect } from 'react';
import { fetchLeaderboardResults, LeaderboardData } from '@/lib/githubData';

interface UseGitHubDataOptions {
  repoPath?: string;
  autoFetch?: boolean;
}

interface UseGitHubDataReturn {
  data: LeaderboardData | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * React hook to fetch leaderboard data from GitHub
 * @param benchmark - Benchmark name to fetch
 * @param options - Configuration options
 */
export function useGitHubData(
  benchmark: string,
  options: UseGitHubDataOptions = {}
): UseGitHubDataReturn {
  const { repoPath, autoFetch = true } = options;
  
  const [data, setData] = useState<LeaderboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await fetchLeaderboardResults(benchmark, repoPath);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch data'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autoFetch && benchmark) {
      fetchData();
    }
  }, [benchmark, repoPath, autoFetch]);

  return {
    data,
    loading,
    error,
    refetch: fetchData
  };
}
