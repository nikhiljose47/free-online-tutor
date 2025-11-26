import { Injectable, signal, computed } from '@angular/core';
import { Auth, signInWithEmailAndPassword, onAuthStateChanged, User } from '@angular/fire/auth';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { map, of } from 'rxjs';

export interface AppUser {
  uid: string;
  email: string;
  role: 'admin' | 'user' | 'guest';
}

@Injectable({ providedIn: 'root' })
export class Auth2Service {
  private _user = signal<AppUser | null>(null);
  user = computed(() => this._user());
  isAdmin = computed(() => this._user()?.role === 'admin');
  isLoggedIn = computed(() => !!this._user() && this._user()?.role !== 'guest');

  constructor(private auth: Auth, private db: Firestore) {
    onAuthStateChanged(this.auth, async (authUser: User | null) => {
      if (!authUser) {
        this._user.set(null);
        return;
      }
      const snap = await getDoc(doc(this.db, 'users', authUser.uid));
      const data = snap.data() as any;

      this._user.set({
        uid: authUser.uid,
        email: authUser.email ?? '',
        role: data?.role ?? 'user'
      });
    });
  }

  async login(email: string, password: string) {
    try {
      const res = await signInWithEmailAndPassword(this.auth, email, password);

      const snap = await getDoc(doc(this.db, 'users', res.user.uid));
      const data = snap.data() as any;

      const appUser: AppUser = {
        uid: res.user.uid,
        email: res.user.email ?? '',
        role: data?.role ?? 'user',
      };

      this._user.set(appUser);
      return { ok: true, user: appUser };
    } catch (e: any) {
      return { ok: false, message: e.message };
    }
  }

  loginGuest() {
    const guest: AppUser = {
      uid: 'guest',
      email: '',
      role: 'guest'
    };
    this._user.set(guest);
  }

  logout() {
    this._user.set(null);
    return this.auth.signOut();
  }
}
