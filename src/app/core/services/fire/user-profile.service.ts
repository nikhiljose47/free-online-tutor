import { Auth2Service } from './auth2.service';
import { effect, Injectable, signal } from '@angular/core';
import { FirestoreDocService } from './firestore-doc.service';
import { UserModel } from '../../../models/fire/user.model';
import { catchError, of, tap } from 'rxjs';
import { Timestamp } from '@angular/fire/firestore';

@Injectable({ providedIn: 'root' })
export class UserProfileService {
  profile = signal<UserModel | null>(null);

  constructor(
    private fire: FirestoreDocService,
    private auth: Auth2Service,
  ) {
    effect(() => {
      const user = this.auth.user();

      if (!user) {
        this.profile.set(null);
        return;
      }
      this.fire.getOnce('users', user.uid).subscribe((res) => {
        if (res.ok && res.data) {
          const profile = res.data as UserModel;
          profile.uid = user.uid;
          this.profile.set(profile);
        } else {
          this.profile.set(null);
        }
      });
    });
  }

  // 🎯 User earns → add
  addPoints(value: number, identifier: string) {
    const uid = this.auth.uid;
    if (!uid) return of(null);

    const key = identifier?.trim().toLowerCase() || 'default';

    const curr = this.profile()?.points?.points || 0;
    const total = this.profile()?.totalPoints?.points || 0;

    const newPoints = curr + value;
    const newTotal = total + value;

    // instant UI
    this.profile.update((p) => {
      if (!p) return p;
      return {
        ...p,
        points: {
          identifier: key,
          points: newPoints,
        },
        totalPoints: {
          identifier: 'lifetime',
          points: newTotal,
        },
      };
    });

    const p1$ = this.fire.incrementNested('users', uid, 'points.points', value);
    const p2$ = this.fire.incrementNested('users', uid, 'totalPoints.points', value);

    return p1$.pipe(
      tap(() => p2$.subscribe()),
      tap(() => {
        this.fire
          .update('users', uid, {
            'points.identifier': key,
            'totalPoints.identifier': 'lifetime',
          })
          .subscribe();
      }),
      catchError(() => of(null)),
    );
  }

  //🛠 System/admin overrides → set  (but only updates points and not totalPoints)
  // usage: this.userProfile.setPoints(100, 'admin')
  setPoints(value: number, identifier: string) {
    const uid = this.auth.uid;
    if (!uid) return of(null);

    const key = identifier?.trim().toLowerCase() || 'default';

    // instant UI
    this.profile.update((p) => {
      if (!p) return p;
      return {
        ...p,
        points: {
          identifier: key,
          points: value,
        },
      };
    });

    return this.fire
      .update('users', uid, {
        points: {
          identifier: key,
          points: value,
        },
        updatedAt: new Date(),
      })
      .pipe(catchError(() => of(null)));
  }


  updateProfile(data: Partial<UserModel>) {
    const uid = this.auth.uid;
    if (!uid) return of(null);

    const now = Timestamp.now();

    // instant UI
    this.profile.update((p) => {
      if (!p) return p;
      return {
        ...p,
        ...data,
        updatedAt: now, // ✅ correct type
      } as UserModel;
    });

    return this.fire
      .update('users', uid, {
        ...data,
        updatedAt: now,
      })
      .pipe(catchError(() => of(null)));
  }
}
