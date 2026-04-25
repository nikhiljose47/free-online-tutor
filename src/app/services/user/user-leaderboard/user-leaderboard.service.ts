import { Injectable, inject } from '@angular/core';
import { of, switchMap, map, tap, startWith, from } from 'rxjs';

import { FirestoreDocService } from '../../../core/services/fire/firestore-doc.service';
import { IndexedDbService, DBStore } from '../../../core/services/cache/db/indexed-db.service';
import { UserModel } from '../../../models/fire/user.model';

@Injectable({ providedIn: 'root' })
export class UserLeaderboardService {
  private fs = inject(FirestoreDocService);
  private idb = inject(IndexedDbService);

  private store: DBStore = 'user_course_map';
  private cacheKey = 'leaderboard_top10';

  private currentSeasonId = '';

  /* ---------- SEASON ---------- */

  private getSeason() {
    return this.fs.getOnce<any>('meta', 'season').pipe(
      map((res) => {
        this.currentSeasonId = (res.data as any)?.seasonId ?? '';
        return this.currentSeasonId;
      })
    );
  }

  /* ---------- GET TOP 10 ---------- */

  getTop10() {
    return from(this.getCache()).pipe(
      switchMap((cached: UserModel[]) =>
        this.getSeason().pipe(
          switchMap(() =>
            this.fs.realtimeMultiWhere<UserModel>(
              'users',
              [{ field: 'seasonId', op: '==', value: this.currentSeasonId }],
              10
            ).pipe(
              map((res) => {
                if (!res.ok) return cached || [];

                const users = (res.data as UserModel[]) || [];

                return users
                  .sort((a, b) => (b.seasonPoints || 0) - (a.seasonPoints || 0))
                  .slice(0, 10); // enforce safety
              }),
              tap((top10) => this.setCache(top10)),
              startWith(cached || [])
            )
          )
        )
      )
    );
  }

  /* ---------- CACHE ---------- */

  private getCache(): Promise<UserModel[]> {
    return this.idb.get<any>(this.store, this.cacheKey).then((r) => r?.data || []);
  }

  private setCache(data: UserModel[]) {
    return this.idb.set(this.store, {
      id: this.cacheKey,
      data,
      ts: Date.now(),
    });
  }
}