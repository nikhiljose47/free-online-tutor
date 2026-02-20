import { Injectable, inject, signal } from '@angular/core';
import { Observable, shareReplay, map, tap, of } from 'rxjs';
import { FireResponse, FirestoreDocService } from '../../../core/services/fire/firestore-doc.service';
import { ClassDoc } from '../../../models/classes/class-doc.model';

@Injectable({ providedIn: 'root' })
export class ClassDocService {

  private fs = inject(FirestoreDocService);

  private cache = new Map<string, Observable<ClassDoc | null>>();
  private memory = signal<Record<string, ClassDoc>>({});

  private path = 'classes';

  // ---------- SINGLE DOC (NO REALTIME) ----------
  getOnce(classId: string): Observable<ClassDoc | null> {
    const existing = this.memory()[classId];
    if (existing) return of(existing);

    if (this.cache.has(classId)) return this.cache.get(classId)!;

    const req$ = this.fs.getOnce<ClassDoc>(this.path, classId).pipe(
      map((r: FireResponse<ClassDoc>) =>
        r.ok && r.data ? (r.data as ClassDoc) : null
      ),
      tap((doc) => {
        if (!doc) return;
        this.memory.update(m => ({ ...m, [classId]: doc }));
      }),
      shareReplay({ bufferSize: 1, refCount: false })
    );

    this.cache.set(classId, req$);
    return req$;
  }

  // ---------- REALTIME DOC ----------
  listen(classId: string): Observable<ClassDoc | null> {
    const key = `live-${classId}`;
    if (this.cache.has(key)) return this.cache.get(key)!;

    const req$ = this.fs.listen<ClassDoc>(this.path, classId).pipe(
      map((r: FireResponse<ClassDoc>) =>
        r.ok && r.data ? (r.data as ClassDoc) : null
      ),
      tap((doc) => {
        if (!doc) return;
        this.memory.update(m => ({ ...m, [classId]: doc }));
      }),
      shareReplay({ bufferSize: 1, refCount: true })
    );

    this.cache.set(key, req$);
    return req$;
  }

  // ---------- MEMORY FIRST ----------
  get(classId: string): Observable<ClassDoc | null> {
    const mem = this.memory()[classId];
    if (mem) return of(mem);
    return this.getOnce(classId);
  }

  // ---------- MUTATIONS ----------
  set(doc: ClassDoc) {
    return this.fs.set(this.path, doc.classId, doc);
  }

  update(classId: string, data: Partial<ClassDoc>) {
    return this.fs.update(this.path, classId, data);
  }

  delete(classId: string) {
    return this.fs.delete(this.path, classId);
  }

  // ---------- CACHE CLEAR ----------
  clear(classId?: string) {
    if (classId) {
      this.cache.delete(classId);
      this.cache.delete(`live-${classId}`);
      this.memory.update(m => {
        const { [classId]: _, ...rest } = m;
        return rest;
      });
      return;
    }
    this.cache.clear();
    this.memory.set({});
  }
}
