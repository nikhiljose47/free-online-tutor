import { Timestamp } from '@angular/fire/firestore';

export interface Jam {
  chapterCode: string;
  title: string;
  meetLink: string;
  status: string;
  date: Timestamp;
}
