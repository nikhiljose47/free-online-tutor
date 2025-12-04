import { Timestamp } from '@angular/fire/firestore';

export interface Meeting {
  classId: string;
  subjectId: string;
  batchId: string;
  date: Timestamp;
  status: string;
  chapterCode: string;
}
