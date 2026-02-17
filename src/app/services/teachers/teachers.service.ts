import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

import { FireResponse, FirestoreDocService } from '../../core/services/fire/firestore-doc.service';
import { UserModel } from '../../models/fire/user.model';
import { CACHE_TTL } from '../../core/constants/app.constants';


interface CacheEntry<T> {
  expiry: number;
  stream$: Observable<T>;
}

@Injectable({ providedIn: 'root' })
export class TeachersService {
  private fire = inject(FirestoreDocService);

  /* ================= CACHE STORES ================= */
  private teachersListCache?: CacheEntry<UserModel[]>;
  private teacherByIdCache = new Map<string, CacheEntry<UserModel | null>>();

  /* ================= GET ALL TEACHERS ================= */
  getTeachers$(): Observable<UserModel[]> {
    const now = Date.now();

    if (this.teachersListCache && now < this.teachersListCache.expiry) {
      return this.teachersListCache.stream$;
    }

    const stream$ = this.fire
      .where<UserModel>('users', 'role', '==', 'teacher', 100)
      .pipe(
        map((res: FireResponse<UserModel>) => {
          if (!res.ok || !Array.isArray(res.data)) return [];
          return res.data as UserModel[];
        }),
        shareReplay({ bufferSize: 1, refCount: false })
      );

    this.teachersListCache = {
      stream$,
      expiry: now + CACHE_TTL.TEACHERS_LIST,
    };

    return stream$;
  }

  /* ================= GET TEACHER BY UID ================= */
  getTeacherByUid$(uid: string): Observable<UserModel | null> {
    if (!uid) return of(null);

    const now = Date.now();
    const cached = this.teacherByIdCache.get(uid);

    if (cached && now < cached.expiry) {
      return cached.stream$;
    }

    const stream$ = this.fire
      .getOnce<UserModel>('users', uid)
      .pipe(
        map((res) => (res.ok && res.data ? (res.data as UserModel) : null)),
        shareReplay({ bufferSize: 1, refCount: false })
      );

    this.teacherByIdCache.set(uid, {
      stream$,
      expiry: now + CACHE_TTL.TEACHER_BY_ID,
    });

    return stream$;
  }

  /* ================= OPTIONAL: MANUAL INVALIDATION ================= */
  clearTeachersCache(): void {
    this.teachersListCache = undefined;
    this.teacherByIdCache.clear();
  }
}
