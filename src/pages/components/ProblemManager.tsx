import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { problemApi, type ProblemResponse } from "@/services/api/problemApi";
import { toast } from "react-toastify";

const ProblemManager: React.FC = () => {
  const navigate = useNavigate();
  const { contestId } = useParams<{ contestId: string }>();
  const [problems, setProblems] = useState<ProblemResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProblems = async () => {
    if (!contestId) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const data = await problemApi.getProblems(contestId);
      setProblems(data);
    } catch (err: any) {
      console.error("Error fetching problems:", err);
      setError(err.message || "Failed to load problems");
      toast.error(err.message || "Failed to load problems");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProblems();
  }, [contestId]);

  const handleAddProblem = () => {
    navigate(`/admin/contest/${contestId}/problems/add`);
  };

  const handleEdit = (problem: ProblemResponse) => {
    navigate(`/admin/contest/${contestId}/problems/add`, {
      state: { problemId: problem.id },
    });
  };

  const handleDelete = async (id: string) => {
    if (!contestId) return;
    
    if (window.confirm("Are you sure you want to delete this problem?")) {
      try {
        await problemApi.deleteProblem(contestId, id);
        toast.success("Problem deleted successfully");
        // Refresh the list
        fetchProblems();
      } catch (err: any) {
        console.error("Error deleting problem:", err);
        toast.error(err.message || "Failed to delete problem");
      }
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

      {error && (
        <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-12 bg-gray-800 rounded-lg border border-gray-700">
          <div className="flex flex-col items-center gap-3">
            <svg className="animate-spin h-8 w-8 text-green-400" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-gray-400">Loading problems...</p>
          </div>
        </div>
      ) : (
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
                      <h4 className="text-xl font-bold text-green-400">{problem.name}</h4>
                      <span className="text-sm text-green-400">{problem.score} points</span>
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
                        <span className="text-gray-300 ml-2">{problem.id?.substring(0, 8)}...</span>
                      </div>
                      {problem.type === 'code' && (
                        <>
                          <div>
                            <span className="text-gray-500">Test Cases:</span>
                            <span className="text-gray-300 ml-2">{problem.testcases?.length || 0}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Time Limit:</span>
                            <span className="text-gray-300 ml-2">{problem.time_limit}ms</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Memory Limit:</span>
                            <span className="text-gray-300 ml-2">{problem.memory_limit}MB</span>
                          </div>
                          {problem.has_custom_checker && (
                            <div>
                              <span className="text-gray-500">Custom Checker:</span>
                              <span className="text-green-400 ml-2">Yes</span>
                            </div>
                          )}
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
      )}
    </div>
  );
};

export default ProblemManager;