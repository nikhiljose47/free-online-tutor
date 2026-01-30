import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { from, Observable, of, switchMap, tap, retry, catchError } from 'rxjs';
import { IndexedDbService } from '../../services/db/indexed-db.service';
import { SyllabusIndex } from '../../models/syllabus-index.model';
import { UiStateUtil } from '../../core/state/ui-state.utils';
import { IdFileMap, IdMapUtil } from '../../utils/id-map.utils';

@Injectable({ providedIn: 'root' })
export class SyllabusRepository {
  private readonly CACHE_KEY = 'syllabusIndex';
  private readonly TTL = 15 * 60 * 1000;

  constructor(
    private http: HttpClient,
    private indexDb: IndexedDbService,
    private uiState: UiStateUtil,
  ) {}

  loadIndex(): Observable<SyllabusIndex | null> {
    const uiCached = this.uiState.get<SyllabusIndex>(this.CACHE_KEY);
    if (uiCached) return of(uiCached);

    return from(
      this.indexDb.get<{ id: string; data: SyllabusIndex; ts: number }>(
        'syllabus_index',
        this.CACHE_KEY,
      ),
    ).pipe(
      switchMap((dbCached) => {
        const now = Date.now();

        if (dbCached) {
          this.uiState.set(this.CACHE_KEY, dbCached.data, this.TTL);
          this.uiState.set<IdFileMap>('idFileMap', IdMapUtil.buildIdFileMap(dbCached.data));
        }

        if (dbCached && now - dbCached.ts < this.TTL) {
          return of(dbCached.data);
        }

        return this.http.get<SyllabusIndex>('data/syllabus-index.json').pipe(
          retry({ count: 2, delay: 1000 }),
          tap((data) => {
            this.uiState.set(this.CACHE_KEY, data, this.TTL);
            this.uiState.set<IdFileMap>('idFileMap', IdMapUtil.buildIdFileMap(data));

            this.indexDb
              .set('syllabus_index', {
                id: this.CACHE_KEY,
                data,
                ts: Date.now(),
              })
              .catch(() => {});
          }),
          catchError(() => of(dbCached?.data ?? null)),
        );
      }),
    );
  }
}
