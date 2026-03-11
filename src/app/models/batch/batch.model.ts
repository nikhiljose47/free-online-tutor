import { Timestamp } from '@angular/fire/firestore';
import { ClassStatus } from '../classes/class-doc.model';


// the prev implemenation of batch as collection

export type ClassSubjectStatus = 'active' | 'paused' | 'completed' | 'archived' | 'idle';

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
  group: string;
  classId: string | null;
  capacity: number;
  enrolledCount: number;
  isEnrollmentOpen: boolean;
  isRecurring: boolean;
  startAt: Timestamp;
  endAt: Timestamp;
}
