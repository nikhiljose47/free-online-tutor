import { Injectable, signal, computed } from '@angular/core';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { UserDocService } from './user-doc.service';
import { AppUser } from '../../models/app-user.model';
import { Auth2Service } from './auth2.service';

@Injectable({ providedIn: 'root' })
export class SessionService {
  private _user = signal<AppUser | null>(null);

  user = computed(() => this._user());
  isAdmin = computed(() => this._user()?.role === 'admin');
  isLoggedIn = computed(() => !!this._user() && this._user()?.role !== 'guest');

  constructor(
    private auth: Auth,
    private authApi: Auth2Service,
    private userDocs: UserDocService
  ) {
    onAuthStateChanged(this.auth, async user => {
      if (!user) {
        this._user.set(null);
        return;
      }

      const data = await this.userDocs.getUser(user.uid);

      this._user.set(
        data ?? {
          uid: user.uid,
          email: user.email ?? '',
          role: 'user',
        }
      );
    });
  }

  login(email: string, password: string) {
    return this.authApi.login(email, password).then(async res => {
      if (!res.ok || !res.user) return res;

      const data = await this.userDocs.getUser(res.user.uid);

      const appUser: AppUser = {
        uid: res.user.uid,
        email: res.user.email ?? '',
        role: data?.role ?? 'user',
      };

      this._user.set(appUser);

      return { ok: true, user: appUser };
    });
  }

  register(email: string, password: string, role: AppUser['role'] = 'user') {
    return this.authApi.register(email, password).then(async res => {
      if (!res.ok || !res.user) return res;

      const newUser: AppUser = {
        uid: res.user.uid,
        email,
        role,
      };

      await this.userDocs.createUserDoc(newUser);
      this._user.set(newUser);

      return { ok: true, user: newUser };
    });
  }

  loginGuest() {
    const guest: AppUser = { uid: 'guest', email: '', role: 'guest' };
    this._user.set(guest);
  }

  logout() {
    this._user.set(null);
    return this.authApi.logout();
  }
}
