import { Injectable, inject, signal } from '@angular/core';
import { Observable, shareReplay, map, tap, of, startWith, retry, take } from 'rxjs';
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

  private key(classId: string, batchId: string) {
    return `${classId}-${batchId}`;
  }

  private isValid(k: string) {
    const e = this.memory()[k];
    return !!e && Date.now() - e.ts < this.ttl;
  }

  private extract(doc: BatchDoc | BatchDoc[] | null): BatchDoc | null {
    if (!doc) return null;
    return Array.isArray(doc) ? (doc[0] ?? null) : doc;
  }

  // ---------- GET ONCE ----------
  getOnce(classId: string, batchId: string): Observable<BatchDoc | null> {
    const k = this.key(classId, batchId);
    const mem = this.memory()[k]?.data;

    if (this.isValid(k)) return of(mem);

    if (this.cache.has(k)) return this.cache.get(k)!;

    const req$ = this.fs.getOnce<BatchDoc>(this.path(classId), batchId).pipe(
      map((r: FireResponse<BatchDoc>) => (r.ok ? this.extract(r.data) : null)),
      retry({ count: 2, delay: 500 }),
      tap((doc) => {
        if (!doc) return;
        this.memory.update((m) => ({
          ...m,
          [k]: { data: doc, ts: Date.now() },
        }));
      }),
      mem ? startWith(mem) : (o) => o,
      shareReplay({ bufferSize: 1, refCount: true }),
    );

    this.cache.set(k, req$);
    return req$;
  }

  // ---------- REALTIME ----------
  listen(classId: string, batchId: string): Observable<BatchDoc | null> {
    const k = this.key(classId, batchId);
    const liveKey = `live-${k}`;

    if (this.cache.has(liveKey)) return this.cache.get(liveKey)!;

    const req$ = this.fs.listen<BatchDoc>(this.path(classId), batchId).pipe(
      map((r: FireResponse<BatchDoc>) => (r.ok ? this.extract(r.data) : null)),
      tap((doc) => {
        if (!doc) return;
        this.memory.update((m) => ({
          ...m,
          [k]: { data: doc, ts: Date.now() },
        }));
      }),
      shareReplay({ bufferSize: 1, refCount: true }),
    );

    this.cache.set(liveKey, req$);
    return req$;
  }

  // ---------- FAST ----------
  getFast(classId: string, batchId: string): Observable<BatchDoc | null> {
    const k = this.key(classId, batchId);
    const mem = this.memory()[k]?.data;
    if (mem) return of(mem);
    return this.listen(classId, batchId).pipe(take(1));
  }

  // ---------- MEMORY FIRST ----------
  get(classId: string, batchId: string): Observable<BatchDoc | null> {
    const k = this.key(classId, batchId);
    if (this.isValid(k)) return of(this.memory()[k].data);
    return this.getOnce(classId, batchId);
  }

  // ---------- MUTATIONS ----------
  set(classId: string, doc: BatchDoc) {
    const k = this.key(classId, doc.id);

    this.memory.update((m) => ({
      ...m,
      [k]: { data: doc, ts: Date.now() },
    }));

    return this.fs.set(this.path(classId), doc.id, doc);
  }

  update(classId: string, batchId: string, data: Partial<BatchDoc>) {
    const k = this.key(classId, batchId);

    this.memory.update((m) => {
      const e = m[k];
      if (!e) return m;
      return {
        ...m,
        [k]: { data: { ...e.data, ...data }, ts: Date.now() },
      };
    });

    return this.fs.update(this.path(classId), batchId, data);
  }

  delete(classId: string, batchId: string) {
    const k = this.key(classId, batchId);

    this.memory.update((m) => {
      const { [k]: _, ...rest } = m;
      return rest;
    });

    this.cache.delete(k);
    this.cache.delete(`live-${k}`);

    return this.fs.delete(this.path(classId), batchId);
  }

  // ---------- CLEAR ----------
  clear(classId?: string, batchId?: string) {
    if (classId && batchId) {
      const k = this.key(classId, batchId);
      this.cache.delete(k);
      this.cache.delete(`live-${k}`);
      this.memory.update((m) => {
        const { [k]: _, ...rest } = m;
        return rest;
      });
      return;
    }

    if (classId) {
      [...this.cache.keys()]
        .filter((k) => k.includes(classId))
        .forEach((k) => this.cache.delete(k));

      this.memory.update((m) =>
        Object.fromEntries(Object.entries(m).filter(([k]) => !k.startsWith(classId))),
      );
      return;
    }

    this.cache.clear();
    this.memory.set({});
  }
}
