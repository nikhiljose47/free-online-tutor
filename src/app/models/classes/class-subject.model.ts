import { Timestamp } from '@angular/fire/firestore';

export type ClassSubjectStatus = 'active' | 'paused' | 'completed' | 'archived';

export interface ClassSubject {
  id: string;
  label: string;
  batch: Batch;
  testSeriesEnabled: boolean;
  lastUpdatedAt: Timestamp;
  resourcesCount: number;
  syllabusVersion: string;
  meta: Record<string, unknown>;
}

export interface Batch {
  id: string;
  label: string;
  curIndex: string | null;
  teacherIds: readonly string[];
  totalChapters: number;
  completedChapters: readonly string[];
  status: ClassSubjectStatus;
  startedAt: Timestamp | null;
  completedAt: Timestamp | null;
  meta: Record<string, unknown>;
}
