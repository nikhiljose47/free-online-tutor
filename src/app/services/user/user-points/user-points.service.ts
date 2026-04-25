import { Injectable, inject } from '@angular/core';
import { from, switchMap, of, map, Subject } from 'rxjs';

import { FirestoreDocService } from '../../../core/services/fire/firestore-doc.service';
import { Auth2Service } from '../../../core/services/fire/auth2.service';
import { DBStore, IndexedDbService } from '../../../core/services/cache/db/indexed-db.service';

type PointLog = { id: string; ts: number };

@Injectable({ providedIn: 'root' })
export class UserPointsService {
  private idb = inject(IndexedDbService);
  private fs = inject(FirestoreDocService);
  private auth = inject(Auth2Service);

  private store: DBStore = 'user_point_logs';
  private _points$ = new Subject<number>();
  readonly points$ = this._points$.asObservable();

  private currentSeasonId = '';

  /* ---------- GET ---------- */

  get() {
    const uid = this.auth.uid;
    if (!uid) return of(null);

    return this.fs.getOnce<any>('meta', 'season').pipe(
      switchMap((seasonRes) => {
        if (!seasonRes.ok) return of(null);

        this.currentSeasonId = (seasonRes.data as any)?.seasonId ?? '';

        return this.fs.getOnce<any>('users', uid);
      }),
      map((userRes) => {
        if (!userRes?.ok) return null;

        const user = userRes.data as any;

        if (!user) return null;

        // UI reset only
        if (user.seasonId !== this.currentSeasonId) {
          user.points.points = 0;
          user.seasonId = this.currentSeasonId;
        }

        return user;
      })
    );
  }

  /* ---------- PUT ---------- */

  addPoints(points: number, key?: string) {
    const uid = this.auth.uid;
    if (!uid) return of({ ok: false });

    const finalKey = key ? this.hash(key) : null;

    if (!finalKey) {
      return this.apply(uid, points, true);
    }

    return from(this.idb.get<PointLog>(this.store, finalKey)).pipe(
      switchMap((exists) => {
        if (exists) return of({ ok: true, skipped: true });

        return this.apply(uid, points, true).pipe(
          switchMap((res) => {
            if (!res.ok) return of(res);

            return from(
              this.idb.set(this.store, {
                id: finalKey,
                ts: Date.now(),
              })
            ).pipe(map(() => res));
          })
        );
      })
    );
  }

  /* ---------- CORE ---------- */

  private apply(uid: string, points: number, emit = false) {
    return this.fs.getOnce<any>('users', uid).pipe(
      switchMap((userRes) => {
        if (!userRes.ok) return of(userRes);

        const user = userRes.data as any;
        const needsReset = user.seasonId !== this.currentSeasonId;

        const reset$ = needsReset
          ? this.fs.update('users', uid, {
              seasonId: this.currentSeasonId,
              'points.points': 0,
            })
          : of({ ok: true });

        return reset$.pipe(
          switchMap(() =>
            this.fs.incrementNested('users', uid, 'points.points', points)
          ),
          switchMap((res) => {
            if (!res.ok) return of(res);

            return this.fs.incrementNested('users', uid, 'totalPoints.points', points);
          }),
          map((r) => {
            if (r.ok && emit) {
              this._points$.next(points);
            }
            return r;
          })
        );
      })
    );
  }

  /* ---------- HELPERS ---------- */

  private hash(str: string): string {
    let h = 0, i, chr;
    for (i = 0; i < str.length; i++) {
      chr = str.charCodeAt(i);
      h = (h << 5) - h + chr;
      h |= 0;
    }
    return 'pt_' + Math.abs(h);
  }

  /* ---------- EXTRA ---------- */

  clearLogs() {
    return from(this.idb.clear(this.store));
  }
}