import { Injectable, signal } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from '@angular/fire/auth';

@Injectable({ providedIn: 'root' })
export class Auth2Service {
  user = signal<User | null>(null);

  constructor(private auth: Auth) {
    onAuthStateChanged(auth, (u) => this.user.set(u));
  }

  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password)
      .then((res) => ({ ok: true, user: res.user }))
      .catch((err) => ({ ok: false, user: null, message: err.message }));
  }

  register(email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password)
      .then((res) => ({ ok: true, user: res.user }))
      .catch((err) => ({ ok: false, user: null, message: err.message }));
  }

  logout() {
    return signOut(this.auth);
  }

  get currentUser() {
    return this.auth.currentUser;
  }
}
