import { Timestamp } from '@firebase/firestore';
import { ClassStatus } from '../classes/class-doc.model';

export interface BatchDoc {
  id: string;
  label: string;
  desc: string;
  status: ClassStatus;
  group: string;
  classId: string | null;
  curClassId: string;
  curChapterId: string;
  subjectIndex: SubIndex[];
  capacity: number;
  enrolledCount: number;
  isEnrollmentOpen: boolean;
  isRecurring: boolean;
  startAt: Timestamp;
  endAt: Timestamp;
}

export interface SubIndex {
  subjectId: string;
  curIndex: string;
}
