import { useState, useEffect } from 'react';
import type { Problem } from '../problem.types';
import { contestApi } from '@/services/api/contestApi';

export const useContestProblems = (contestId: string) => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await contestApi.getContestProblems(contestId);
        setProblems(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch problems');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProblems();
  }, [contestId]);

  return {
    problems,
    isLoading,
    error,
  };
};