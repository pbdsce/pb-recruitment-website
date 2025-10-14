import { Link } from 'react-router-dom';
import type { Problem } from '../problem.types';

interface ProblemCardProps {
  problem: Problem;
  contestId: string;
}

export const ProblemCard = ({ problem, contestId }: ProblemCardProps) => {

  return (
    <Link
      to={`/contests/${contestId}/problems/${problem.id}`}
      className="block w-full p-4 border border-gray-300/30 rounded hover:bg-gray-900 bg-black"
    >
      <div className="flex items-center justify-between w-full">
        <div className="flex-1">
          <h3 className="font-medium text-white font-['DM_Sans']">{problem.name}</h3>
          <div className="text-sm text-gray-400 mt-1 font-['DM_Sans']">
            {problem.type} • {problem.score} points
          </div>
        </div>
        <div className="text-gray-500">→</div>
      </div>
    </Link>
  );
};