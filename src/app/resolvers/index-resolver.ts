import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, of, tap } from 'rxjs';
import { UiStateUtil } from '../utils/ui-state.utils';
import { SyllabusIndex } from '../models/syllabus-index.model';

/* ===============================
   MODELS
================================ */


/* ===============================
   RESOLVER
================================ */
export const syllabusIndexResolver: ResolveFn<SyllabusIndex | null> = () => {
  const http = inject(HttpClient);
  const router = inject(Router);
  const uiState = inject(UiStateUtil);

  return http.get<SyllabusIndex>('data/syllabus-index.json').pipe(
    tap((data) => {
      uiState.set<SyllabusIndex>('syllabusIndex', data);
    }),
    catchError((err) => {
      console.error('Syllabus index load failed', err);
      router.navigate(['/error']); // hard fail – config is mandatory
      return of(null);
    }),
  );
};
