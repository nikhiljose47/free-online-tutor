import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { from, of, switchMap, tap } from 'rxjs';

import { IndexedDbService } from '../../services/db/indexed-db.service';
import { buildCacheKey, getCacheRule } from '../../config/http-cache.config';

interface CachedPayload<T = unknown> {
  id: string;
  data: T;
  ts: number;
}

export const httpCacheInterceptor: HttpInterceptorFn = (req, next) => {
  const rule = getCacheRule(req);
  if (!rule) return next(req);

  const db = inject(IndexedDbService);
  const key = buildCacheKey(req);
  const now = Date.now();

  return from(db.get<CachedPayload>(rule.store, key)).pipe(
    switchMap(cached => {
      // 1️⃣ Fresh cache → return immediately
      if (cached && now - cached.ts < rule.ttl) {
        return of(new HttpResponse({ body: cached.data, status: 200 }));
      }

      // 2️⃣ Network → update cache
      return next(req).pipe(
        tap(evt => {
          if (evt instanceof HttpResponse) {
            db.set(rule.store, {
              id: key,
              data: evt.body,
              ts: Date.now(),
            }).catch(() => {});
          }
        }),
        // 3️⃣ Offline fallback (stale)
        switchMap(evt => of(evt)),
      );
    })
  );
};
