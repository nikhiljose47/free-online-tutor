import { Injectable, inject } from '@angular/core';
import { Observable, of, forkJoin } from 'rxjs';
import { map, switchMap, shareReplay, filter, take, tap, catchError } from 'rxjs/operators';

import { SyllabusRepository } from '../../domain/repositories/syllabus.repository';
import { UiStateUtil } from './ui-state.utils';
import { ClassSyllabus } from '../../models/syllabus/class-syllabus.model';
import { ResourceIndex, IdMapUtil } from '../utils/id-map.utils';

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
      switchMap((ids) =>
        ids.length
          ? forkJoin(
              ids.map((id) =>
                this.repo.loadClass(id).pipe(
                  take(1),
                  catchError(() => of(null)),
                ),
              ),
            )
          : of([]),
      ),
      map((classes) => classes.filter((c): c is ClassSyllabus => !!c)),
      shareReplay({ bufferSize: 1, refCount: false }),
    );
  }
}
