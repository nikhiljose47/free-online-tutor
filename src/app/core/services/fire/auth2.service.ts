import {
  computed,
  EnvironmentInjector,
  inject,
  Injectable,
  runInInjectionContext,
  signal,
} from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from '@angular/fire/auth';
import { FirestoreDocService } from './firestore-doc.service';
import { take } from 'rxjs';

export interface AuthResult {
  success: boolean;
  user: User | null;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class Auth2Service {
  user = signal<User | null>(null);
  role = signal<'admin' | 'student' | null>(null);

  private envInjector = inject(EnvironmentInjector);
  private fs = inject(FirestoreDocService);
  private _isAdmin = computed(() => this.role() === 'admin');

   
  constructor(private auth: Auth) {
    onAuthStateChanged(auth, (u) => {
      runInInjectionContext(this.envInjector, () => {
        this.user.set(u);
        if (!u) {
          this.role.set(null);
          return;
        }

        // reuse your service
        this.fs
          .getOnce<any>('users', u.uid)
          .pipe(take(1))
          .subscribe((res) => {
            if (res.ok && res.data) {
              this.role.set((res.data as any)?.role ?? null);
            } else {
              this.role.set(null);
            }
          });
      });
    });
  }

  isAdmin() {
    return this._isAdmin();
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
