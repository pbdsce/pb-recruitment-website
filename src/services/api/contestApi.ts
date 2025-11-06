import type { Problem, LeaderboardEntry, Contest } from '@/features/contests/problem.types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

class ContestApiService {
  private async fetchWithError(url: string, options?: RequestInit): Promise<Response> {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`API Error: ${response.status} - ${errorMessage}`);
    }
    
    return response;
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
    const response = await this.fetchWithError(
      `${API_BASE_URL}/contests/${contestId}/problems/${problemId}/submit`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          language,
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
      `${API_BASE_URL}/contests/${contestId}/problems/${problemId}/submit`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          answer: selectedOption,
        }),
      }
    );
    return response.json();
  }
}

export interface SubmissionResponse {
  success: boolean;
  message?: string;
  score?: number;
  total_score?: number;
  test_cases_passed?: number;
  total_test_cases?: number;
}

export const contestApi = new ContestApiService();