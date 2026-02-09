import { Injectable, inject } from '@angular/core';
import { Observable, of, forkJoin } from 'rxjs';
import { map, switchMap, shareReplay, filter, take, tap } from 'rxjs/operators';

import { SyllabusRepository } from '../data/repositories/syllabus.repository';
import { UiStateUtil } from './ui-state.utils';
import { IdFileMap, IdMapUtil } from '../core/utils/id-map.utils';
import { ClassSyllabus } from '../models/syllabus/class-syllabus';

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
            shareReplay(1)
          );
    }

    return this.idMap$;
  }

  /** --------------------------------------------------
   * LOAD ALL CLASSES USING INDEX (efficient)
   * -------------------------------------------------- */
  getAllClasses$(): Observable<ClassSyllabus[]> {
    return this.getIdMap$().pipe(
      map((map) => Object.values(map)),
      switchMap((ids) => {
        if (!ids.length) return of([]);

        return forkJoin(
          ids.map((id) =>
            this.repo.loadClass(id).pipe(
              take(1),
              filter((cls): cls is ClassSyllabus => !!cls)
            )
          )
        );
      }),
      shareReplay(1)
    );
  }
}
