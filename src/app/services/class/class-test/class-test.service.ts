import { Injectable, inject, signal } from '@angular/core';
import { Observable, shareReplay, map, tap, of } from 'rxjs';
import { ClassTest } from '../../../models/classes/class-test.model';
import { FireResponse, FirestoreDocService } from '../../fire/firestore-doc.service';

@Injectable({ providedIn: 'root' })
export class ClassTestService {
  private fs = inject(FirestoreDocService);

  private listCache = new Map<string, Observable<ClassTest[]>>();
  private docCache = new Map<string, Observable<ClassTest | null>>();

  private memory = signal<Record<string, ClassTest[]>>({});

  private path = 'classes';

  // ---------- SINGLE DOC (NO REALTIME) ----------
  getOnce(classId: string, testId: string): Observable<ClassTest | null> {
    const existing = this.memory()[classId]?.find((t) => t.testId === testId);
    if (existing) return of(existing);

    const key = `${classId}-${testId}`;
    if (this.docCache.has(key)) return this.docCache.get(key)!;

    const req$ = this.fs.getOnce<ClassTest>(`${this.path}/${classId}/tests`, testId).pipe(
      map((r: FireResponse<ClassTest>) => (r.ok && r.data ? (r.data as ClassTest) : null)),
      tap((test) => {
        if (!test) return;

        this.memory.update((m) => {
          const list = m[classId] ?? [];
          const filtered = list.filter((t) => t.testId !== test.testId);
          return { ...m, [classId]: [...filtered, test] };
        });
      }),
      shareReplay({ bufferSize: 1, refCount: false }),
    );

    this.docCache.set(key, req$);
    return req$;
  }

  // ---------- REALTIME ALL ----------
  getAll(classId: string): Observable<ClassTest[]> {
    if (this.listCache.has(classId)) return this.listCache.get(classId)!;

    const req$ = this.fs.listenAll<ClassTest>(`${this.path}/${classId}/tests`).pipe(
      map((r: FireResponse<ClassTest>) => (r.ok && r.data ? (r.data as ClassTest[]) : [])),
      tap((arr) => this.memory.update((m) => ({ ...m, [classId]: arr }))),
      shareReplay({ bufferSize: 1, refCount: true }),
    );

    this.listCache.set(classId, req$);
    return req$;
  }

  getWhere(
    classId: string,
    field: keyof ClassTest,
    op: any,
    value: any,
    limitTo = 50,
  ): Observable<ClassTest[]> {
    const key = `where-${classId}-${String(field)}-${value}`;
    if (this.listCache.has(key)) return this.listCache.get(key)!;

    const req$ = this.fs
      .realtimeWhere<ClassTest>(
        `${this.path}/${classId}/tests`,
        field as string,
        op,
        value,
        limitTo,
      )
      .pipe(
        map((r: FireResponse<ClassTest>) => (r.ok && r.data ? (r.data as ClassTest[]) : [])),
        shareReplay({ bufferSize: 1, refCount: true }),
      );

    this.listCache.set(key, req$);
    return req$;
  }

  // ---------- FILTERED ONCE ----------
  getWhereOnce(
    classId: string,
    field: keyof ClassTest,
    op: any,
    value: any,
    limitTo = 50,
  ): Observable<ClassTest[]> {
    const key = `once-where-${classId}-${String(field)}-${value}`;
    if (this.listCache.has(key)) return this.listCache.get(key)!;

    const req$ = this.fs
      .where<ClassTest>(`${this.path}/${classId}/tests`, field as string, op, value, limitTo)
      .pipe(
        map((r: FireResponse<ClassTest>) => (r.ok && r.data ? (r.data as ClassTest[]) : [])),
        shareReplay({ bufferSize: 1, refCount: false }),
      );

    this.listCache.set(key, req$);
    return req$;
  }

  // ---------- HYBRID ----------
  get(classId: string): Observable<ClassTest[]> {
    const mem = this.memory()[classId];
    if (mem) return of(mem);
    return this.getAll(classId);
  }

  // ---------- MUTATIONS ----------
  set(classId: string, test: ClassTest) {
    return this.fs.set(`${this.path}/${classId}/tests`, test.testId, test);
  }

  update(classId: string, testId: string, data: Partial<ClassTest>) {
    return this.fs.update(`${this.path}/${classId}/tests`, testId, data);
  }

  delete(classId: string, testId: string) {
    return this.fs.delete(`${this.path}/${classId}/tests`, testId);
  }

  // ---------- CACHE CLEAR ----------
  clear(classId?: string) {
    if (classId) {
      this.listCache.delete(classId);

      for (const key of this.docCache.keys()) {
        if (key.startsWith(classId + '-')) this.docCache.delete(key);
      }

      this.memory.update((m) => {
        const { [classId]: _, ...rest } = m;
        return rest;
      });
      return;
    }

    this.listCache.clear();
    this.docCache.clear();
    this.memory.set({});
  }
}
