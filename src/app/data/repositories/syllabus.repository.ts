import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { from, Observable, of, switchMap, tap, retry, catchError, forkJoin } from 'rxjs';
import { IndexedDbService } from '../../services/db/indexed-db.service';
import { SyllabusIndex } from '../../models/syllabus/syllabus-index.model';
import { UiStateUtil } from '../../shared/state/ui-state.utils';
import { ClassSyllabus } from '../../models/syllabus/class-syllabus';
import { SYLL_INDEX_CACHE_KEY } from '../../core/constants/app.constants';

@Injectable({ providedIn: 'root' })
export class SyllabusRepository {
  private readonly TTL = 15 * 60 * 1000;

  constructor(
    private http: HttpClient,
    private indexDb: IndexedDbService,
    private uiState: UiStateUtil,
  ) {}

  loadIndex(): Observable<SyllabusIndex | null> {
    const uiCached = this.uiState.get<SyllabusIndex>(SYLL_INDEX_CACHE_KEY);
    if (uiCached) return of(uiCached);

    return from(
      this.indexDb.get<{ id: string; data: SyllabusIndex; ts: number }>(
        'syllabus_index',
        SYLL_INDEX_CACHE_KEY,
      ),
    ).pipe(
      switchMap((dbCached) => {
        const now = Date.now();

        if (dbCached) {
          this.uiState.set(SYLL_INDEX_CACHE_KEY, dbCached.data, this.TTL);
        }

        if (dbCached && now - dbCached.ts < this.TTL) {
          return of(dbCached.data);
        }

        return this.http.get<SyllabusIndex>('data/syllabus-index.json').pipe(
          retry({ count: 2, delay: 1000 }),
          tap((data) => {
            this.uiState.set(SYLL_INDEX_CACHE_KEY, data, this.TTL);

            this.indexDb
              .set('syllabus_index', {
                id: SYLL_INDEX_CACHE_KEY,
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

  loadClass(classId: string): Observable<ClassSyllabus | null> {
    const CACHE_KEY = `syllabus:${classId}`;
    const TTL = 24 * 60 * 60 * 1000; // 24h

    const uiCached = this.uiState.get<ClassSyllabus>(CACHE_KEY);
    if (uiCached) return of(uiCached);

    return from(
      this.indexDb.get<{ id: string; data: ClassSyllabus; ts: number }>(
        'syllabus_by_class',
        CACHE_KEY,
      ),
    ).pipe(
      switchMap((dbCached) => {
        const now = Date.now();

        // serve stale immediately
        if (dbCached) {
          this.uiState.set(CACHE_KEY, dbCached.data, TTL);
        }

        // fresh → skip network
        if (dbCached && now - dbCached.ts < TTL) {
          return of(dbCached.data);
        }

        // network
        return this.http.get<ClassSyllabus>(`syllabus/${classId}`).pipe(
          retry({ count: 2, delay: 1000 }),
          tap((data) => {
            this.uiState.set(CACHE_KEY, data, TTL);
            this.indexDb
              .set('syllabus_by_class', {
                id: CACHE_KEY,
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

  loadMultipleClasses(classIds: string[]): void {
    forkJoin(classIds.map((id) => this.loadClass(id).pipe(catchError(() => of(null))))).subscribe();
  }
}
