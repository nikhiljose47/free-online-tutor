import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  from,
  Observable,
  of,
  switchMap,
  tap,
  retry,
  catchError,
  forkJoin,
  defer,
  map,
  shareReplay,
} from 'rxjs';
import { IndexedDbService } from '../../core/services/cache/db/indexed-db.service';
import { SyllabusIndex } from '../../models/syllabus/syllabus-index.model';
import { UiStateUtil } from '../../shared/state/ui-state.utils';
import { ClassSyllabus } from '../../models/syllabus/class-syllabus.model';
import {
  CACHE_TTL,
  DEF_SYLLABUS_INDEX,
  SYLL_INDEX_CACHE_KEY,
} from '../../core/constants/app.constants';

@Injectable({ providedIn: 'root' })
export class SyllabusRepository {
  private index$?: Observable<SyllabusIndex>;

  constructor(
    private http: HttpClient,
    private indexDb: IndexedDbService,
    private uiState: UiStateUtil,
  ) {}

  loadIndex(): Observable<SyllabusIndex> {
    if (this.index$) return this.index$;

    this.index$ = defer(() => {
      const ui = this.uiState.get<SyllabusIndex>(SYLL_INDEX_CACHE_KEY);
      if (ui) return of(ui);

      return from(
        this.indexDb.get<{ data: SyllabusIndex; ts: number }>(
          'syllabus_index',
          SYLL_INDEX_CACHE_KEY,
        ),
      ).pipe(
        switchMap((db) => {
          const now = Date.now();

          if (db?.data) {
            this.setIndexUiCache(db.data);
            if (now - db.ts < CACHE_TTL.SYLL_INDEX) return of(db.data);
          }

          return this.http.get<SyllabusIndex>('index/syllabus-index.json').pipe(
            retry({ count: 2, delay: 800 }),
            tap((data) => {
              this.setIndexUiCache(data);
              this.indexDb
                .set('syllabus_index', {
                  id: SYLL_INDEX_CACHE_KEY,
                  data,
                  ts: Date.now(),
                })
                .catch(() => {});
            }),
            catchError(() => of(db?.data ?? DEF_SYLLABUS_INDEX)),
          );
        }),
        map((res) => res ?? DEF_SYLLABUS_INDEX),
      );
    }).pipe(shareReplay(1));

    return this.index$;
  }


  private setIndexUiCache(data: SyllabusIndex) {
    this.uiState.set(SYLL_INDEX_CACHE_KEY, data, CACHE_TTL.SYLL_INDEX);
  }

  loadClassById(classId: string, index: SyllabusIndex): Observable<ClassSyllabus | null> {
    const CACHE_KEY = `syllabus:${classId}`;
    const uiCached = this.uiState.get<ClassSyllabus>(CACHE_KEY);

    if (uiCached) {
      return of(uiCached);
    }

    return from(
      this.indexDb.get<{ id: string; data: ClassSyllabus; ts: number }>(
        'syllabus_by_class',
        CACHE_KEY,
      ),
    ).pipe(
      switchMap((dbCached) => {
        const now = Date.now();

        if (dbCached) {
          this.uiState.set(CACHE_KEY, dbCached.data, CACHE_TTL.SYLL_DATA);
          if (now - dbCached.ts < CACHE_TTL.SYLL_DATA) {
            return of(dbCached.data);
          }
        }

        const fileId = index.catalog.find((item) => item.id === classId)?.file;
        return this.http.get<ClassSyllabus>(`syllabus/${fileId}`).pipe(
          retry({ count: 2, delay: 1000 }),
          tap((data) => {
            this.uiState.set(CACHE_KEY, data, CACHE_TTL.SYLL_DATA);

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

  loadMultipleClasses(classIds: string[], index: SyllabusIndex): void {
    forkJoin(
      classIds.map((id) => this.loadClassById(id, index).pipe(catchError(() => of(null)))),
    ).subscribe();
  }
}
