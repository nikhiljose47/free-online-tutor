import { Timestamp } from '@angular/fire/firestore';

export interface UserModel {
  uid: string;
  name: string;
  email: string;
  age: number | null;
  role: UserRole;
  avatarId: string;
  photoUrl: string | null;
  phone: string | null;
  enrolledClassIds: string[];
  abilities: Array<string> | null;
  skills: Array<string> | null;
  expList: Array<string> | null;
  expYrs: number | null;
  totalPoints: number;
  seasonPoints: number;
  seasonId: string;
  subjects: Array<String> | null;
  bio: string | null;
  weekPerformance: string;
  rating: number;
  specialization: Array<string> | null;
  lastSession: string | null;
  meta: Record<string, undefined>;

  joinedAt: number | null;
  updatedAt: Timestamp | null;
}

export type UserRole = 'admin' | 'student' | 'guest' | 'teacher';
