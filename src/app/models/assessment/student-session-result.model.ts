import { Timestamp } from '@angular/fire/firestore';
import { SessionType } from '../session/session-type.model';

export type TestType = 'weekly' | 'chapter' | 'monthly' | 'mock' | 'final' | 'daily';

export interface StudentSessionResult {
  studentUid: string;
  studentId: string | null;
  sessionId: string;

  subjectId: string;
  chapterCode: string;
  divisionCode: string;

  sessionType: SessionType;
  testType?: TestType;

  assignmentMarks: number;
  maxMarks: number;

  engagementScore: number;
  remarks: string;

  createdAt: Timestamp;
  updatedAt?: Timestamp;
}
