import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, of, shareReplay, tap } from 'rxjs';
import { LearnTubeModel } from '../../models/learn-tube/learn-tube.model';

@Injectable({ providedIn: 'root' })
export class LearnTubeFetchService {
  private http = inject(HttpClient);

  private cache = new Map<string, any>();
  loading = signal(false);

  getById(id: string) {
    if (this.cache.has(id)) return this.cache.get(id);

    this.loading.set(true);

    const req$ = this.http
      .get<LearnTubeModel>(`learntube/learntube-${id}.json`)
      .pipe(
        tap(() => this.loading.set(false)),
        shareReplay(1),
        catchError(() => {
          this.loading.set(false);
          return of(null);
        })
      );

    this.cache.set(id, req$);
    return req$;
  }
}