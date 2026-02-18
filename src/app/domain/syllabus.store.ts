import { Injectable, inject } from '@angular/core';
import { Observable, of, forkJoin } from 'rxjs';
import { map, switchMap, shareReplay, filter, take, tap, catchError } from 'rxjs/operators';

import { SyllabusRepository } from './repositories/syllabus.repository';
import { ClassSyllabus } from '../models/syllabus/class-syllabus.model';
import { SyllabusIndex } from '../models/syllabus/syllabus-index.model';
import { ResourceIndex, IdMapUtil } from '../shared/utils/id-map.utils';
import { UiStateUtil } from '../shared/state/ui-state.utils';

@Injectable({ providedIn: 'root' })
export class SyllabusStore {
  private repo = inject(SyllabusRepository);
  private uiState = inject(UiStateUtil);

  /** --------------------------------------------------
   * ID MAP STREAM (cached & shared)
   * -------------------------------------------------- */
  private idMap$?: Observable<ResourceIndex>;

  getIdMap$(): Observable<ResourceIndex> {
    if (!this.idMap$) {
      const uiCached = this.uiState.get<ResourceIndex>('resourceIndex');

      this.idMap$ = uiCached
        ? of(uiCached)
        : this.repo.loadIndex().pipe(
            take(1),
            map((index) => (index ? IdMapUtil.buildResourceIndex(index) : {})),
            tap((map) => this.uiState.set('resourceIndex', map)),
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
}
