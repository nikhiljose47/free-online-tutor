import { Timestamp } from '@angular/fire/firestore';

export interface UserModel {
  uid: string;
  name: string;
  email: string;
  age: number | null;
  role: UserRole;
  photoUrl: string | null;
  phone: string | null;
  abilities: Array<string> | null;
  skills: Array<string> | null;
  expList: Array<string> | null;
  expYrs: number;
  subjects: Array<String> | null;
  bio: string | null;
  rating: number;
  specialization: Array<string> | null;
  meta: Record<string, undefined>;

  joinedAt: number | null;
  updatedAt: Timestamp | null;
}

export type UserRole = 'admin' | 'user' | 'guest' | 'teacher';
