import { Timestamp } from '@angular/fire/firestore';
import { ClassStatus } from '../classes/class-doc.model';

export type ClassSubjectStatus = 'active' | 'paused' | 'completed' | 'archived';

export interface Batch {
  id: string;
  activeBatches: string[];
  curBatches: BatchItem[];
  upcomingBatches: BatchItem[];
}

export interface BatchItem {
  id: string;
  batch: string;
  status: ClassStatus;
  startAt: Timestamp;
}
