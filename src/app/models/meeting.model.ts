import { Timestamp } from '@angular/fire/firestore';

export interface Meeting {
  id: string;
  classId: string;
  className?: string;
  subjectId: string;
  subjectName?: string;
  batchId: string;
  meetLink: string;
  chapterCode: string;
  chapterName?: string;
  status: string;
  date: Timestamp;
  teacherId: string;
  teacherName: string;
  duration: number;
  imageSrc: string;
  attendance: string[];
  createdAt: Timestamp;
  endAt: Timestamp;
}
