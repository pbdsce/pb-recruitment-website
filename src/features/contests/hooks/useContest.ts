import { useState, useEffect } from 'react';
import { contestApi } from '@/services/api/contestApi';
import type { Contest } from '../problem.types';

interface UseContestResult {
  contest: Contest | null;
  isLoading: boolean;
  error: string | null;
}

export const useContest = (contestId: string): UseContestResult => {
  const [contest, setContest] = useState<Contest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContest = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await contestApi.getContestById(contestId);
        setContest(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load contest');
        console.error('Error fetching contest:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (contestId) {
      fetchContest();
    }
  }, [contestId]);

  return { contest, isLoading, error };
};

