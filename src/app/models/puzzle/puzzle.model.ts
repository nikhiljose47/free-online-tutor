export interface PuzzleCollection {
  classId: string;
  subjectCode: string;
  puzzles: Puzzle[];
}

export interface Puzzle {
  id: string;

  chapterCode: string;
  divisionCode: string;

  type: PuzzleType;
  difficulty: DifficultyLevel;

  question: string;

  options?: string[];
  answer: string | string[];
  explanation?: string;

  points: number;

  tags?: string[];

  meta: PuzzleMeta;

  assets?: PuzzleAsset[];
}

// ---------- TYPES ----------

export type PuzzleType = 'mcq' | 'fill' | 'match' | 'code' | 'image' | 'case';

export type DifficultyLevel = 'easy' | 'medium';

// ---------- META ----------

export interface PuzzleMeta {
  timeSec: number;
  attemptLimit?: number;
  negativeMarks?: number;

  unlockCondition?: UnlockCondition;
}

export interface UnlockCondition {
  minPoints?: number;
  requiredPuzzleIds?: string[];
}

// ---------- ASSETS ----------

export interface PuzzleAsset {
  id: string;
  type: 'image' | 'code' | 'diagram';
  src: string;
  meta?: Record<string, unknown>;
}
