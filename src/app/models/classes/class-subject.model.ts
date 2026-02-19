import { Timestamp } from '@angular/fire/firestore';
import { ClassSubjectStatus } from '../batch/batch.model';

export interface ClassSubject {
  id: string;
  label: string;
  curIndex: string | null;
  totalChapters: number;
  completedChapters: readonly string[];
  status: ClassSubjectStatus;
  startedAt: Timestamp | null;
  completedAt: Timestamp | null;
  testSeriesEnabled: boolean;
  lastUpdatedAt: Timestamp;
  resourcesCount: number;
  meta: Record<string, unknown>;
}
