import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ChevronLeft, Trash2, Plus } from "lucide-react";
import Navbar from "./components/Navbar";
import Footer from "./components/footer";
import { problemApi } from "@/services/api/problemApi";
import { fileToBase64 } from "@/lib/utils";
import { toast } from "react-toastify";

interface TestCase {
  id: string;
  inputFile: File | null;
  expectedOutputFile: File | null;
}

interface Problem {
  id?: string; // UUID for editing
  name: string; // Changed from title
  description: string;
  score: number; // Changed from points
  type: "code" | "mcq";
  options?: string[];
  answer?: number[]; // Changed from correctAnswer to array
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
  const problemIdFromState = location.state?.problemId as string | undefined;

  const [formData, setFormData] = useState<Problem>({
    name: "",
    description: "",
    score: 100,
    type: "code",
    options: ["", "", "", ""],
    answer: [0], // Array for MCQ answers
    testCases: [],
    hasCustomChecker: false,
    checkerFile: null,
    timeLimit: 1000,
    memoryLimit: 256,
  });

  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditing = !!problemIdFromState;

  useEffect(() => {
    const fetchProblemDetails = async () => {
      if (!problemIdFromState || !contestId) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const problemData = await problemApi.getProblem(contestId, problemIdFromState);
        
        setFormData({
          id: problemData.id,
          name: problemData.name || "",
          description: problemData.description || "",
          score: problemData.score || 100,
          type: problemData.type || "code",
          options: problemData.answer || ["", "", "", ""],
          answer: [0], // Default to first option, can't determine from backend
          hasCustomChecker: problemData.has_custom_checker || false,
          checkerFile: null,
          timeLimit: problemData.time_limit || 1000,
          memoryLimit: problemData.memory_limit || 256,
        });
        
        // Handle test cases - convert from backend format
        if (problemData.testcases && problemData.testcases.length > 0) {
          const mappedTestCases: TestCase[] = problemData.testcases.map((tc) => ({
            id: `tc-${tc.id}`,
            inputFile: null, // Files can't be restored from URLs
            expectedOutputFile: null,
          }));
          setTestCases(mappedTestCases);
        }
      } catch (err: any) {
        console.error("Error fetching problem details:", err);
        setError(err.message || "Failed to load problem details");
        toast.error(err.message || "Failed to load problem details");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProblemDetails();
  }, [problemIdFromState, contestId]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "score" || name === "timeLimit" || name === "memoryLimit"
        ? parseInt(value)
        : value,
    }));
  };

  const handleAnswerChange = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      answer: [index], // Store as array with single value
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
        ? { options: ["", "", "", ""], answer: [0] }
        : { testCases: [], hasCustomChecker: false, checkerFile: null, timeLimit: 1000, memoryLimit: 256 }),
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Validate required fields
      if (!formData.name || !formData.description) {
        throw new Error("Please fill in all required fields");
      }

      if (formData.type === "code") {
        // Validate test cases for code problems
        if (testCases.length === 0) {
          throw new Error("Please add at least one test case");
        }

        // For new problems, validate files are uploaded
        // For editing, only validate if files are being changed
        if (!isEditing) {
          for (let i = 0; i < testCases.length; i++) {
            if (!testCases[i].inputFile) {
              throw new Error(`Test case ${i + 1} is missing input file`);
            }
            if (!formData.hasCustomChecker && !testCases[i].expectedOutputFile) {
              throw new Error(`Test case ${i + 1} is missing expected output file`);
            }
          }

          // Validate custom checker file if enabled
          if (formData.hasCustomChecker && !formData.checkerFile) {
            throw new Error("Please upload a checker file");
          }
        }
      }

      // Convert test case files to base64 (only if files are present)
      const testcasesData = await Promise.all(
        testCases.map(async (tc) => {
          // Only include testcase data if files are present (for new/updated test cases)
          if (!tc.inputFile && !tc.expectedOutputFile) {
            return null; // Skip this test case if no files (editing mode)
          }
          const input = tc.inputFile ? await fileToBase64(tc.inputFile) : "";
          const expectedOutput = tc.expectedOutputFile ? await fileToBase64(tc.expectedOutputFile) : "";
          return {
            input,
            expected_output: expectedOutput,
          };
        })
      );

      // Filter out null entries (test cases without files during edit)
      const filteredTestcases = testcasesData.filter((tc): tc is { input: string; expected_output: string } => tc !== null);

      // Convert checker file to base64 if present
      let checkerBase64: string | undefined;
      if (formData.checkerFile) {
        checkerBase64 = await fileToBase64(formData.checkerFile);
      }

      // Prepare API request data
      const apiData = {
        name: formData.name,
        description: formData.description,
        score: formData.score,
        type: formData.type,
        ...(formData.type === "mcq" && {
          answer: formData.options || [],
          has_multiple_answers: false,
        }),
        ...(formData.type === "code" && {
          ...(filteredTestcases.length > 0 && { testcases: filteredTestcases }),
          time_limit: formData.timeLimit,
          memory_limit: formData.memoryLimit,
          ...(checkerBase64 && { checker: checkerBase64 }),
        }),
      };

      // Call API to create or update problem
      if (isEditing && formData.id) {
        await problemApi.updateProblem(contestId!, formData.id, apiData);
        toast.success("Problem updated successfully!");
      } else {
        await problemApi.createProblem(contestId!, apiData);
        toast.success("Problem created successfully!");
      }

      // Navigate back to problems list
      navigate(`/admin/contest/${contestId}/problems`);
    } catch (err: any) {
      console.error("Error submitting problem:", err);
      setError(err.message || "Failed to save problem. Please try again.");
      toast.error(err.message || "Failed to save problem");
    } finally {
      setIsSubmitting(false);
    }
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
            {isEditing ? "Edit Problem" : "Add New Problem"}
          </h1>
          <p className="text-gray-400">
            Contest ID: <span className="text-green-400">{contestId}</span>
          </p>
          {error && (
            <div className="mt-3 bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded">
              {error}
            </div>
          )}
        </div>

        {/* Form */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 md:p-6">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="flex flex-col items-center gap-3">
                <svg className="animate-spin h-8 w-8 text-green-400" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="text-gray-400">Loading problem details...</p>
              </div>
            </div>
          ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Basic Information Section */}
            <div>
              <h3 className="text-base font-bold text-green-400 mb-3">Basic Information</h3>
            </div>
            {isEditing && (
              <div>
                <label className="block text-gray-400 mb-1.5 text-sm font-medium">Problem ID</label>
                <input
                  type="text"
                  value={formData.id?.toString() || ""}
                  disabled
                  className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-1.5 text-sm text-gray-300 focus:border-green-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <p className="text-gray-500 text-sm mt-1">Problem ID is auto-generated and cannot be changed</p>
              </div>
            )}

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
              <label className="block text-gray-400 mb-1.5 text-sm font-medium">Problem Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-1.5 text-sm text-gray-300 focus:border-green-500 focus:outline-none"
                required
                placeholder="Enter the problem name"
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
                    value={formData.answer?.[0] ?? 0}
                    onChange={(e) => handleAnswerChange(parseInt(e.target.value))}
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
                    <label className="block text-gray-400 mb-1.5 text-sm font-medium">Time Limit (milliseconds)</label>
                    <input
                      type="number"
                      name="timeLimit"
                      value={formData.timeLimit}
                      onChange={handleInputChange}
                      min="1"
                      step="1"
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
              <label className="block text-gray-400 mb-1.5 text-sm font-medium">Score</label>
              <input
                type="number"
                name="score"
                value={formData.score}
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
                disabled={isSubmitting}
                className="flex-1 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-black px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {isEditing ? "Updating..." : "Creating..."}
                  </span>
                ) : (
                  <>{isEditing ? "Update Problem" : "Create Problem"}</>
                )}
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
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AddProblem;
