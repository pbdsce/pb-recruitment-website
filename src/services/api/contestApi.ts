import type { Problem, LeaderboardEntry, Contest } from '@/features/contests/problem.types';
import { auth } from '@/lib/firebase';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

class ContestApiService {
  private async getAuthToken(): Promise<string | null> {
    const user = auth.currentUser;
    if (user) {
      return await user.getIdToken();
    }
    return null;
  }

  private async fetchWithError(url: string, options?: RequestInit): Promise<Response> {
    const token = await this.getAuthToken();
    const headers: Record<string, string> = {
      ...(options?.headers as Record<string, string>),
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(url, {
      ...options,
      headers,
    });
    
    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`API Error: ${response.status} - ${errorMessage}`);
    }
    
    return response;
  }

  async getContestsList(page: number = 0): Promise<Contest[]> {
    const response = await this.fetchWithError(
      `${API_BASE_URL}/contests/list?page=${page}`
    );
    return response.json();
  }

  async getContestProblems(contestId: string): Promise<Problem[]> {
    const response = await this.fetchWithError(
      `${API_BASE_URL}/contests/${contestId}/problems`
    );
    return response.json();
  }

  async getProblemById(contestId: string, problemId: string): Promise<Problem> {
    const response = await this.fetchWithError(
      `${API_BASE_URL}/contests/${contestId}/problems/${problemId}`
    );
    return response.json();
  }

  async getContestLeaderboard(contestId: string): Promise<LeaderboardEntry[]> {
    const response = await this.fetchWithError(
      `${API_BASE_URL}/contests/${contestId}/leaderboard`
    );
    return response.json();
  }

  async getContestById(contestId: string): Promise<Contest> {
    const response = await this.fetchWithError(
      `${API_BASE_URL}/contests/${contestId}`
    );
    return response.json();
  }

  async submitCodeSolution(
    contestId: string,
    problemId: string,
    code: string,
    language: string
  ): Promise<SubmissionResponse> {
    const encodedCode = btoa(unescape(encodeURIComponent(code)));
    const response = await this.fetchWithError(
      `${API_BASE_URL}/submission/submit`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contest_id: contestId,
          problem_id: problemId,
          code: encodedCode,
          language,
          type: 'code',
        }),
      }
    );
    return response.json();
  }

  async submitMCQAnswer(
    contestId: string,
    problemId: string,
    selectedOption: number
  ): Promise<SubmissionResponse> {
    const response = await this.fetchWithError(
      `${API_BASE_URL}/submission/submit`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contest_id: contestId,
          problem_id: problemId,
          option: [selectedOption],
          type: 'mcq',
        }),
      }
    );
    return response.json();
  }

  async getSubmissionStatus(submissionId: string): Promise<SubmissionStatusResponse> {
    const response = await this.fetchWithError(
      `${API_BASE_URL}/submission/${submissionId}/status`
    );
    return response.json();
  }

  async getSubmissionDetails(submissionId: string): Promise<SubmissionDetailsResponse> {
    const response = await this.fetchWithError(
      `${API_BASE_URL}/submission/${submissionId}/details`
    );
    return response.json();
  }

  async listUserSubmissions(problemId: string, page: number = 0): Promise<SubmissionDetailsResponse[]> {
    const response = await this.fetchWithError(
      `${API_BASE_URL}/submission/list?problem_id=${problemId}&page=${page}`
    );
    const data = await response.json();
    return data.submissions || [];
  }

  async registerForContest(contestId: string): Promise<void> {
    await this.fetchWithError(
      `${API_BASE_URL}/contests/${contestId}/registration`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'register',
        }),
      }
    );
  }

  async unregisterFromContest(contestId: string): Promise<void> {
    await this.fetchWithError(
      `${API_BASE_URL}/contests/${contestId}/registration`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'unregister',
        }),
      }
    );
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

export const contestApi = new ContestApiService();