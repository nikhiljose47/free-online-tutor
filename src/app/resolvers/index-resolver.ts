import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, of, tap } from 'rxjs';
import { UiStateUtil } from '../utils/ui-state.utils';

/* ===============================
   MODELS
================================ */
export interface SyllabusIndex {
  version: string;
  generatedAt: string;

  classes: {
    id: string;
    label: string;
    enabled: boolean;
    ready: boolean;
    priority: number;
    availableFrom: string;
    fileName: string;
    meta: {
      students: number;
      teachers: number;
      medium: string[];
      image: string;
    };
  }[];

  jamSessions: {
    id: string;
    title: string;
    enabled: boolean;
    isLive: boolean;
    startsAt: string;
    priority: number;
    fileName: string;
    meta: {
      teacher: string;
      language: string[];
      image: string;
    };
  }[];

  activities: {
    id: string;
    title: string;
    enabled: boolean;
    startsAt: string;
    priority: number;
    fileName: string;

    meta: {
      teacher: string;
      image: string;
    };
  }[];
}

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
