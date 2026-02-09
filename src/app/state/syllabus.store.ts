import { Injectable, inject } from '@angular/core';
import { SyllabusRepository } from '../data/repositories/syllabus.repository';
import { UiStateUtil } from './ui-state.utils';
import { IdFileMap, IdMapUtil } from '../core/utils/id-map.utils';
import { ClassSyllabus } from '../models/syllabus/class-syllabus';
import { Observable } from 'rxjs/internal/Observable';
import { filter, firstValueFrom, forkJoin, from, of, switchMap, take } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SyllabusParser {
  private repo = inject(SyllabusRepository);
  private uiState = inject(UiStateUtil);

  // PURE getter
  async getIdMap(): Promise<IdFileMap> {
    const map = this.uiState.get<IdFileMap>('idFileMap');

    if (map) {
      return map;
    }
    return this.loadIdMap();
  }

  async loadIdMap(): Promise<IdFileMap> {
    const dbCached = await firstValueFrom(this.repo.loadIndex().pipe(take(1)));

    if (!dbCached) return {};

    const fileMap = IdMapUtil.buildIdFileMap(dbCached);
    this.uiState.set<IdFileMap>('idFileMap', fileMap);

    return fileMap;
  }

  getAllClasses(): Observable<ClassSyllabus[]> {
    return from(this.getIdMap()).pipe(
      switchMap((map) => {
        const ids = Object.values(map);

        if (!ids.length) return of([]);

        const calls$ = ids.map((id) =>
          this.repo.loadClass(id).pipe(
            take(1),
            filter((data): data is ClassSyllabus => !!data),
          ),
        );

        return forkJoin(calls$);
      }),
    );
  }
}
