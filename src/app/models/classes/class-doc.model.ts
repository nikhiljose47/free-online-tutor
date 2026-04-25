import { Timestamp } from '@angular/fire/firestore';

export type ClassStatus = 'active' | 'paused' | 'completed' | 'archived' | 'idle';

export type ClassMeta = Record<string, unknown>;


export interface ClassDoc {
  batch: string;
  batchId: string;
  classId: string;
  title: string;
  academicYear: string;
  board: string[];
  completionPercent: number;
  enrollmentOpen: boolean;
  languages: string[];
  lastContentSyncAt: Timestamp;
  maxStudents: number;
  meta: ClassMeta;
  curClassId: string;
  nextClassAt: Timestamp;
  status: ClassStatus;
  studentCount: number;
  teacherIds: string[];
  syllabusVersion: string;
}
