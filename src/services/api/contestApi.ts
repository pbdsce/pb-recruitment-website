import type { Problem } from '@/features/contests/problem.types';

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
}

export const contestApi = new ContestApiService();