import { useParams } from 'react-router-dom';
import { useContestProblems } from '../hooks/useContestProblems';
import { ProblemList } from '../components/ProblemList';
import { ContestHeader } from '../components/ContestHeader';

export const ContestProblemsPage = () => {
  const { contestId } = useParams<{ contestId: string }>();

  if (!contestId) {
    return (
      <div className="w-full bg-black min-h-screen">
        <ContestHeader contestName="Contest Problems" />
        <div className="px-6 py-6">
          <div className="text-red-400">Invalid contest ID</div>
        </div>
      </div>
    );
  }

  const {
    problems,
    isLoading,
    error,
  } = useContestProblems(contestId);

  if (isLoading) {
    return (
      <div className="w-full bg-black min-h-screen">
        <ContestHeader contestName="Contest Problems" />
        <div className="px-6 py-6">
          <div className="text-center py-8 text-gray-400">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full bg-black min-h-screen">
        <ContestHeader contestName="Contest Problems" />
        <div className="px-6 py-6">
          <div className="text-red-400">Error: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-black min-h-screen">
      <ContestHeader contestName="Contest Problems" />
      <div className="px-6 py-6">
        <ProblemList problems={problems} contestId={contestId} />
      </div>
    </div>
  );
};