import React, { useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";

interface TestCase {
  id: string;
  inputFile: File | null;
  expectedOutputFile: File | null;
  checkerFile: File | null;
  hasMultipleOutputs: boolean;
}

interface Problem {
  id: string;
  title: string;
  description: string;
  points: number;
  type: "code" | "mcq";
  // MCQ specific fields
  options?: string[];
  correctAnswer?: number;
  // Code problem specific fields
  testCases?: TestCase[];
  timeLimit?: number; 
  memoryLimit?: number; 
}

interface ProblemManagerProps {
  problems: Problem[];
  setProblems: (problems: Problem[]) => void;
}

const ProblemManager: React.FC<ProblemManagerProps> = ({ problems, setProblems }) => {
  const navigate = useNavigate();
  const { contestId } = useParams<{ contestId: string }>();
  const location = useLocation();

  useEffect(() => {
    // Handle returning from add/edit page with new problem data
    if (location.state?.problem) {
      const { problem, isEdit } = location.state;
      if (isEdit) {
        setProblems(problems.map((p) => (p.id === problem.id ? problem : p)));
      } else {
        setProblems([...problems, problem]);
      }
      // Clear the state
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state]);

  const handleAddProblem = () => {
    navigate(`/admin/contest/${contestId}/problems/add`);
  };

  const handleEdit = (problem: Problem) => {
    navigate(`/admin/contest/${contestId}/problems/add`, {
      state: { problem },
    });
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this problem?")) {
      setProblems(problems.filter((p) => p.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end mb-4">
        <button
          onClick={handleAddProblem}
          className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-black px-6 py-3 rounded-lg font-semibold transition-all duration-200"
        >
          + Add Problem
        </button>
      </div>

      <div className="grid gap-4">
        {problems.length === 0 ? (
          <div className="text-center py-12 bg-gray-800 rounded-lg border border-gray-700">
            <p className="text-gray-400">No problems created for this contest yet.</p>
          </div>
        ) : (
          problems.map((problem) => (
            <div
              key={problem.id}
              className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-green-500 transition-all duration-200"
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                <div className="flex-grow min-w-0">
                  <div className="flex items-center gap-4 mb-2">
                    <h4 className="text-xl font-bold text-green-400">{problem.title}</h4>
                    <span className="text-sm text-green-400">{problem.points} points</span>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      problem.type === 'code' 
                        ? 'bg-blue-900 text-blue-300 border border-blue-700' 
                        : 'bg-purple-900 text-purple-300 border border-purple-700'
                    }`}>
                      {problem.type === 'code' ? 'CODE' : 'MCQ'}
                    </span>
                  </div>
                  <p className="text-gray-400 mb-4 line-clamp-2">{problem.description}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Problem ID:</span>
                      <span className="text-gray-300 ml-2">{problem.id}</span>
                    </div>
                    {problem.type === 'code' && (
                      <>
                        <div>
                          <span className="text-gray-500">Test Cases:</span>
                          <span className="text-gray-300 ml-2">{problem.testCases?.length || 0}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Time Limit:</span>
                          <span className="text-gray-300 ml-2">{problem.timeLimit}s</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Memory Limit:</span>
                          <span className="text-gray-300 ml-2">{problem.memoryLimit}MB</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-2 md:ml-4 w-full md:w-auto mt-2 md:mt-0">
                  <button
                    onClick={() => handleEdit(problem)}
                    className="w-full bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition-colors font-semibold"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(problem.id)}
                    className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors font-semibold"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProblemManager;