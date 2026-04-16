export type LearnStepType = 'content' | 'question';

export interface LearnStep {
  id: number;
  type: LearnStepType;
  title: string;
  body: string;
}

export interface LearnProgress {
  steps: LearnStep[];
  currentIndex: number;
  score: number;
}

export interface EvaluateResult {
  correct: boolean;
  feedback: string;
  scoreDelta: number;
}