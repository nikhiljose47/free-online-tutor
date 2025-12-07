export type UserRole = 'admin' | 'user' | 'guest' | 'teacher';

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  createdAt?: number;
}
