import axios, { type AxiosInstance, type AxiosError } from 'axios';
import type { Problem, LeaderboardEntry, Contest } from '@/features/contests/problem.types';
import { auth } from '@/lib/firebase';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

class ContestApiService {
  private axiosInstance: AxiosInstance;
  constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });
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

    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response) {
          const { status, data, headers } = error.response;
          let errorMessage: string;
          if (typeof data === 'string') {
            errorMessage = data;
          } else if (data && typeof data === 'object' && 'message' in data) {
            errorMessage = String(data.message);
          } else if (data && typeof data === 'object') {
            errorMessage = JSON.stringify(data);
          } else {
            errorMessage = error.message || 'Unknown error';
          }

          const headersPlain: Record<string, string> = {};
          if (headers) {
            try {
              if (typeof headers === 'object' && headers !== null) {
                Object.keys(headers).forEach((key) => {
                  try {
                    const value = (headers as Record<string, unknown>)[key];
                    if (value !== undefined && value !== null) {
                      headersPlain[key] = Array.isArray(value) ? value.join(', ') : String(value);
                    }
                  } catch {
                  }
                });
              }
            } catch {
            }
          }

          return Promise.reject({
            status,
            data,
            headers: headersPlain,
            message: errorMessage,
          });
        }

        if (error.request) {
          return Promise.reject({
            status: 0,
            message: 'Network error: No response from server',
          });
        }

        return Promise.reject({
          status: 0,
          message: `Request error: ${error.message}`,
        });
      }
    );
  }

  async getContestsList(page: number = 0): Promise<Contest[]> {
    const response = await this.axiosInstance.get<Contest[]>(`/contests/list?page=${page}`);
    return response.data;
  }

  async getContestProblems(contestId: string): Promise<Problem[]> {
    const response = await this.axiosInstance.get<Problem[]>(`/contests/${contestId}/problems`);
    return response.data;
  }

  async getProblemById(contestId: string, problemId: string): Promise<Problem> {
    const response = await this.axiosInstance.get<Problem>(`/contests/${contestId}/problems/${problemId}`);
    return response.data;
  }

  async getContestLeaderboard(contestId: string): Promise<LeaderboardEntry[]> {
    const response = await this.axiosInstance.get<LeaderboardEntry[]>(`/contests/${contestId}/leaderboard`);
    return response.data;
  }

  async getContestById(contestId: string): Promise<Contest> {
    const response = await this.axiosInstance.get<Contest>(`/contests/${contestId}`);
    return response.data;
  }

  async submitCodeSolution(
    contestId: string,
    problemId: string,
    code: string,
    language: string
  ): Promise<SubmissionResponse> {
    const encodedCode = btoa(unescape(encodeURIComponent(code)));
    const response = await this.axiosInstance.post<SubmissionResponse>('/submission/submit', {
      contest_id: contestId,
      problem_id: problemId,
      code: encodedCode,
      language,
      type: 'code',
    });
    return response.data;
  }

  async submitMCQAnswer(
    contestId: string,
    problemId: string,
    selectedOption: number
  ): Promise<SubmissionResponse> {
    const response = await this.axiosInstance.post<SubmissionResponse>('/submission/submit', {
      contest_id: contestId,
      problem_id: problemId,
      option: [selectedOption],
      type: 'mcq',
    });
    return response.data;
  }

  async getSubmissionStatus(submissionId: string): Promise<SubmissionStatusResponse> {
    const response = await this.axiosInstance.get<SubmissionStatusResponse>(`/submission/${submissionId}/status`);
    return response.data;
  }

  async getSubmissionDetails(submissionId: string): Promise<SubmissionDetailsResponse> {
    const response = await this.axiosInstance.get<SubmissionDetailsResponse>(`/submission/${submissionId}/details`);
    return response.data;
  }

  async listUserSubmissions(problemId: string, page: number = 0): Promise<SubmissionDetailsResponse[]> {
    const response = await this.axiosInstance.get<{ submissions: SubmissionDetailsResponse[] }>(
      `/submission/list?problem_id=${problemId}&page=${page}`
    );
    return response.data.submissions || [];
  }

  async registerForContest(contestId: string): Promise<void> {
    await this.axiosInstance.post(`/contests/${contestId}/registration`, {
      action: 'register',
    });
  }

  async unregisterFromContest(contestId: string): Promise<void> {
    await this.axiosInstance.post(`/contests/${contestId}/registration`, {
      action: 'unregister',
    });
  }
}

export interface SubmissionResponse {
  submission_id: string;
}

export interface SubmissionStatusResponse {
  submission_id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  score?: number;
  max_score?: number;
  test_cases_passed?: number;
  total_test_cases?: number;
  error_message?: string;
}

export interface SubmissionDetailsResponse {
  submission_id: string;
  problem_id: string;
  contest_id: string;
  status: string;
  score: number;
  max_score: number;
  language?: string;
  submitted_at: number;
  test_case_results?: TestCaseResult[];
}

export interface TestCaseResult {
  test_case_id: string;
  status: 'passed' | 'failed' | 'error';
  runtime?: number;
  memory?: number;
  error_message?: string;
}
export interface ApiError {
  status: number;
  data?: unknown;
  headers?: Record<string, string>;
  message: string;
}

export const contestApi = new ContestApiService();