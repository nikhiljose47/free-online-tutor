import { Timestamp } from '@angular/fire/firestore';

export type ClassSubjectStatus = 'active' | 'paused' | 'completed' | 'archived';

export interface ClassSubject {
  id: string;
  label: string;
  batch: string;
  curIndex: string | null;
  teacherIds: Array<string>;
  totalChapters: number;
  completedChapters: Array<string>;
  status: ClassSubjectStatus;
  testSeriesEnabled: boolean;
  lastUpdatedAt: Timestamp;
  resourcesCount: number;
  syllabusVersion: string;
}
