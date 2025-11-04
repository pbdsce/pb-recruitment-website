import React, { useState } from "react";

interface Problem {
  id: string;
  title: string;
  description: string;
  points: number;
}

interface ProblemManagerProps {
  contestId: string;
  problems: Problem[];
  setProblems: (problems: Problem[]) => void;
}

const ProblemManager: React.FC<ProblemManagerProps> = ({ contestId, problems, setProblems }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProblem, setEditingProblem] = useState<Problem | null>(null);
  const [formData, setFormData] = useState<Problem>({
    id: "",
    title: "",
    description: "",
    points: 100,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "points" ? parseInt(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProblem) {
      setProblems(problems.map((p) => (p.id === editingProblem.id ? formData : p)));
    } else {
      setProblems([...problems, formData]);
    }
    resetForm();
  };

  const handleEdit = (problem: Problem) => {
    setEditingProblem(problem);
    setFormData(problem);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this problem?")) {
      setProblems(problems.filter((p) => p.id !== id));
    }
  };

  const resetForm = () => {
    setFormData({
      id: "",
      title: "",
      description: "",
      points: 100,
    });
    setEditingProblem(null);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
        <div>
          <h3 className="text-gray-400 mt-1">Contest ID: <span className="text-green-400">{contestId}</span></h3>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full sm:w-auto bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-black px-6 py-3 rounded-lg font-semibold transition-all duration-200"
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
                  </div>
                  <p className="text-gray-400 mb-4 line-clamp-2">{problem.description}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Problem ID:</span>
                      <span className="text-gray-300 ml-2">{problem.id}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2 md:ml-4 w-full md:w-auto mt-2 md:mt-0">
                  <button
                    onClick={() => handleEdit(problem)}
                    className="w-full bg-green-600 hover:bg-green-700 text-black px-4 py-2 rounded transition-colors font-semibold"
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

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg p-4 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-green-500">
            <h3 className="text-2xl font-bold text-green-400 mb-6">
              {editingProblem ? "Edit Problem" : "Create New Problem"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-400 mb-2">Problem ID</label>
                <input
                  type="text"
                  name="id"
                  value={formData.id}
                  onChange={handleInputChange}
                  disabled={!!editingProblem}
                  className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 text-gray-300 focus:border-green-500 focus:outline-none disabled:opacity-50"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-2">Problem Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 text-gray-300 focus:border-green-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={6}
                  className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 text-gray-300 focus:border-green-500 focus:outline-none"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 mb-2">Points</label>
                  <input
                    type="number"
                    name="points"
                    value={formData.points}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 text-gray-300 focus:border-green-500 focus:outline-none"
                    required
                  />
                </div>
              </div>
              <div className="flex space-x-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-black px-6 py-3 rounded-lg font-semibold transition-all duration-200"
                >
                  {editingProblem ? "Update Problem" : "Create Problem"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 px-6 py-3 rounded-lg font-semibold transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProblemManager;