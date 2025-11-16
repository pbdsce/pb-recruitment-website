import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ChevronLeft, Trash2, Plus } from "lucide-react";
import Navbar from "./components/Navbar";
import Footer from "./components/footer";

interface TestCase {
  id: string;
  inputFile: File | null;
  expectedOutputFile: File | null;
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
  hasCustomChecker?: boolean;
  checkerFile?: File | null;
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
    hasCustomChecker: false,
    checkerFile: null,
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
        : { testCases: [], hasCustomChecker: false, checkerFile: null, timeLimit: 1, memoryLimit: 256 }),
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

  const handleFileChange = (testCaseId: string, field: 'inputFile' | 'expectedOutputFile', file: File | null) => {
    updateTestCase(testCaseId, field, file);
  };

  const handleCheckerFileChange = (file: File | null) => {
    setFormData((prev) => ({ ...prev, checkerFile: file }));
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
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 md:p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Basic Information Section */}
            <div>
              <h3 className="text-base font-bold text-green-400 mb-3">Basic Information</h3>
            </div>
            <div>
              <label className="block text-gray-400 mb-1.5 text-sm font-medium">Problem ID</label>
              <input
                type="text"
                name="id"
                value={formData.id}
                onChange={handleInputChange}
                disabled={!!editingProblem}
                className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-1.5 text-sm text-gray-300 focus:border-green-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                required
                placeholder="e.g., problem-1"
              />
              {editingProblem && (
                <p className="text-gray-500 text-sm mt-1">Problem ID cannot be changed</p>
              )}
            </div>

            <div>
              <label className="block text-gray-400 mb-1.5 text-sm font-medium">Problem Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={(e) => handleTypeChange(e.target.value as "code" | "mcq")}
                className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-1.5 text-sm text-gray-300 focus:border-green-500 focus:outline-none"
                required
              >
                <option value="code">Code Problem</option>
                <option value="mcq">MCQ</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-400 mb-1.5 text-sm font-medium">Problem Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-1.5 text-sm text-gray-300 focus:border-green-500 focus:outline-none"
                required
                placeholder="Enter the problem title"
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-1.5 text-sm font-medium">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={5}
                className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm text-gray-300 focus:border-green-500 focus:outline-none"
                required
                placeholder="Enter the problem description, constraints, and examples"
              />
            </div>

            {/* MCQ Options Section */}
            {formData.type === "mcq" && (
              <>
                <div className="border-t border-gray-700 pt-4 mt-1">
                  <h3 className="text-base font-bold text-green-400 mb-3">Answer Options</h3>
                </div>
                <div className="space-y-2">
                  <label className="block text-gray-400 mb-2 font-semibold">Options</label>
                  {formData.options?.map((option, index) => (
                    <div key={index}>
                      <label className="block text-gray-500 text-xs mb-1">
                        Option {index + 1}
                      </label>
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => handleOptionChange(index, e.target.value)}
                        className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-1.5 text-sm text-gray-300 focus:border-green-500 focus:outline-none"
                        required
                        placeholder={`Enter option ${index + 1}`}
                      />
                    </div>
                  ))}
                </div>
                <div>
                  <label className="block text-gray-400 mb-1.5 text-sm font-medium">Correct Answer</label>
                  <select
                    name="correctAnswer"
                    value={formData.correctAnswer}
                    onChange={handleInputChange}
                    className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-1.5 text-sm text-gray-300 focus:border-green-500 focus:outline-none"
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
                {/* Execution Limits Section */}
                <div className="border-t border-gray-700 pt-4 mt-1">
                  <h3 className="text-base font-bold text-green-400 mb-3">Execution Limits</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-400 mb-1.5 text-sm font-medium">Time Limit (seconds)</label>
                    <input
                      type="number"
                      name="timeLimit"
                      value={formData.timeLimit}
                      onChange={handleInputChange}
                      min="1"
                      step="0.1"
                      className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-1.5 text-sm text-gray-300 focus:border-green-500 focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-1.5 text-sm font-medium">Memory Limit (MB)</label>
                    <input
                      type="number"
                      name="memoryLimit"
                      value={formData.memoryLimit}
                      onChange={handleInputChange}
                      min="1"
                      className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-1.5 text-sm text-gray-300 focus:border-green-500 focus:outline-none"
                      required
                    />
                  </div>
                </div>
              </>
            )}

            {/* Scoring Section */}
            <div className="border-t border-gray-700 pt-4 mt-1">
              <h3 className="text-base font-bold text-green-400 mb-3">Scoring</h3>
            </div>
            <div>
              <label className="block text-gray-400 mb-1.5 text-sm font-medium">Points</label>
              <input
                type="number"
                name="points"
                value={formData.points}
                onChange={handleInputChange}
                min="0"
                className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-1.5 text-sm text-gray-300 focus:border-green-500 focus:outline-none"
                required
                placeholder="e.g., 100"
              />
            </div>

            {formData.type === "code" && (
              <>
                {/* Test Cases Section */}
                <div className="space-y-3 border-t border-gray-700 pt-4">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                    <div>
                      <label className="block text-base font-bold text-green-400 mb-0.5">Test Cases</label>
                      <p className="text-xs text-gray-500">
                        Upload input/output files for evaluation
                        {testCases.length > 0 && ` (${testCases.length} test case${testCases.length !== 1 ? 's' : ''})`}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={addTestCase}
                      className="flex items-center gap-1.5 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-black px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 shadow-lg hover:shadow-xl whitespace-nowrap"
                    >
                      <Plus size={16} />
                      Add Test Case
                    </button>
                  </div>

                  {/* Custom Checker Toggle */}
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="customChecker"
                      checked={formData.hasCustomChecker}
                      onChange={(e) => setFormData(prev => ({ ...prev, hasCustomChecker: e.target.checked }))}
                      className="w-4 h-4 bg-gray-700 border-gray-600 rounded focus:ring-green-500 focus:ring-2 cursor-pointer
                        checked:bg-green-600 checked:border-green-600"
                    />
                    <label htmlFor="customChecker" className="text-sm text-gray-300 cursor-pointer">
                      Use custom checker for this problem
                    </label>
                  </div>

                  {/* Checker File Upload */}
                  {formData.hasCustomChecker && (
                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                        Checker Program <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="file"
                        onChange={(e) => handleCheckerFileChange(e.target.files?.[0] || null)}
                        className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1.5 text-gray-300 text-xs
                          file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold 
                          file:bg-green-600 file:text-black hover:file:bg-green-700
                          focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
                          cursor-pointer transition-all"
                      />
                      {formData.checkerFile && (
                        <p className="text-xs text-gray-400 mt-1">{formData.checkerFile.name}</p>
                      )}
                    </div>
                  )}

                  {testCases.length === 0 ? (
                    <div className="text-center py-8 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border-2 border-dashed border-gray-700 hover:border-gray-600 transition-colors">
                      <div className="flex flex-col items-center gap-2">
                        <div className="bg-gray-700 p-3 rounded-full">
                          <Plus size={24} className="text-gray-500" />
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm font-medium">No test cases added yet</p>
                          <p className="text-gray-600 text-xs">Click "Add Test Case" to create your first test case</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {testCases.map((testCase, index) => (
                        <div 
                          key={testCase.id} 
                          className="bg-gradient-to-br from-gray-800 to-gray-850 border border-gray-700 rounded-lg p-3 hover:border-green-600 transition-all duration-200 shadow-md"
                        >
                          {/* Header */}
                          <div className="flex justify-between items-center mb-3 pb-2 border-b border-gray-700">
                            <div className="flex items-center gap-2">
                              <div className="bg-green-600 text-black font-bold text-xs px-2 py-0.5 rounded">
                                #{index + 1}
                              </div>
                              <h4 className="text-sm font-semibold text-gray-200">Test Case {index + 1}</h4>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeTestCase(testCase.id)}
                              className="text-red-400 hover:text-red-300 hover:bg-red-950 p-1.5 rounded transition-all duration-200"
                              title="Remove test case"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>

                          {/* Content */}
                          <div className="space-y-2.5">
                            {/* Input File */}
                            <div className="space-y-1.5">
                              <label className="block text-xs font-semibold text-gray-300">
                                Input File <span className="text-red-400">*</span>
                              </label>
                              <div className="relative">
                                <input
                                  type="file"
                                  onChange={(e) => handleFileChange(testCase.id, 'inputFile', e.target.files?.[0] || null)}
                                  className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1.5 text-gray-300 text-xs
                                    file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold 
                                    file:bg-gradient-to-r file:from-green-600 file:to-green-500 file:text-black 
                                    hover:file:from-green-700 hover:file:to-green-600
                                    focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
                                    cursor-pointer transition-all"
                                />
                              </div>
                              {testCase.inputFile && (
                                <div className="flex items-center gap-2 text-xs text-green-400 bg-green-950 px-3 py-1.5 rounded-md border border-green-800">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                  <span className="font-medium truncate">{testCase.inputFile.name}</span>
                                </div>
                              )}
                            </div>

                            {/* Expected Output or Checker Status */}
                            {formData.hasCustomChecker ? (
                              <p className="text-xs text-gray-400">Judged by custom checker</p>
                            ) : (
                              <div className="space-y-1.5">
                                <label className="block text-xs font-semibold text-gray-300">
                                  Expected Output File <span className="text-red-400">*</span>
                                </label>
                                <p className="text-xs text-gray-500 mb-1.5">
                                  The exact output expected for the corresponding input file
                                </p>
                                <div className="relative">
                                  <input
                                    type="file"
                                    onChange={(e) => handleFileChange(testCase.id, 'expectedOutputFile', e.target.files?.[0] || null)}
                                    className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1.5 text-gray-300 text-xs
                                      file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold 
                                      file:bg-gradient-to-r file:from-blue-600 file:to-blue-500 file:text-white 
                                      hover:file:from-blue-700 hover:file:to-blue-600
                                      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                      cursor-pointer transition-all"
                                  />
                                </div>
                                {testCase.expectedOutputFile && (
                                  <div className="flex items-center gap-2 text-xs text-blue-400 bg-blue-950 px-3 py-1.5 rounded-md border border-blue-800 mt-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="font-medium truncate">{testCase.expectedOutputFile.name}</span>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-3">
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-black px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200"
              >
                {editingProblem ? "Update Problem" : "Create Problem"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 border border-gray-700"
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
