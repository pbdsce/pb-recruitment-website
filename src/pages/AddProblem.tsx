import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ChevronLeft, Trash2, Plus } from "lucide-react";
import Navbar from "./components/Navbar";
import Footer from "./components/footer";

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
  options?: string[];
  correctAnswer?: number;
  testCases?: TestCase[];
  timeLimit?: number;
  memoryLimit?: number;
}

const AddProblem: React.FC = () => {
  const { contestId } = useParams<{ contestId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const editingProblem = location.state?.problem as Problem | null;

  const [formData, setFormData] = useState<Problem>({
    id: "",
    title: "",
    description: "",
    points: 100,
    type: "code",
    options: ["", "", "", ""],
    correctAnswer: 0,
    testCases: [],
    timeLimit: 1,
    memoryLimit: 256,
  });

  const [testCases, setTestCases] = useState<TestCase[]>([]);

  useEffect(() => {
    if (editingProblem) {
      setFormData(editingProblem);
      if (editingProblem.testCases) {
        setTestCases(editingProblem.testCases);
      }
    }
  }, [editingProblem]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "points" || name === "timeLimit" || name === "memoryLimit" || name === "correctAnswer"
        ? parseInt(value)
        : value,
    }));
  };

  const handleOptionChange = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      options: prev.options?.map((opt, i) => (i === index ? value : opt)) || ["", "", "", ""],
    }));
  };

  const handleTypeChange = (type: "code" | "mcq") => {
    setFormData((prev) => ({
      ...prev,
      type,
      ...(type === "mcq"
        ? { options: ["", "", "", ""], correctAnswer: 0 }
        : { testCases: [], timeLimit: 1, memoryLimit: 256 }),
    }));
    if (type === "code") {
      setTestCases([]);
    }
  };

  const addTestCase = () => {
    const newTestCase: TestCase = {
      id: `tc-${Date.now()}`,
      inputFile: null,
      expectedOutputFile: null,
      checkerFile: null,
      hasMultipleOutputs: false,
    };
    setTestCases([...testCases, newTestCase]);
  };

  const removeTestCase = (id: string) => {
    setTestCases(testCases.filter(tc => tc.id !== id));
  };

  const updateTestCase = (id: string, field: keyof TestCase, value: any) => {
    setTestCases(testCases.map(tc => 
      tc.id === id ? { ...tc, [field]: value } : tc
    ));
  };

  const handleFileChange = (testCaseId: string, field: 'inputFile' | 'expectedOutputFile' | 'checkerFile', file: File | null) => {
    updateTestCase(testCaseId, field, file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Attach test cases to form data
    const submissionData = {
      ...formData,
      testCases: formData.type === "code" ? testCases : undefined,
    };
    // Navigate back with the problem data
    navigate(`/admin/contest/${contestId}/problems`, {
      state: { problem: submissionData, isEdit: !!editingProblem },
    });
  };

  const handleCancel = () => {
    navigate(`/admin/contest/${contestId}/problems`);
  };

  return (
    <div className="bg-black text-gray-300 min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-grow container mx-auto px-4 py-8">
        {/* Back button */}
        <button
          onClick={handleCancel}
          className="flex items-center gap-2 text-gray-400 hover:text-green-400 mb-6 transition-colors"
        >
          <ChevronLeft size={20} />
          Back to Problems
        </button>

        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-green-400 mb-2">
            {editingProblem ? "Edit Problem" : "Add New Problem"}
          </h1>
          <p className="text-gray-400">
            Contest ID: <span className="text-green-400">{contestId}</span>
          </p>
        </div>

        {/* Form */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-400 mb-2 font-semibold">Problem ID</label>
              <input
                type="text"
                name="id"
                value={formData.id}
                onChange={handleInputChange}
                disabled={!!editingProblem}
                className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 text-gray-300 focus:border-green-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                required
                placeholder="e.g., problem-1"
              />
              {editingProblem && (
                <p className="text-gray-500 text-sm mt-1">Problem ID cannot be changed</p>
              )}
            </div>

            <div>
              <label className="block text-gray-400 mb-2 font-semibold">Problem Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={(e) => handleTypeChange(e.target.value as "code" | "mcq")}
                className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 text-gray-300 focus:border-green-500 focus:outline-none"
                required
              >
                <option value="code">Code Problem</option>
                <option value="mcq">MCQ</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-400 mb-2 font-semibold">Problem Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 text-gray-300 focus:border-green-500 focus:outline-none"
                required
                placeholder="Enter the problem title"
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-2 font-semibold">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={8}
                className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 text-gray-300 focus:border-green-500 focus:outline-none"
                required
                placeholder="Enter the problem description, constraints, and examples"
              />
            </div>

            {formData.type === "mcq" && (
              <>
                <div className="space-y-3">
                  <label className="block text-gray-400 mb-2 font-semibold">Options</label>
                  {formData.options?.map((option, index) => (
                    <div key={index}>
                      <label className="block text-gray-500 text-sm mb-1">
                        Option {index + 1}
                      </label>
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => handleOptionChange(index, e.target.value)}
                        className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 text-gray-300 focus:border-green-500 focus:outline-none"
                        required
                        placeholder={`Enter option ${index + 1}`}
                      />
                    </div>
                  ))}
                </div>
                <div>
                  <label className="block text-gray-400 mb-2 font-semibold">Correct Answer</label>
                  <select
                    name="correctAnswer"
                    value={formData.correctAnswer}
                    onChange={handleInputChange}
                    className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 text-gray-300 focus:border-green-500 focus:outline-none"
                    required
                  >
                    <option value={0}>Option 1</option>
                    <option value={1}>Option 2</option>
                    <option value={2}>Option 3</option>
                    <option value={3}>Option 4</option>
                  </select>
                </div>
              </>
            )}

            {formData.type === "code" && (
              <>
                {/* Test Cases Section */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="block text-gray-400 font-semibold">Test Cases</label>
                    <button
                      type="button"
                      onClick={addTestCase}
                      className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-black px-4 py-2 rounded-lg font-semibold transition-all duration-200"
                    >
                      <Plus size={16} />
                      Add Test Case
                    </button>
                  </div>

                  {testCases.length === 0 ? (
                    <div className="text-center py-8 bg-gray-800 rounded-lg border border-gray-700">
                      <p className="text-gray-500">No test cases added yet. Click "Add Test Case" to get started.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {testCases.map((testCase, index) => (
                        <div key={testCase.id} className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-4">
                            <h4 className="text-lg font-semibold text-green-400">Test Case {index + 1}</h4>
                            <button
                              type="button"
                              onClick={() => removeTestCase(testCase.id)}
                              className="text-red-400 hover:text-red-300 transition-colors"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Input File */}
                            <div>
                              <label className="block text-gray-400 mb-2 text-sm">Input File</label>
                              <input
                                type="file"
                                onChange={(e) => handleFileChange(testCase.id, 'inputFile', e.target.files?.[0] || null)}
                                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-gray-300 text-sm file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-green-600 file:text-black hover:file:bg-green-700"
                              />
                              {testCase.inputFile && (
                                <p className="text-xs text-gray-500 mt-1">{testCase.inputFile.name}</p>
                              )}
                            </div>

                            {/* Has Multiple Outputs Toggle */}
                            <div>
                              <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={testCase.hasMultipleOutputs}
                                  onChange={(e) => updateTestCase(testCase.id, 'hasMultipleOutputs', e.target.checked)}
                                  className="w-4 h-4 bg-gray-700 border-gray-600 rounded focus:ring-green-500 focus:ring-2"
                                />
                                <span className="text-gray-400 text-sm">Has multiple outputs?</span>
                              </label>
                            </div>
                          </div>

                          <div className="mt-4">
                            {testCase.hasMultipleOutputs ? (
                              /* Checker File */
                              <div>
                                <label className="block text-gray-400 mb-2 text-sm">Checker File</label>
                                <input
                                  type="file"
                                  onChange={(e) => handleFileChange(testCase.id, 'checkerFile', e.target.files?.[0] || null)}
                                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-gray-300 text-sm file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-green-600 file:text-black hover:file:bg-green-700"
                                />
                                {testCase.checkerFile && (
                                  <p className="text-xs text-gray-500 mt-1">{testCase.checkerFile.name}</p>
                                )}
                              </div>
                            ) : (
                              /* Expected Output File */
                              <div>
                                <label className="block text-gray-400 mb-2 text-sm">Expected Output File</label>
                                <input
                                  type="file"
                                  onChange={(e) => handleFileChange(testCase.id, 'expectedOutputFile', e.target.files?.[0] || null)}
                                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-gray-300 text-sm file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-green-600 file:text-black hover:file:bg-green-700"
                                />
                                {testCase.expectedOutputFile && (
                                  <p className="text-xs text-gray-500 mt-1">{testCase.expectedOutputFile.name}</p>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 mb-2 font-semibold">Time Limit (seconds)</label>
                    <input
                      type="number"
                      name="timeLimit"
                      value={formData.timeLimit}
                      onChange={handleInputChange}
                      min="1"
                      step="0.1"
                      className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 text-gray-300 focus:border-green-500 focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-2 font-semibold">Memory Limit (MB)</label>
                    <input
                      type="number"
                      name="memoryLimit"
                      value={formData.memoryLimit}
                      onChange={handleInputChange}
                      min="1"
                      className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 text-gray-300 focus:border-green-500 focus:outline-none"
                      required
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-gray-400 mb-2 font-semibold">Points</label>
              <input
                type="number"
                name="points"
                value={formData.points}
                onChange={handleInputChange}
                min="0"
                className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 text-gray-300 focus:border-green-500 focus:outline-none"
                required
                placeholder="e.g., 100"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-black px-6 py-3 rounded-lg font-semibold transition-all duration-200"
              >
                {editingProblem ? "Update Problem" : "Create Problem"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 px-6 py-3 rounded-lg font-semibold transition-all duration-200 border border-gray-700"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AddProblem;
