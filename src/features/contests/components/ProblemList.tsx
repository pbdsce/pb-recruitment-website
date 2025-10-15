import type { Problem } from '../problem.types';
import { ProblemAccordion } from './ProblemAccordion';

interface ProblemListProps {
  problems: Problem[];
  contestId: string;
}

export const ProblemList = ({ problems, contestId }: ProblemListProps) => {
  return <ProblemAccordion problems={problems} contestId={contestId} />;
};