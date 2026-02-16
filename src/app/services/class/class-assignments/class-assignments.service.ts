import { Injectable, inject, signal } from '@angular/core';
import { Observable, shareReplay, map, tap, of } from 'rxjs';
import { FireResponse, FirestoreDocService } from '../../fire/firestore-doc.service';
import { ClassAssignment } from '../../../models/classes/class-assignment.model';

@Injectable({ providedIn: 'root' })
export class ClassAssignmentsService {
  private fs = inject(FirestoreDocService);

  private listCache = new Map<string, Observable<ClassAssignment[]>>();
  private docCache = new Map<string, Observable<ClassAssignment | null>>();

  private memory = signal<Record<string, ClassAssignment[]>>({});

  private path = 'classes';

  // ---------- SINGLE DOC (NO REALTIME) ----------
  getOnce(classId: string, assignmentId: string): Observable<ClassAssignment | null> {
    const existing = this.memory()[classId]?.find((a) => a.assignmentId === assignmentId);
    if (existing) return of(existing);

    const key = `${classId}-${assignmentId}`;
    if (this.docCache.has(key)) return this.docCache.get(key)!;

    const req$ = this.fs
      .getOnce<ClassAssignment>(`${this.path}/${classId}/assignments`, assignmentId)
      .pipe(
        map((r: FireResponse<ClassAssignment>) =>
          r.ok && r.data ? (r.data as ClassAssignment) : null,
        ),
        tap((assignment) => {
          if (!assignment) return;

          this.memory.update((m) => {
            const list = m[classId] ?? [];
            const filtered = list.filter((a) => a.assignmentId !== assignment.assignmentId);
            return { ...m, [classId]: [...filtered, assignment] };
          });
        }),
        shareReplay({ bufferSize: 1, refCount: false }),
      );

    this.docCache.set(key, req$);
    return req$;
  }

  // ---------- REALTIME ALL ----------
  getAll(classId: string): Observable<ClassAssignment[]> {
    if (this.listCache.has(classId)) return this.listCache.get(classId)!;

    const req$ = this.fs.listenAll<ClassAssignment>(`${this.path}/${classId}/assignments`).pipe(
      map((r: FireResponse<ClassAssignment>) =>
        r.ok && r.data ? (r.data as ClassAssignment[]) : [],
      ),
      tap((arr) => this.memory.update((m) => ({ ...m, [classId]: arr }))),
      shareReplay({ bufferSize: 1, refCount: true }),
    );

    this.listCache.set(classId, req$);
    return req$;
  }

  getWhereOnce(
    classId: string,
    field: keyof ClassAssignment,
    op: any,
    value: any,
    limitTo = 50,
  ): Observable<ClassAssignment[]> {
    const key = `once-where-${classId}-${String(field)}-${value}`;

    if (this.listCache.has(key)) return this.listCache.get(key)!;

    const req$ = this.fs
      .where<ClassAssignment>(
        `${this.path}/${classId}/assignments`,
        field as string,
        op,
        value,
        limitTo,
      )
      .pipe(
        map((r: FireResponse<ClassAssignment>) =>
          r.ok && r.data ? (r.data as ClassAssignment[]) : [],
        ),
        shareReplay({ bufferSize: 1, refCount: false }),
      );

    this.listCache.set(key, req$);
    return req$;
  }

  getWhere(
    classId: string,
    field: keyof ClassAssignment,
    op: any,
    value: any,
    limitTo = 50,
  ): Observable<ClassAssignment[]> {
    const key = `where-${classId}-${String(field)}-${value}`;

    if (this.listCache.has(key)) return this.listCache.get(key)!;

    const req$ = this.fs
      .realtimeWhere<ClassAssignment>(
        `${this.path}/${classId}/assignments`,
        field as string,
        op,
        value,
        limitTo,
      )
      .pipe(
        map((r: FireResponse<ClassAssignment>) =>
          r.ok && r.data ? (r.data as ClassAssignment[]) : [],
        ),
        shareReplay({ bufferSize: 1, refCount: true }),
      );

    this.listCache.set(key, req$);
    return req$;
  }

  // ---------- HYBRID ----------
  get(classId: string): Observable<ClassAssignment[]> {
    const mem = this.memory()[classId];
    if (mem) return of(mem);
    return this.getAll(classId);
  }

  // ---------- MUTATIONS ----------
  set(classId: string, assignment: ClassAssignment) {
    return this.fs.set(`${this.path}/${classId}/assignments`, assignment.assignmentId, assignment);
  }

  update(classId: string, assignmentId: string, data: Partial<ClassAssignment>) {
    return this.fs.update(`${this.path}/${classId}/assignments`, assignmentId, data);
  }

  delete(classId: string, assignmentId: string) {
    return this.fs.delete(`${this.path}/${classId}/assignments`, assignmentId);
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
