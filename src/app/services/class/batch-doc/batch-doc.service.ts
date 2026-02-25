import { Injectable, inject, signal } from '@angular/core';
import { Observable, shareReplay, map, tap, of } from 'rxjs';
import {
  FireResponse,
  FirestoreDocService,
} from '../../../core/services/fire/firestore-doc.service';
import { BatchDoc } from '../../../models/batch/batch-doc.model';
import { CACHE_TTL } from '../../../core/constants/app.constants';

@Injectable({ providedIn: 'root' })
export class ClassBatchDocService {
  private fs = inject(FirestoreDocService);

  private cache = new Map<string, Observable<BatchDoc | null>>();
  private memory = signal<Record<string, { data: BatchDoc; ts: number }>>({});

  private readonly ttl = CACHE_TTL.BATCH_DOC;
  private readonly basePath = 'classes';

  private path(classId: string) {
    return `${this.basePath}/${classId}/batches`;
  }

  private isValid(key: string): boolean {
    const entry = this.memory()[key];
    if (!entry) return false;
    return Date.now() - entry.ts < this.ttl;
  }

  // ---------- SINGLE DOC ----------
  getOnce(classId: string, batchId: string): Observable<BatchDoc | null> {
    const key = `${classId}-${batchId}`;

    if (this.isValid(key)) {
      return of(this.memory()[key].data);
    }

    if (this.cache.has(key)) return this.cache.get(key)!;

    const req$ = this.fs.getOnce<BatchDoc>(this.path(classId), batchId).pipe(
      map((r: FireResponse<BatchDoc>) => (r.ok && r.data ? (r.data as BatchDoc) : null)),
      tap((doc) => {
        if (!doc) return;
        this.memory.update((m) => ({
          ...m,
          [key]: { data: doc, ts: Date.now() },
        }));
      }),
      shareReplay({ bufferSize: 1, refCount: false }),
    );

    this.cache.set(key, req$);
    return req$;
  }

  // ---------- REALTIME ----------
  listen(classId: string, batchId: string): Observable<BatchDoc | null> {
    const liveKey = `live-${classId}-${batchId}`;
    const memKey = `${classId}-${batchId}`;

    if (this.cache.has(liveKey)) return this.cache.get(liveKey)!;

    const req$ = this.fs.listen<BatchDoc>(this.path(classId), batchId).pipe(
      map((r: FireResponse<BatchDoc>) => (r.ok && r.data ? (r.data as BatchDoc) : null)),
      tap((doc) => {
        if (!doc) return;
        this.memory.update((m) => ({
          ...m,
          [memKey]: { data: doc, ts: Date.now() },
        }));
      }),
      shareReplay({ bufferSize: 1, refCount: true }),
    );

    this.cache.set(liveKey, req$);
    return req$;
  }

  // ---------- MEMORY FIRST ----------
  get(classId: string, batchId: string): Observable<BatchDoc | null> {
    const key = `${classId}-${batchId}`;

    if (this.isValid(key)) {
      return of(this.memory()[key].data);
    }

    return this.getOnce(classId, batchId);
  }

  // ---------- MUTATIONS ----------
  set(classId: string, doc: BatchDoc) {
    return this.fs.set(this.path(classId), doc.id, doc);
  }

  update(classId: string, batchId: string, data: Partial<BatchDoc>) {
    return this.fs.update(this.path(classId), batchId, data);
  }

  delete(classId: string, batchId: string) {
    return this.fs.delete(this.path(classId), batchId);
  }

  // ---------- CACHE CLEAR ----------
  clear(classId?: string, batchId?: string) {
    if (classId && batchId) {
      const key = `${classId}-${batchId}`;
      this.cache.delete(key);
      this.cache.delete(`live-${key}`);
      this.memory.update((m) => {
        const { [key]: _, ...rest } = m;
        return rest;
      });
      return;
    }

    if (classId) {
      [...this.cache.keys()]
        .filter((k) => k.includes(classId))
        .forEach((k) => this.cache.delete(k));

      this.memory.update((m) => {
        const filtered = Object.fromEntries(
          Object.entries(m).filter(([k]) => !k.startsWith(classId)),
        );
        return filtered;
      });
      return;
    }

    this.cache.clear();
    this.memory.set({});
  }
}
