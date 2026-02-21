
// Deterministic
// Supports streak logic
// Supports expiry
// Supports analytics
// Supports replay
// Supports offline-first

export type PuzzleStatus = 'assigned' | 'completed' | 'expired';

export interface PuzzleSession {
  id: string;              // `${classId}_${puzzleId}`
  classId: string;
  puzzleId: string;
  assignedAt: number;      // epoch ms
  completedAt: number | null;
  status: PuzzleStatus;
  nextEligibleAt: number;  // computed scheduling gate
  meta?: Record<string, unknown>;
}


