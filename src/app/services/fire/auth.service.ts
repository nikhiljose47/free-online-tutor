import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';

export interface User {
  id: string;
  name: string;
  role?: 'student' | 'teacher';
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private user$ = new BehaviorSubject<User | null>(null);

  getUser() {
    return this.user$.asObservable();
  }
  getSnapshot() {
    return this.user$.value;
  }

  login(name: string) {
    const user = { id: 'u1', name, role: 'student' } as User;
    this.user$.next(user);
    return of(user);
  }

  logout() {
    this.user$.next(null);
    return of(true);
  }

  register(name: string) {
    return this.login(name); // simple
  }
}
