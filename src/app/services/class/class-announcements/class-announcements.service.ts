import { Injectable, inject, signal } from '@angular/core';
import { Observable, shareReplay, map, tap, of } from 'rxjs';
import { FireResponse, FirestoreDocService } from '../../fire/firestore-doc.service';
import { ClassAnnouncement } from '../../../models/classes/class-announcement.model';

@Injectable({ providedIn: 'root' })
export class ClassAnnouncementsService {
  private fs = inject(FirestoreDocService);

  private listCache = new Map<string, Observable<ClassAnnouncement[]>>();
  private docCache = new Map<string, Observable<ClassAnnouncement | null>>();

  private memory = signal<Record<string, ClassAnnouncement[]>>({});

  private path = 'classes';

  // ---------- SINGLE DOC (NO REALTIME) ----------
  getOnce(classId: string, announcementId: string): Observable<ClassAnnouncement | null> {
    const existing = this.memory()[classId]?.find((a) => a.announcementId === announcementId);
    if (existing) return of(existing);

    const key = `${classId}-${announcementId}`;
    if (this.docCache.has(key)) return this.docCache.get(key)!;

    const req$ = this.fs
      .getOnce<ClassAnnouncement>(`${this.path}/${classId}/announcements`, announcementId)
      .pipe(
        map((r: FireResponse<ClassAnnouncement>) =>
          r.ok && r.data ? (r.data as ClassAnnouncement) : null,
        ),
        tap((announcement) => {
          if (!announcement) return;

          this.memory.update((m) => {
            const list = m[classId] ?? [];
            const filtered = list.filter((a) => a.announcementId !== announcement.announcementId);
            return { ...m, [classId]: [...filtered, announcement] };
          });
        }),
        shareReplay({ bufferSize: 1, refCount: false }),
      );

    this.docCache.set(key, req$);
    return req$;
  }

  // ---------- REALTIME ALL ----------
  getAll(classId: string): Observable<ClassAnnouncement[]> {
    if (this.listCache.has(classId)) return this.listCache.get(classId)!;

    const req$ = this.fs.listenAll<ClassAnnouncement>(`${this.path}/${classId}/announcements`).pipe(
      map((r: FireResponse<ClassAnnouncement>) =>
        r.ok && r.data ? (r.data as ClassAnnouncement[]) : [],
      ),
      tap((arr) => this.memory.update((m) => ({ ...m, [classId]: arr }))),
      shareReplay({ bufferSize: 1, refCount: true }),
    );

    this.listCache.set(classId, req$);
    return req$;
  }

  // ---------- FILTERED REALTIME ----------
  getWhere(
    classId: string,
    field: keyof ClassAnnouncement,
    op: any,
    value: any,
    limitTo = 50,
  ): Observable<ClassAnnouncement[]> {
    const key = `where-${classId}-${String(field)}-${value}`;
    if (this.listCache.has(key)) return this.listCache.get(key)!;

    const req$ = this.fs
      .realtimeWhere<ClassAnnouncement>(
        `${this.path}/${classId}/announcements`,
        field as string,
        op,
        value,
        limitTo,
      )
      .pipe(
        map((r: FireResponse<ClassAnnouncement>) =>
          r.ok && r.data ? (r.data as ClassAnnouncement[]) : [],
        ),
        shareReplay({ bufferSize: 1, refCount: true }),
      );

    this.listCache.set(key, req$);
    return req$;
  }

  // ---------- FILTERED ONCE ----------
  getWhereOnce(
    classId: string,
    field: keyof ClassAnnouncement,
    op: any,
    value: any,
    limitTo = 50,
  ): Observable<ClassAnnouncement[]> {
    const key = `once-where-${classId}-${String(field)}-${value}`;
    if (this.listCache.has(key)) return this.listCache.get(key)!;

    const req$ = this.fs
      .where<ClassAnnouncement>(
        `${this.path}/${classId}/announcements`,
        field as string,
        op,
        value,
        limitTo,
      )
      .pipe(
        map((r: FireResponse<ClassAnnouncement>) =>
          r.ok && r.data ? (r.data as ClassAnnouncement[]) : [],
        ),
        shareReplay({ bufferSize: 1, refCount: false }),
      );

    this.listCache.set(key, req$);
    return req$;
  }

  // ---------- HYBRID ----------
  get(classId: string): Observable<ClassAnnouncement[]> {
    const mem = this.memory()[classId];
    if (mem) return of(mem);
    return this.getAll(classId);
  }

  // ---------- MUTATIONS ----------
  set(classId: string, announcement: ClassAnnouncement) {
    return this.fs.set(
      `${this.path}/${classId}/announcements`,
      announcement.announcementId,
      announcement,
    );
  }

  update(classId: string, announcementId: string, data: Partial<ClassAnnouncement>) {
    return this.fs.update(`${this.path}/${classId}/announcements`, announcementId, data);
  }

  delete(classId: string, announcementId: string) {
    return this.fs.delete(`${this.path}/${classId}/announcements`, announcementId);
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
