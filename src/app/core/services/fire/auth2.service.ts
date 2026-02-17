import { Injectable, signal } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from '@angular/fire/auth';

export interface AuthResult {
  success: boolean;
  user: User | null;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class Auth2Service {
  user = signal<User | null>(null);

  constructor(private auth: Auth) {
    onAuthStateChanged(auth, (u) => this.user.set(u));
  }

  login(email: string, password: string): Promise<AuthResult> {
    return signInWithEmailAndPassword(this.auth, email, password)
      .then((res) => ({ success: true, user: res.user, message: '' }))
      .catch((err) => ({ success: false, user: null, message: err.message }));
  }

  register(email: string, password: string): Promise<AuthResult> {
    return createUserWithEmailAndPassword(this.auth, email, password)
      .then((res) => ({ success: true, user: res.user, message: '' }))
      .catch((err) => ({ success: false, user: null, message: err.message }));
  }

  logout() {
    return signOut(this.auth);
  }

  get currentUser() {
    return this.auth.currentUser;
  }

  get uid() {
    return this.auth.currentUser?.uid;
  }
}
