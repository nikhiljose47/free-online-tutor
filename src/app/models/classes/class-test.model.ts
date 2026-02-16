import { Timestamp } from '@angular/fire/firestore';

export type TestStatus = 'draft' | 'scheduled' | 'live' | 'completed' | 'cancelled';

export interface ClassTest {
  testId: string;
  classId: string;

  title: string;
  subjectCode: string;

  maxMarks: number;
  passMarks: number;

  scheduledAt: Timestamp | null;
  startedAt: Timestamp | null;
  endedAt: Timestamp | null;

  status: TestStatus;

  attemptCount: number;
  submissionCount: number;
  evaluatedCount: number;

  createdAt: Timestamp;
  updatedAt: Timestamp;

  meta: Record<string, unknown>;
}
