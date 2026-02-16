import { Injectable, inject, signal } from '@angular/core';
import { Observable, shareReplay, map, tap, of } from 'rxjs';
import { ClassSubject } from '../../../models/classes/class-subject.model';
import { FireResponse, FirestoreDocService } from '../../fire/firestore-doc.service';

@Injectable({ providedIn: 'root' })
export class ClassSubjectService {
  private fs = inject(FirestoreDocService);

  private cache = new Map<string, Observable<ClassSubject[]>>();
  private docCache = new Map<string, Observable<ClassSubject | null>>();

  private memory = signal<Record<string, ClassSubject[]>>({});

  private path = 'classes';

  // ---------- SINGLE DOC (NO REALTIME) ----------
  getOnce(classId: string, subjectId: string): Observable<ClassSubject | null> {
    const existing = this.memory()[classId]?.find((s) => s.id === subjectId);
    if (existing) return of(existing);

    const key = `${classId}-${subjectId}`;
    if (this.docCache.has(key)) return this.docCache.get(key)!;

    const req$ = this.fs.getOnce<ClassSubject>(`${this.path}/${classId}/subjects`, subjectId).pipe(
      map((r: FireResponse<ClassSubject>) => (r.ok && r.data ? (r.data as ClassSubject) : null)),
      tap((subject) => {
        if (!subject) return;

        this.memory.update((m) => {
          const list = m[classId] ?? [];
          const filtered = list.filter((s) => s.id !== subject.id);
          return { ...m, [classId]: [...filtered, subject] };
        });
      }),
      shareReplay({ bufferSize: 1, refCount: false }),
    );

    this.docCache.set(key, req$);
    return req$;
  }

  // ---------- REALTIME ALL ----------
  getAll(classId: string): Observable<ClassSubject[]> {
    if (this.cache.has(classId)) return this.cache.get(classId)!;

    const req$ = this.fs.listenAll<ClassSubject>(`${this.path}/${classId}/subjects`).pipe(
      map((r: FireResponse<ClassSubject>) => (r.ok && r.data ? (r.data as ClassSubject[]) : [])),
      tap((arr) => this.memory.update((m) => ({ ...m, [classId]: arr }))),
      shareReplay({ bufferSize: 1, refCount: true }),
    );

    this.cache.set(classId, req$);
    return req$;
  }

  getWhere(
    classId: string,
    field: keyof ClassSubject,
    op: any,
    value: any,
    limitTo = 50,
  ): Observable<ClassSubject[]> {
    const key = `where-${classId}-${String(field)}-${value}`;
    if (this.cache.has(key)) return this.cache.get(key)!;

    const req$ = this.fs
      .realtimeWhere<ClassSubject>(
        `${this.path}/${classId}/subjects`,
        field as string,
        op,
        value,
        limitTo,
      )
      .pipe(
        map((r: FireResponse<ClassSubject>) => (r.ok && r.data ? (r.data as ClassSubject[]) : [])),
        shareReplay({ bufferSize: 1, refCount: true }),
      );

    this.cache.set(key, req$);
    return req$;
  }

  // ---------- FILTERED ONCE ----------
  getWhereOnce(
    classId: string,
    field: keyof ClassSubject,
    op: any,
    value: any,
    limitTo = 50,
  ): Observable<ClassSubject[]> {
    const key = `once-where-${classId}-${String(field)}-${value}`;
    if (this.cache.has(key)) return this.cache.get(key)!;

    const req$ = this.fs
      .where<ClassSubject>(`${this.path}/${classId}/subjects`, field as string, op, value, limitTo)
      .pipe(
        map((r: FireResponse<ClassSubject>) => (r.ok && r.data ? (r.data as ClassSubject[]) : [])),
        shareReplay({ bufferSize: 1, refCount: false }),
      );

    this.cache.set(key, req$);
    return req$;
  }
  
  // ---------- HYBRID (MEMORY → REALTIME) ----------
  get(classId: string): Observable<ClassSubject[]> {
    const mem = this.memory()[classId];
    if (mem) return of(mem);
    return this.getAll(classId);
  }

  // ---------- MUTATIONS ----------
  set(classId: string, subject: ClassSubject) {
    return this.fs.set(`${this.path}/${classId}/subjects`, subject.id, subject);
  }

  update(classId: string, subjectId: string, data: Partial<ClassSubject>) {
    return this.fs.update(`${this.path}/${classId}/subjects`, subjectId, data);
  }

  delete(classId: string, subjectId: string) {
    return this.fs.delete(`${this.path}/${classId}/subjects`, subjectId);
  }

  // ---------- CACHE CLEAR ----------
  clear(classId?: string) {
    if (classId) {
      this.cache.delete(classId);
      this.memory.update((m) => {
        const { [classId]: _, ...rest } = m;
        return rest;
      });
      return;
    }
    this.cache.clear();
    this.memory.set({});
  }
}
