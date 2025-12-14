import { Timestamp } from '@angular/fire/firestore';

export interface Meeting {
  id: string;
  classId: string;
  subjectId: string;
  batchId: string;
  meetLink: string;
  chapterCode: string;
  status: string;
  date: Timestamp;
  teacherId: string;
  teacherName: string;
  duration: number;
  attendance: string[];
  createdAt: Timestamp;
  endAt: Timestamp;
}
