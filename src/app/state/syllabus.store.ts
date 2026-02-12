import { Injectable, inject } from '@angular/core';
import { Observable, of, forkJoin } from 'rxjs';
import { map, switchMap, shareReplay, filter, take, tap, catchError } from 'rxjs/operators';

import { SyllabusRepository } from '../data/repositories/syllabus.repository';
import { UiStateUtil } from './ui-state.utils';
import { IdFileMap, IdMapUtil } from '../core/utils/id-map.utils';
import { ClassSyllabus } from '../models/syllabus/class-syllabus';
import { DashboardComponent } from '../pages/dashboard/dashboard';
import { SyllabusIndex } from '../models/syllabus/syllabus-index.model';

//// readme

// 1.Ensure initialize service before use
// 2.This is sub store for syllabus repo, made with intention of load reduction in syll repo

@Injectable({ providedIn: 'root' })
export class SyllabusStore {
  private repo = inject(SyllabusRepository);
  private uiState = inject(UiStateUtil);

  /** --------------------------------------------------
   * ID MAP STREAM (cached & shared)
   * -------------------------------------------------- */
  private idMap$?: Observable<IdFileMap>;

  getIdMap$(): Observable<IdFileMap> {
    if (!this.idMap$) {
      const uiCached = this.uiState.get<IdFileMap>('idFileMap');

      this.idMap$ = uiCached
        ? of(uiCached)
        : this.repo.loadIndex().pipe(
            take(1),
            map((index) => (index ? IdMapUtil.buildIdFileMap(index) : {})),
            tap((map) => this.uiState.set('idFileMap', map)),
            shareReplay(1),
          );
    }

    return this.idMap$;
  }

  getAllClasses$(): Observable<ClassSyllabus[]> {
    return this.getIdMap$().pipe(
      map((map) => Object.values(map ?? {})),

      /* load all classes in parallel */
      switchMap((ids) =>
        ids.length
          ? forkJoin(
              ids.map((id) =>
                this.repo.loadClass(id).pipe(
                  take(1),
                  catchError(() => of(null)), // prevent forkJoin crash
                ),
              ),
            )
          : of([]),
      ),

      /* remove failed/null loads */
      map((classes) => classes.filter((c): c is ClassSyllabus => !!c)),

      /* avoid caching empty forever */
      filter((classes) => classes.length > 0),

      /* cache latest valid result */
      shareReplay({ bufferSize: 1, refCount: true }),
    );
  }

  getUnifiedDataFromIndex$(): Observable<
    (
      | SyllabusIndex['classes'][number]
      | SyllabusIndex['jamSessions'][number]
      | SyllabusIndex['activities'][number]
    )[]
  > {
    return this.repo.loadIndex().pipe(
      map((index) => {
        const classes = index?.classes?.filter((c) => c.enabled && c.ready) ?? [];
        const jams = index?.jamSessions?.filter((j) => j.enabled && j.ready) ?? [];
        const activities = index?.activities?.filter((a) => a.enabled && a.ready) ?? [];
        return [...classes, ...jams, ...activities];
      }),

      /* global priority sort */
      map((items) => items.sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0))),

      /* avoid caching empty forever */
      filter((items) => items.length > 0),

      /* cache latest valid result */
      shareReplay({ bufferSize: 1, refCount: true }),
    );
  }
}
