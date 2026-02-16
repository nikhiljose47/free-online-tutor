import { Timestamp } from '@angular/fire/firestore';

export type AssignmentStatus = 'draft' | 'published' | 'closed' | 'archived';

export interface ClassAssignment {
  assignmentId: string;
  classId: string;
  subjectCode: string;

  title: string;
  description: string;
  attachments: string[];

  maxMarks: number | null;

  dueAt: Timestamp | null;
  closedAt: Timestamp | null;

  status: AssignmentStatus;

  submissionCount: number;
  evaluatedCount: number;

  createdBy: string;

  createdAt: Timestamp;
  updatedAt: Timestamp;
  publishedAt: Timestamp | null;

  meta: Record<string, unknown>;
}
