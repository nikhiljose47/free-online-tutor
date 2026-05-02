import { Injectable, inject, signal } from '@angular/core';
import { defer, firstValueFrom, from, of } from 'rxjs';
import { catchError, map, shareReplay, switchMap, tap } from 'rxjs/operators';
import { IndexedDbService } from '../../../core/services/cache/db/indexed-db.service';
import { CACHE_TTL } from '../../../core/constants/app.constants';
import { RankboardUser, UserPointsService } from '../../user/user-points/user-points.service';

const CACHE_KEY = 'leaderboard_top10';

@Injectable({ providedIn: 'root' })
export class RankboardCacheService {
  private db = inject(IndexedDbService);
  private userPointsApi = inject(UserPointsService);

  private dataSig = signal<RankboardUser[]>([]);
  private loadingSig = signal<boolean>(false);
  private syncingSig = signal<boolean>(false);
  private errorSig = signal<string | null>(null);

  data = this.dataSig.asReadonly();
  loading = this.loadingSig.asReadonly();
  syncing = this.syncingSig.asReadonly();
  error = this.errorSig.asReadonly();

  private inFlight?: Promise<RankboardUser[]>;

  // In case if users login at same time on same day
  private ttl(): number {
    const jitter = Math.random() * 6 * 60 * 60 * 1000; // up to 6 hr random jitter
    return CACHE_TTL.RANKBOARD_TOP10 + jitter;
  }

  load$() {
    return defer(() => {
      this.loadingSig.set(true);
      return from(this.db.getWithTTL<RankboardUser[]>(CACHE_KEY));
    }).pipe(
      switchMap((cached) => {
        if (cached?.length) {
          this.dataSig.set(cached);
          this.loadingSig.set(false);
          this.backgroundRefresh();
          return of(cached);
        }
        return from(this.fetchAndCache());
      }),
      catchError(() => {
        this.errorSig.set('offline_or_failed');
        this.loadingSig.set(false);
        return of([]);
      }),
      shareReplay(1),
    );
  }

  refresh$() {
    return defer(() => from(this.fetchAndCache())).pipe(
      catchError(() => of([])),
      shareReplay(1),
    );
  }

  private async fetchAndCache(): Promise<RankboardUser[]> {
    if (this.inFlight) return this.inFlight;

    this.syncingSig.set(true);

    this.inFlight = new Promise<RankboardUser[]>(async (resolve) => {
      try {
        const data = await firstValueFrom(this.userPointsApi.getTop10Rankboard());
        this.dataSig.set(data);

        await this.db.setWithTTL(CACHE_KEY, data, this.ttl());

        resolve(data);
      } catch {
        this.errorSig.set('fetch_failed');
        resolve([]);
      } finally {
        this.loadingSig.set(false);
        this.syncingSig.set(false);
        this.inFlight = undefined;
      }
    });

    return this.inFlight;
  }

  private backgroundRefresh() {
    this.fetchAndCache();
  }
}
