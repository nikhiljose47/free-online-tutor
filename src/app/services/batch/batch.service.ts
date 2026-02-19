import { Injectable, inject, signal } from '@angular/core';
import { Observable, shareReplay, map, tap, of } from 'rxjs';
import { Timestamp } from '@angular/fire/firestore';
import { FireResponse, FirestoreDocService } from '../../core/services/fire/firestore-doc.service';
import { Batch } from '../../models/batch/batch.model';


@Injectable({ providedIn: 'root' })
export class BatchService {
  private fs = inject(FirestoreDocService);

  private onceCache = new Map<string, Observable<Batch | null>>();
  private rtCache = new Map<string, Observable<Batch | null>>();

  private memory = signal<Record<string, Batch>>({});

  private path = 'batches';

  // ---------- SINGLE DOC (NO REALTIME) ----------
  getOnce(classId: string): Observable<Batch | null> {
    const mem = this.memory()[classId];
    if (mem) return of(mem);

    if (this.onceCache.has(classId)) return this.onceCache.get(classId)!;

    const req$ = this.fs.getOnce<Batch>(this.path, classId).pipe(
      map((r: FireResponse<Batch>) => (r.ok && r.data ? (r.data as Batch) : null)),
      tap((batch) => {
        if (!batch) return;
        this.memory.update((m) => ({ ...m, [classId]: batch }));
      }),
      shareReplay({ bufferSize: 1, refCount: false }),
    );

    this.onceCache.set(classId, req$);
    return req$;
  }

  // ---------- REALTIME DOC ----------
  listen(classId: string): Observable<Batch | null> {
    if (this.rtCache.has(classId)) return this.rtCache.get(classId)!;

    const req$ = this.fs.listen<Batch>(this.path, classId).pipe(
      map((r: FireResponse<Batch>) => (r.ok && r.data ? (r.data as Batch) : null)),
      tap((batch) => {
        if (!batch) return;
        this.memory.update((m) => ({ ...m, [classId]: batch }));
      }),
      shareReplay({ bufferSize: 1, refCount: true }),
    );

    this.rtCache.set(classId, req$);
    return req$;
  }

  // ---------- HYBRID ----------
  get(classId: string): Observable<Batch | null> {
    const mem = this.memory()[classId];
    if (mem) return of(mem);
    return this.listen(classId);
  }

  // ---------- MUTATIONS ----------
  set(classId: string, batch: Batch) {
    return this.fs.set(this.path, classId, batch);
  }

  update(classId: string, data: Partial<Batch>) {
    return this.fs.update(this.path, classId, data);
  }

  delete(classId: string) {
    return this.fs.delete(this.path, classId);
  }

  // ---------- CACHE CLEAR ----------
  clear(classId?: string) {
    if (classId) {
      this.onceCache.delete(classId);
      this.rtCache.delete(classId);

      this.memory.update((m) => {
        const { [classId]: _, ...rest } = m;
        return rest;
      });
      return;
    }

    this.onceCache.clear();
    this.rtCache.clear();
    this.memory.set({});
  }
}