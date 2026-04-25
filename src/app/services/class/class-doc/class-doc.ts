import { Injectable, inject, signal } from '@angular/core';
import { Observable, shareReplay, map, tap, of, startWith, retry, take } from 'rxjs';
import {
  FireResponse,
  FirestoreDocService,
} from '../../../core/services/fire/firestore-doc.service';
import { ClassDoc } from '../../../models/classes/class-doc.model';

@Injectable({ providedIn: 'root' })
export class ClassDocService {
  private fs = inject(FirestoreDocService);

  private cache = new Map<string, Observable<ClassDoc | null>>();
  private memory = signal<Record<string, ClassDoc>>({});

  private path = 'classes';

  private isValid(doc: unknown): doc is ClassDoc {
    return !!doc && !Array.isArray(doc);
  }

  // ---------- SINGLE DOC ----------
  getOnce(classId: string): Observable<ClassDoc | null> {
    const mem = this.memory()[classId];

    if (this.cache.has(classId)) return this.cache.get(classId)!;

    const req$ = this.fs.getOnce<ClassDoc>(this.path, classId).pipe(
      map((r: FireResponse<ClassDoc>) => (r.ok && this.isValid(r.data) ? r.data : null)),
      retry({ count: 2, delay: 500 }),
      tap((doc) => {
        if (!this.isValid(doc)) return;
        this.memory.update((m) => ({ ...m, [classId]: doc }));
      }),
      mem ? startWith(mem) : (o) => o,
      shareReplay({ bufferSize: 1, refCount: true }),
    );

    this.cache.set(classId, req$);
    return req$;
  }

  // ---------- REALTIME ----------
  listen(classId: string): Observable<ClassDoc | null> {
    const key = `live-${classId}`;
    if (this.cache.has(key)) return this.cache.get(key)!;

    const req$ = this.fs.listen<ClassDoc>(this.path, classId).pipe(
      map((r: FireResponse<ClassDoc>) => (r.ok && this.isValid(r.data) ? r.data : null)),
      tap((doc) => {
        if (!this.isValid(doc)) return;
        this.memory.update((m) => ({ ...m, [classId]: doc }));
      }),
      shareReplay({ bufferSize: 1, refCount: true }),
    );

    this.cache.set(key, req$);
    return req$;
  }

  // ---------- FAST ----------
  getFast(classId: string): Observable<ClassDoc | null> {
    const mem = this.memory()[classId];
    if (mem) return of(mem);
    return this.listen(classId).pipe(take(1));
  }

  // ---------- MEMORY FIRST ----------
  get(classId: string): Observable<ClassDoc | null> {
    const mem = this.memory()[classId];
    if (mem) return of(mem);
    return this.getOnce(classId);
  }

  // ---------- MUTATIONS ----------
  set(doc: ClassDoc) {
    this.memory.update((m) => ({ ...m, [doc.classId]: doc }));
    return this.fs.set(this.path, doc.classId, doc);
  }

  update(classId: string, data: Partial<ClassDoc>) {
    this.memory.update((m) => {
      const existing = m[classId];
      if (!existing) return m;
      return { ...m, [classId]: { ...existing, ...data } };
    });
    return this.fs.update(this.path, classId, data);
  }

  delete(classId: string) {
    this.memory.update((m) => {
      const { [classId]: _, ...rest } = m;
      return rest;
    });
    return this.fs.delete(this.path, classId);
  }

  // ---------- CACHE CLEAR ----------
  clear(classId?: string) {
    if (classId) {
      this.cache.delete(classId);
      this.cache.delete(`live-${classId}`);
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
