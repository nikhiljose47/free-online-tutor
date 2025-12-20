import { ResolveFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, of, tap } from 'rxjs';
import { ClassSyllabus } from '../models/syllabus.model';
import { UiStateUtil } from '../utils/ui-state.utils';

export const syllabusResolver: ResolveFn<ClassSyllabus | null> = () => {
  const http = inject(HttpClient);
  const router = inject(Router);
  const uiState = inject(UiStateUtil);

  return http.get<ClassSyllabus>('data/ga-syllabus.json').pipe(
    tap((data) => uiState.set<ClassSyllabus>('syllabus', data)),
    catchError((err) => {
      console.error('Syllabus load failed', err);
      router.navigate(['/error']); // or fallback route
      return of(null);
    })
  );
};
