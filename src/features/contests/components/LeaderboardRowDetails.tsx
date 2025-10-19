import type { ProblemScore } from '../problem.types';
import { formatTimestamp } from '@/lib/utils';

interface LeaderboardRowDetailsProps {
  problemScores: ProblemScore[];
}

export const LeaderboardRowDetails = ({ problemScores }: LeaderboardRowDetailsProps) => {
  return (
    <div className="space-y-4">
      <h4 className="text-sm font-['DM_Sans'] text-gray-400 mb-4">PROBLEM BREAKDOWN</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {problemScores.map((problemScore) => {
          const isSolved = problemScore.score > 0;
          const scorePercentage = (problemScore.score / problemScore.max_score) * 100;

          return (
            <div
              key={problemScore.problem_id}
              className="bg-gray-900 border border-gray-700 p-4"
            >
              <div className="flex items-start justify-between mb-3">
                <h5 className="text-sm font-['DM_Sans'] text-white flex-1">
                  {problemScore.problem_name}
                </h5>
                {isSolved ? (
                  <span className="ml-2 text-green-400">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                ) : (
                  <span className="ml-2 text-gray-500">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400 font-['DM_Sans']">SCORE:</span>
                  <span className="font-['DM_Sans'] text-white">
                    {problemScore.score} / {problemScore.max_score}
                  </span>
                </div>

                <div className="w-full bg-gray-800 h-1">
                  <div
                    className={`h-1 transition-all ${
                      scorePercentage === 100
                        ? 'bg-green-400'
                        : scorePercentage > 0
                        ? 'bg-yellow-400'
                        : 'bg-gray-600'
                    }`}
                    style={{ width: `${scorePercentage}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500 font-['DM_Sans']">
                  <span>ATTEMPTS: {problemScore.attempts}</span>
                  {problemScore.solved_at && (
                    <span>{formatTimestamp(problemScore.solved_at)}</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};