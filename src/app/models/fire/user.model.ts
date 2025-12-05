import { Timestamp } from '@angular/fire/firestore';

export interface UserModel {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
  photoUrl?: string;
  phone?: string;
  joinedAt: Timestamp | null;
  updatedAt: Timestamp | null;
}
