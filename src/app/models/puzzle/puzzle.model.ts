export interface PuzzleRoot {
  classId: string;
  className: string;
  board: string;
  version: number;
  generatedAt: string;
  status: 'active' | 'inactive';
  subjects: Subject[];
}

export interface Subject {
  subjectId: string;
  subjectName: string;
  chapters: Chapter[];
}

export interface Chapter {
  chapterId: string;
  chapterName: string;
  chapterOrder?: number;
  difficultyWeight: number;
  puzzles: Puzzle[];
}

export interface Puzzle {
  id: string;
  level: number;
  question: string;
  options: string[];
  correctIndex: number;
  difficulty: 'easy' | 'medium' | 'hard';
  marks: number;
  estimatedTimeSec: number;
  unlockAfterChapter?: number;
  active: boolean;
}