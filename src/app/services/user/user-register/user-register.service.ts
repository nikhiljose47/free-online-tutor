import { Injectable, inject } from '@angular/core';
import { UserModel } from '../../../models/fire/user.model';
import { Observable, from } from 'rxjs';
import { Auth2Service } from '../../../core/services/fire/auth2.service';
import { FirestoreDocService } from '../../../core/services/fire/firestore-doc.service';
import { DEF_AVATAR_ID } from '../../../core/constants/app.constants';

type RegisterPayload = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type RegisterResult = {
  ok: boolean;
  message: string;
};

@Injectable({ providedIn: 'root' })
export class UserRegisterService {
  private auth = inject(Auth2Service);
  private fire = inject(FirestoreDocService);

  registerUser(payload: RegisterPayload): Observable<RegisterResult> {
    return from(this.handleRegister(payload));
  }

  private async handleRegister(payload: RegisterPayload): Promise<RegisterResult> {
    const { name, email, password, confirmPassword } = payload;

    if (!name.trim()) return { ok: false, message: 'Enter name' };
    if (password !== confirmPassword) return { ok: false, message: 'Passwords do not match' };

    try {
      const res = await this.auth.register(email, password);

      if (!res.success || !res.user) {
        return { ok: false, message: res.message };
      }

      const userDoc: UserModel = {
        uid: res.user.uid,
        name,
        email: res.user.email ?? '',
        avatarId: DEF_AVATAR_ID,
        joinedAt: Date.now(),
        role: 'student',
        age: 26,
        photoUrl: null,
        phone: '',
        enrolledClassIds: [],
        totalPoints: 0,
        seasonPoints: 0,
        seasonId: '',
        abilities: [],
        skills: [],
        expList: [],
        expYrs: 0,
        subjects: [],
        bio: '',
        rating: 0,
        weekPerformance: 'good',
        specialization: [],
        meta: {},
        lastSession: null,
        updatedAt: null,
      };

      const saveRes = await this.fire.set<UserModel>('users', res.user.uid, userDoc).toPromise();

      if (!saveRes?.ok) {
        return { ok: false, message: saveRes?.message ?? 'Save failed' };
      }

      return { ok: true, message: 'Account created' };
    } catch {
      return { ok: false, message: 'Something went wrong' };
    }
  }
}
