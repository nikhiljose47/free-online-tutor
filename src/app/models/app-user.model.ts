export type UserRole = 'admin' | 'user' | 'guest' | 'teacher';

export interface AppUser {
  uid: string;
  email: string;
  role: UserRole;
}
