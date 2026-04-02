import { Injectable, inject, signal } from '@angular/core';
import { Observable, of, shareReplay, map, tap,  concatMap, from, toArray  } from 'rxjs';
import { Timestamp } from 'firebase/firestore';
import { StudentSessionResult } from '../../models/assessment/student-session-result.model';
import { FireResponse, FirestoreDocService } from '../../core/services/fire/firestore-doc.service';
import { CACHE_TTL } from '../../core/constants/app.constants';

type CacheEntry = { data: StudentSessionResult; exp: number };

@Injectable({ providedIn: 'root' })
export class StudentAssessmentService {
  private fs = inject(FirestoreDocService);

  private path = 'student_assessment';
  private ttl = CACHE_TTL.ASSESSMENT; 

  private memory = signal<Record<string, CacheEntry>>({});
  private inflight = new Map<string, Observable<StudentSessionResult | null>>();

  private key(studentId: string, subjectId: string) {
    return `${studentId}_${subjectId}`;
  }

  // ---------- GET WITH TTL CACHE ---------
  get(studentId: string, subjectId: string): Observable<StudentSessionResult | null> {
    const id = this.key(studentId, subjectId);
    const mem = this.memory()[id];

    if (mem && mem.exp > Date.now()) return of(mem.data);

    if (this.inflight.has(id)) return this.inflight.get(id)!;

    const req$ = this.fs.getOnce<StudentSessionResult>(this.path, id).pipe(
      map((r: FireResponse<StudentSessionResult>) =>
        r.ok && r.data ? (r.data as StudentSessionResult) : null,
      ),
      tap((doc) => {
        if (!doc) return;

        this.memory.update((m) => ({
          ...m,
          [id]: { data: doc, exp: Date.now() + this.ttl },
        }));
      }),
      shareReplay({ bufferSize: 1, refCount: false }),
    );
    this.inflight.set(id, req$);
    return req$;
  }

  // ---------- UPSERT SESSION RESULT ----------
  upsert(result: StudentSessionResult) {
    const id = this.key(result.studentUid, result.subjectId);

    const payload: StudentSessionResult = {
      ...result,
      updatedAt: Timestamp.now(),
    };

    this.memory.update((m) => ({
      ...m,
      [id]: { data: payload, exp: Date.now() + this.ttl },
    }));

    return this.fs.set(this.path, id, payload);
  }

  // ---------- PATCH UPDATE ----------
  update(studentId: string, subjectId: string, data: Partial<StudentSessionResult>) {
    const id = this.key(studentId, subjectId);

    this.memory.update((m) => {
      const cur = m[id]?.data;
      if (!cur) return m;
      return {
        ...m,
        [id]: {
          data: { ...cur, ...data, updatedAt: Timestamp.now() },
          exp: Date.now() + this.ttl,
        },
      };
    });

    return this.fs.update(this.path, id, {
      ...data,
      updatedAt: Timestamp.now(),
    });
  }

  // ---------- ADD NEW SESSION ENTRY ----------
  addSession(studentId: string, subjectId: string, session: StudentSessionResult) {
    const id = this.key(studentId, subjectId);

    return this.get(studentId, subjectId).pipe(
      map((existing) => {
        if (!existing) return this.fs.set(this.path, id, session);
        const merged = { ...existing, ...session, updatedAt: Timestamp.now() };
        this.memory.update((m) => ({
          ...m,
          [id]: { data: merged, exp: Date.now() + this.ttl },
        }));
        return this.fs.set(this.path, id, merged);
      }),
    );
  }

  saveSessions(list: StudentSessionResult[]) {
  return from(list).pipe(
    concatMap(s =>
      this.addSession(s.studentUid, s.subjectId, s)
    ),
    toArray()
  );
}

  // ---------- CLEAR CACHE ----------
  clear(studentId?: string, subjectId?: string) {
    if (!studentId || !subjectId) {
      this.memory.set({});
      this.inflight.clear();
      return;
    }

    const id = this.key(studentId, subjectId);

    this.memory.update((m) => {
      const { [id]: _, ...rest } = m;
      return rest;
    });

    this.inflight.delete(id);
  }
}
