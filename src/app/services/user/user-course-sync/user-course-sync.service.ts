import { Injectable, inject, signal } from '@angular/core';
import { fromEvent, interval, merge, of, switchMap, filter, concatMap, catchError, tap, from } from 'rxjs';
import { IndexedDbService } from '../../../core/services/cache/db/indexed-db.service';
import { FirestoreDocService } from '../../../core/services/fire/firestore-doc.service';



type Store = 'user_course_map';

interface UserCourseMap {
  id: string; // userId
  userId: string;
  courseIds: string[];
  pending: string[]; // unsynced
  updatedAt: number;
}

@Injectable({ providedIn: 'root' })
export class UserCourseSyncService {
  private db = inject(IndexedDbService);
  private fire = inject(FirestoreDocService);

  private store: Store = 'user_course_map';

  syncing = signal(false);

  constructor() {
    this.initSyncEngine();
  }

  /* ---------- PUBLIC API ---------- */

  async enroll(userId: string, courseId: string): Promise<void> {
    const existing = await this.db.get<UserCourseMap>(this.store as any, userId);

    const data: UserCourseMap = existing ?? {
      id: userId,
      userId,
      courseIds: [],
      pending: [],
      updatedAt: Date.now(),
    };

    if (!data.courseIds.includes(courseId)) {
      data.courseIds.push(courseId);
    }

    if (!data.pending.includes(courseId)) {
      data.pending.push(courseId);
    }

    data.updatedAt = Date.now();

    await this.db.set(this.store as any, data);

    this.triggerSync();
  }

  async getCourses(userId: string): Promise<string[]> {
    const local = await this.db.get<UserCourseMap>(this.store as any, userId);

    if (local?.courseIds?.length) return local.courseIds;

    // fallback remote
    return new Promise((resolve) => {
      this.fire.getOnce<any>('users', userId).subscribe((res) => {
        const list = (res?.data as any)?.enrolledClassIds ?? [];
        this.db.set(this.store as any, {
          id: userId,
          userId,
          courseIds: list,
          pending: [],
          updatedAt: Date.now(),
        });
        resolve(list);
      });
    });
  }

  /* ---------- SYNC ENGINE ---------- */

  private initSyncEngine() {
    const online$ = fromEvent(window, 'online');
    const periodic$ = interval(15000);

    merge(online$, periodic$)
      .pipe(
        filter(() => !this.syncing()),
        switchMap(() => this.syncAll())
      )
      .subscribe();
  }

  private triggerSync() {
    this.syncAll().subscribe();
  }

  private syncAll() {
    this.syncing.set(true);

    return from(this.db.getAll<UserCourseMap>(this.store as any)).pipe(
      switchMap((users) => of(...users)),
      filter((u) => u.pending?.length > 0),
      concatMap((u) => this.syncUser(u)),
      tap(() => this.syncing.set(false)),
      catchError(() => {
        this.syncing.set(false);
        return of(null);
      })
    );
  }

  private syncUser(user: UserCourseMap) {
    const updates = [...user.pending];

    return of(...updates).pipe(
      concatMap((courseId) =>
        this.fire
          .addToArrayField<any>('users', user.userId, 'enrolledClassIds', courseId)
          .pipe(
            tap((res) => {
              if (res.ok) {
                user.pending = user.pending.filter((c) => c !== courseId);
              }
            }),
            catchError(() => of(null))
          )
      ),
      tap(async () => {
        await this.db.set(this.store as any, user);
      })
    );
  }
}