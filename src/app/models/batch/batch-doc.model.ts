import { Timestamp } from '@firebase/firestore';
import { CatalogGroup } from '../syllabus/syllabus-index.model';
import { ClassStatus } from '../classes/class-doc.model';

export interface BatchDoc {
  id: string;
  label: string;
  desc: string;
  status: ClassStatus;
  group: CatalogGroup;
  classId: string | null;
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
