import { Timestamp } from '@angular/fire/firestore';

export type ClassStatus = 'active' | 'paused' | 'completed' | 'archived' | 'idle';

export interface ClassMeta {
  [key: string]: unknown;
}

export interface ClassDoc {
  academicYear: string;
  board: string[];
  completionPercent: number;
  enrollmentOpen: boolean;
  languages: string[];
  lastContentSyncAt: Timestamp;
  maxStudents: number;
  meta: ClassMeta;
  nextClassAt: Timestamp;
  status: ClassStatus;
  studentCount: number;
  title: string;
}
