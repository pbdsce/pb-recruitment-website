import { useState, useEffect, useMemo } from 'react';
import type { LeaderboardEntry, Contest } from '../problem.types';
import { contestApi } from '@/services/api/contestApi';

export const useLeaderboard = (contestId: string) => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [contest, setContest] = useState<Contest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUserId] = useState('current-user');

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const [leaderboardData, contestData] = await Promise.all([
          contestApi.getContestLeaderboard(contestId),
          contestApi.getContestById(contestId),
        ]);
        setLeaderboard(leaderboardData);
        setContest(contestData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch leaderboard');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, [contestId]);


  const currentUserRank = useMemo(() => {
    return leaderboard.find((entry) => entry.user_id === currentUserId);
  }, [leaderboard, currentUserId]);

  return {
    leaderboard,
    contest,
    currentUserRank,
    isLoading,
    error,
    totalParticipants: leaderboard.length,
  };
};