import { Timestamp } from '@angular/fire/firestore';
import { ClassStatus } from '../classes/class-doc.model';
import { CatalogGroup } from '../syllabus/syllabus-index.model';

export type ClassSubjectStatus = 'active' | 'paused' | 'completed' | 'archived';

export interface Batch {
  id: string;
  activeBatches: string[];
  prevBatches: BatchItem[];
  curBatches: BatchItem[];
  upcomingBatches: BatchItem[];
}

export interface BatchItem {
  id: string;
  label: string;
  desc: string;
  status: ClassStatus;
  group: CatalogGroup;
  classId: string | null;
  capacity: number;
  enrolledCount: number;
  isEnrollmentOpen: boolean;
  isRecurring: boolean;
  startAt: Timestamp;
  endAt: Timestamp;
}
