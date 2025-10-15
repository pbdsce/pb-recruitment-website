export type ProblemType = 'Code' | 'MCQ';

export interface Problem {
  id: string;
  contest_id: string;
  name: string;
  score: number;
  type: ProblemType;
  answer?: number[];
}

export interface ProblemFilters {
  type: ProblemType | 'All';
  sortBy: 'score' | 'name';
  sortOrder: 'asc' | 'desc';
}