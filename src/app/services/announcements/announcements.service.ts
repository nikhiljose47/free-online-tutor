import { Injectable, inject, signal } from '@angular/core';
import { Observable, shareReplay, map, tap, of } from 'rxjs';

import {
  Announcement,
  AnnouncementVisibility
} from '../../models/announcement.model';

import {
  FireResponse,
  FirestoreDocService
} from '../../core/services/fire/firestore-doc.service';
import { CACHE_TTL } from '../../core/constants/app.constants';

@Injectable({ providedIn: 'root' })
export class AnnouncementsService {

  private fs = inject(FirestoreDocService);

  private path = 'announcements';

  private cacheTime = new Map<string, number>();

  /* ================= CACHES ================= */

  private cache = new Map<string, Observable<Announcement[]>>();
  private docCache = new Map<string, Observable<Announcement | null>>();

  private memory = signal<Record<string, Announcement[]>>({});


  /* ================= HELPERS ================= */

  private isActive(a: Announcement) {

    if (!a.enabled) return false;

    const now = new Date();

    const start = a.startsAt?.toDate?.();
    const end = a.expiresAt?.toDate?.();

    if (start && start > now) return false;
    if (end && end < now) return false;

    return true;
  }

  private filterActive(list: Announcement[]) {
    return list
      .filter(a => this.isActive(a))
      .sort((a, b) => (a.priority ?? 999) - (b.priority ?? 999));
  }

  private isFresh(key: string) {
    const t = this.cacheTime.get(key);
    return t && Date.now() - t < CACHE_TTL.ANNOUNCEMENTS;
  }


  /* ================= SINGLE DOC ================= */

  getOnce(id: string): Observable<Announcement | null> {

    const key = `doc-${id}`;

    if (this.docCache.has(key) && this.isFresh(key)) {
      return this.docCache.get(key)!;
    }

    const req$ = this.fs.getOnce<Announcement>(this.path, id).pipe(

      map((r: FireResponse<Announcement>) =>
        r.ok && r.data ? (r.data as Announcement) : null
      ),

      map(doc => (doc && this.isActive(doc)) ? doc : null),

      tap((doc) => {

        if (!doc) return;

        this.memory.update(m => {

          const list = m[doc.classId] ?? [];
          const filtered = list.filter(a => a.id !== doc.id);

          return {
            ...m,
            [doc.classId]: [...filtered, doc]
          };

        });

        this.cacheTime.set(key, Date.now());

      }),

      shareReplay({ bufferSize: 1, refCount: false })
    );

    this.docCache.set(key, req$);

    return req$;
  }


  /* ================= ALL ANNOUNCEMENTS (TTL) ================= */

  getAll(): Observable<Announcement[]> {

    const key = 'all';

    if (this.cache.has(key) && this.isFresh(key)) {
      return this.cache.get(key)!;
    }

    const req$ = this.fs.listenAll<Announcement>(this.path).pipe(

      map((r: FireResponse<Announcement>) =>
        r.ok && r.data ? (r.data as Announcement[]) : []
      ),

      map(arr => this.filterActive(arr)),

      tap(() => this.cacheTime.set(key, Date.now())),

      shareReplay({ bufferSize: 1, refCount: true })
    );

    this.cache.set(key, req$);

    return req$;
  }


  /* ================= BY CLASS ================= */

  getByClass(classId: string): Observable<Announcement[]> {

    const mem = this.memory()[classId];

    if (mem && this.isFresh(`class-${classId}`)) {
      return of(this.filterActive(mem));
    }

    const key = `class-${classId}`;

    if (this.cache.has(key) && this.isFresh(key)) {
      return this.cache.get(key)!;
    }

    const req$ = this.fs
      .realtimeWhere<Announcement>(
        this.path,
        'classId',
        '==',
        classId
      )
      .pipe(

        map((r: FireResponse<Announcement>) =>
          r.ok && r.data ? (r.data as Announcement[]) : []
        ),

        map(arr => this.filterActive(arr)),

        tap(arr => {

          this.memory.update(m => ({ ...m, [classId]: arr }));

          this.cacheTime.set(key, Date.now());

        }),

        shareReplay({ bufferSize: 1, refCount: true })
      );

    this.cache.set(key, req$);

    return req$;
  }


  /* ================= VISIBILITY ================= */

  getForAudience(
    classId: string,
    visibility: AnnouncementVisibility
  ): Observable<Announcement[]> {

    return this.getByClass(classId).pipe(

      map(list =>
        list.filter(a =>
          a.visibility === 'all' || a.visibility === visibility
        )
      )
    );
  }


  /* ================= MUTATIONS ================= */

  set(doc: Announcement) {
    return this.fs.set(this.path, doc.id, doc);
  }

  update(id: string, data: Partial<Announcement>) {
    return this.fs.update(this.path, id, data);
  }

  delete(id: string) {
    return this.fs.delete(this.path, id);
  }


  /* ================= CACHE CLEAR ================= */

  clear(classId?: string) {

    if (classId) {

      this.cache.delete(`class-${classId}`);
      this.cacheTime.delete(`class-${classId}`);

      this.memory.update((m) => {
        const { [classId]: _, ...rest } = m;
        return rest;
      });

      return;
    }

    this.cache.clear();
    this.cacheTime.clear();
    this.memory.set({});
  }

}