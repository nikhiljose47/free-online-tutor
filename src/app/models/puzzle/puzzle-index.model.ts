export interface PuzzleIndex {
  version: string;
  updatedAt: string;
  files: PuzzleIndexFile[];
}

export interface PuzzleIndexFile {
  classId: string;
  subjectCode: string;
  file: string;
}