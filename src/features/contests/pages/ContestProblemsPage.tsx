import { useParams } from 'react-router-dom';
import { useContestProblems } from '../hooks/useContestProblems';
import { ProblemList } from '../components/ProblemList';

export const ContestProblemsPage = () => {
  const { contestId } = useParams<{ contestId: string }>();

  const {
    problems,
    isLoading,
    error,
  } = useContestProblems(contestId || '');

  if (!contestId) {
    return (
      <div className="px-6 py-6">
        <div className="text-red-400">Invalid contest ID</div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="px-6 py-6">
        <div className="text-center py-8 text-gray-400">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-6 py-6">
        <div className="text-red-400">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="px-6 py-6">
      <ProblemList problems={problems} contestId={contestId} />
    </div>
  );
};