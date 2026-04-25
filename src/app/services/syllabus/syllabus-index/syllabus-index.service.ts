import { inject, Injectable } from '@angular/core';
import { SyllabusRepository } from '../../../domain/repositories/syllabus.repository';
import { AvailableSyllabus, IdMapUtil } from '../../../shared/utils/id-map.utils';
import { map, Observable, shareReplay } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SyllabusIndexService {
  private repo = inject(SyllabusRepository);

  private idMap$?: Observable<AvailableSyllabus>;

  getIdMap$(): Observable<AvailableSyllabus> {
    if (this.idMap$) return this.idMap$;

    this.idMap$ = this.repo.loadIndex().pipe(
      map((index) => (index ? IdMapUtil.buildAvailableSyllabus(index) : {})),
      shareReplay({ bufferSize: 1, refCount: true }),
    );

    return this.idMap$;
  }
}
