import { Injectable, signal } from '@angular/core';
import { Observable, of, tap, map } from 'rxjs';
import { FireResponse, FirestoreDocService } from '../fire/firestore-doc.service';

interface CacheState {
  docs: Record<string, any>;        // key = "path/id"
  collections: Record<string, any>; // key = "path"
  queries: Record<string, any>;     // key = custom query key
}

@Injectable({ providedIn: 'root' })
export class DataStoreService {
  private cache = signal<CacheState>({
    docs: {},
    collections: {},
    queries: {}
  });

  constructor(private fire: FirestoreDocService) {}

  // --------------------------------------------------
  // ⭐ Helper: Build a unique cache key for doc
  // --------------------------------------------------
  private docKey(path: string, id: string) {
    return `${path}/${id}`;
  }

  // --------------------------------------------------
  // ⭐ GET DOCUMENT (cached + fallback to Firestore)
  // --------------------------------------------------
  getDoc<T>(path: string, id: string): Observable<FireResponse<T>> {
    const key = this.docKey(path, id);
    const existing = this.cache().docs[key];

    if (existing) {
      return of({ ok: true, data: existing });
    }

    return this.fire.getOnce<T>(path, id).pipe(
      tap(res => {
        if (res.ok && res.data) {
          this.cache.update(c => ({
            ...c,
            docs: { ...c.docs, [key]: res.data }
          }));
        }
      }),
      map(res => ({
        ok: res.ok,
        data: res.data ?? null,
        message: res.message ?? null
      }))
    );
  }

  // --------------------------------------------------
  // ⭐ GET COLLECTION (cached + fallback)
  // --------------------------------------------------
  getCollection<T>(path: string): Observable<FireResponse<T>> {
    const existing = this.cache().collections[path];

    if (existing) {
      return of({ ok: true, data: existing });
    }

    return this.fire.getAllOnce<T>(path).pipe(
      tap(res => {
        if (res.ok && res.data) {
          this.cache.update(c => ({
            ...c,
            collections: { ...c.collections, [path]: res.data }
          }));
        }
      }),
      map(res => ({
        ok: res.ok,
        data: res.data ?? null,
        message: res.message ?? null
      }))
    );
  }

  // --------------------------------------------------
  // ⭐ WHERE QUERY (with caching)
  // --------------------------------------------------
  where<T>(
    path: string,
    field: string,
    op: any,
    value: any,
    limitTo = 50
  ): Observable<FireResponse<T>> {
    const key = `${path}|${field}|${op}|${value}`;

    const existing = this.cache().queries[key];
    if (existing) return of({ ok: true, data: existing });

    return this.fire.where<T>(path, field, op, value, limitTo).pipe(
      tap(res => {
        if (res.ok && res.data) {
          this.cache.update(c => ({
            ...c,
            queries: { ...c.queries, [key]: res.data }
          }));
        }
      }),
      map(res => ({
        ok: res.ok,
        data: res.data ?? null,
        message: res.message ?? null
      }))
    );
  }

  // --------------------------------------------------
  // ⭐ MULTI-WHERE (cached)
  // --------------------------------------------------
  multiWhere<T>(
    path: string,
    conditions: { field: string; op: any; value: any }[],
  ) {
    const key = `${path}|${JSON.stringify(conditions)}`;

    const existing = this.cache().queries[key];
    if (existing) return of({ ok: true, data: existing });

    return this.fire.multiWhere<T>(path, conditions).pipe(
      tap(res => {
        if (res.ok && res.data) {
          this.cache.update(c => ({
            ...c,
            queries: { ...c.queries, [key]: res.data }
          }));
        }
      }),
      map(res => ({
        ok: res.ok,
        data: res.data ?? null,
        message: res.message ?? null
      }))
    );
  }

  // --------------------------------------------------
  // ⭐ CLEAR CACHE
  // --------------------------------------------------
  clearAll() {
    this.cache.set({ docs: {}, collections: {}, queries: {} });
  }

  clearDoc(path: string, id: string) {
    const key = this.docKey(path, id);
    this.cache.update(c => {
      delete c.docs[key];
      return { ...c };
    });
  }

  clearCollection(path: string) {
    this.cache.update(c => {
      delete c.collections[path];
      return { ...c };
    });
  }
}
