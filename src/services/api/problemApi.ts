import axios, { type AxiosInstance, type AxiosError } from 'axios';
import { auth } from '@/lib/firebase';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

// Backend API types (matching Go backend schema)
export interface TestCaseInput {
  id?: number;
  input: string; // base64 encoded
  expected_output: string; // base64 encoded
}

export interface UpsertProblemRequest {
  name: string;
  description: string;
  score: number;
  type: 'code' | 'mcq';
  answer?: string[]; // For MCQ problems
  has_multiple_answers?: boolean;
  checker?: string; // base64 encoded checker file
  testcases?: TestCaseInput[];
  time_limit?: number; // in milliseconds
  memory_limit?: number; // in MB
}

export interface ProblemResponse {
  id: string; // UUID
  contest_id?: string;
  name: string;
  description: string;
  score: number;
  type: 'code' | 'mcq';
  answer?: string[];
  has_multiple_answers?: boolean;
  has_custom_checker?: boolean;
  time_limit?: number;
  memory_limit?: number;
  testcases?: Array<{
    id: number;
    input_url: string;
    expected_output_url: string;
  }>;
  checker_url?: string;
}

class ProblemApiService {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      // Increase request size limit for file uploads (50MB)
      maxContentLength: 50 * 1024 * 1024,
      maxBodyLength: 50 * 1024 * 1024,
    });

    // Add auth token interceptor
    this.axiosInstance.interceptors.request.use(
      async (config) => {
        const user = auth.currentUser;
        if (user && config.headers) {
          try {
            const token = await user.getIdToken();
            if (token) {
              config.headers.Authorization = `Bearer ${token}`;
            }
          } catch (error) {
            console.error('Error getting auth token:', error);
          }
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
  }

  /**
   * Create a new problem for a contest
   */
  async createProblem(
    contestId: string,
    problemData: UpsertProblemRequest
  ): Promise<ProblemResponse> {
    try {
      const response = await this.axiosInstance.post<ProblemResponse>(
        `/admin/${contestId}/problem`,
        problemData
      );
      return response.data;
    } catch (error) {
      this.handleError(error as AxiosError, 'Failed to create problem');
      throw error;
    }
  }

  /**
   * Update an existing problem
   */
  async updateProblem(
    contestId: string,
    problemId: string,
    problemData: UpsertProblemRequest
  ): Promise<ProblemResponse> {
    try {
      const response = await this.axiosInstance.put<ProblemResponse>(
        `/admin/${contestId}/${problemId}`,
        problemData
      );
      return response.data;
    } catch (error) {
      this.handleError(error as AxiosError, 'Failed to update problem');
      throw error;
    }
  }

  /**
   * Delete a problem
   */
  async deleteProblem(contestId: string, problemId: string): Promise<void> {
    try {
      await this.axiosInstance.delete(`/admin/${contestId}/${problemId}`);
    } catch (error) {
      this.handleError(error as AxiosError, 'Failed to delete problem');
      throw error;
    }
  }

  /**
   * Get all problems for a contest
   */
  async getProblems(contestId: string): Promise<ProblemResponse[]> {
    try {
      const response = await this.axiosInstance.get<ProblemResponse[]>(
        `/admin/${contestId}/problems`
      );
      return response.data;
    } catch (error) {
      this.handleError(error as AxiosError, 'Failed to fetch problems');
      throw error;
    }
  }

  /**
   * Get a single problem by ID
   */
  async getProblem(contestId: string, problemId: string): Promise<ProblemResponse> {
    try {
      const response = await this.axiosInstance.get<ProblemResponse>(
        `/admin/${contestId}/${problemId}`
      );
      return response.data;
    } catch (error) {
      this.handleError(error as AxiosError, 'Failed to fetch problem');
      throw error;
    }
  }

  private handleError(error: AxiosError, defaultMessage: string): void {
    if (error.response) {
      const message = (error.response.data as { error?: string })?.error || defaultMessage;
      console.error(`API Error: ${message}`, error.response.data);
      throw new Error(message);
    } else if (error.request) {
      console.error('Network Error: No response received', error.request);
      throw new Error('Network error. Please check your connection.');
    } else {
      console.error('Error:', error.message);
      throw new Error(defaultMessage);
    }
  }
}

export const problemApi = new ProblemApiService();
