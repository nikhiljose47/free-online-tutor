import { inject, Injectable, signal } from '@angular/core';
import { of, map, Observable, shareReplay, from, catchError } from 'rxjs';
import {
  collection,
  Firestore,
  getDocs,
  limit,
  orderBy,
  query,
  Timestamp,
  where,
} from '@angular/fire/firestore';

import { Meeting } from '../../models/meeting.model';
import { FireResponse, FirestoreDocService } from '../../core/services/fire/firestore-doc.service';
import { GLOBAL_MEETINGS } from '../../core/constants/app.constants';

@Injectable({ providedIn: 'root' })
export class MeetingsService {
  private db = inject(Firestore);
  private fs = inject(FirestoreDocService);

  // --------------------------------------------------
  // 🔥 Local domain cache (classId → meetings[])
  // --------------------------------------------------
  private classCache = signal<Record<string, Meeting[]>>({});

  private live$?: Observable<FireResponse<Meeting[]>>;
  
  private success<T>(data: T | T[] | null): FireResponse<T> {
    return { ok: true, data };
  }

  private fail<T>(msg: string): FireResponse<T> {
    return { ok: false, data: null, message: msg };
  }

  getActiveMeetingsOnce<T>(
    path: string,
    lastSync?: Timestamp | null,
    limitTo = 20,
  ): Observable<FireResponse<T[]>> {
    const now = Timestamp.fromDate(new Date());

    let q: any;

    if (!lastSync) {
      q = query(
        collection(this.db, path),
        where('endAt', '>=', now),
        orderBy('endAt'),
        limit(limitTo),
      );
    } else {
      // 🔥 DELTA LOAD (SAFE QUERY)
      q = query(
        collection(this.db, path),
        where('endAt', '>=', now),
        where('createdAt', '>', lastSync),
        orderBy('createdAt'),
        limit(limitTo),
      );
    }

    q = query(collection(this.db, path), limit(10));

    return from(getDocs(q)).pipe(
      map((snap) => {
        const data = snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as any),
        }));
        return this.success<T[]>(data);
      }),
      catchError((err) => of(this.fail<T[]>(err?.message ?? 'meetings fetch failed'))),
    );
  }

  getLiveMeetingsInitial(): Observable<FireResponse<Meeting[]>> {
    return this.fs.notEnded<Meeting>(GLOBAL_MEETINGS);
  }

  getLiveMeetings(): Observable<FireResponse<Meeting[]>> {
    if (!this.live$) {
      this.live$ = this.fs.realtimeNotEnded<Meeting>(GLOBAL_MEETINGS).pipe(
        shareReplay({
          bufferSize: 1,
          refCount: true, // auto-unsubscribe when no subscribers
        }),
      );
    }
    return this.live$;
  }

  getLiveMeetingsByTeacher(teacherId: string): Observable<FireResponse<Meeting[]>> {
    return this.getLiveMeetings().pipe(
      map((res): FireResponse<Meeting[]> => {
        if (!res.ok || !res.data) {
          return res as FireResponse<Meeting[]>;
        }
        const data = res.data as Meeting[];
        return {
          ok: true,
          data: data.filter((m) => m.teacherId === teacherId),
        };
      }),
    );
  }

  // getLiveMeetingsByClassId(classId: string): Observable<FireResponse<Meeting[]>> {
  //   return this.getLiveMeetings().pipe(
  //     map((res): FireResponse<Meeting[]> => {
  //       if (!res.ok || !res.data) {
  //         return res as FireResponse<Meeting[]>;
  //       }
  //       const data = res.data as Meeting[];
  //       return {
  //         ok: true,
  //         data: data.filter((m) => m.classId === classId),
  //       };
  //     }),
  //   );
  // }

  private cacheMeetings(classId: string, meetings: Meeting[]) {
    this.classCache.set({
      ...this.classCache(),
      [classId]: meetings,
    });
  }

  getMeetingsById(id: string) {
    const cached = this.classCache()[id];
    if (cached) {
      return of({ ok: true, data: cached } as FireResponse<Meeting>);
    }

    return this.fs.getAllOnce<Meeting>(GLOBAL_MEETINGS).pipe(
      map((res) => {
        if (!res.ok || !res.data) return res;

        const meetings = res.data as Meeting[];
        this.cacheMeetings(id, meetings);

        return { ok: true, data: meetings } as FireResponse<Meeting>;
      }),
    );
  }

  // --------------------------------------------------
  // ✔ Get all meetings for a class (cached)
  // --------------------------------------------------
  getMeetingsForClass(classId: string) {
    const cached = this.classCache()[classId];
    if (cached) {
      return of({ ok: true, data: cached } as FireResponse<Meeting>);
    }

    return this.fs.getAllOnce<Meeting>(GLOBAL_MEETINGS).pipe(
      map((res) => {
        if (!res.ok || !res.data) return res;

        const meetings = res.data as Meeting[];
        this.cacheMeetings(classId, meetings);

        return {
          ok: true,
          data: meetings.filter((m) => m.classId == classId),
        } as FireResponse<Meeting>;
      }),
    );
  }

  getCompletedChapters(classId: string) {
    return this.getMeetingsForClass(classId).pipe(
      map((res) => {
        if (!res.ok || !Array.isArray(res.data)) {
          return { ok: false, data: null, message: 'Meetings not available' };
        }

        const completed = res.data
          .filter((m) => m.status === 'completed')
          .map((m) => m.chapterCode);

        return { ok: true, data: completed };
      }),
    );
  }

  getAttendance(classId: string, meetingId: string) {
    return this.getMeetingsForClass(classId).pipe(
      map((res) => {
        if (!res.ok || !Array.isArray(res.data)) {
          return { ok: false, data: null, message: 'Meetings not loaded' };
        }

        const meeting = res.data.find((m) => m.id === meetingId);
        if (!meeting) {
          return { ok: false, data: null, message: 'Meeting not found' };
        }

        return { ok: true, data: meeting.attendance };
      }),
    );
  }

  getMeetingsByTecher(id: string) {
    return this.getMeetingsById(id).pipe(
      map((res) => {
        if (!res.ok || !Array.isArray(res.data)) {
          return { ok: false, data: null, message: 'Meetings not loaded' };
        }

        const meeting = res.data.find((m) => m.teacherId === id);
        if (!meeting) {
          return { ok: false, data: null, message: 'Meeting not found' };
        }

        return { ok: true, data: meeting };
      }),
    );
  }

  // --------------------------------------------------
  // ✔ Get meetings by subject (filtered query)
  // --------------------------------------------------
  getMeetingsBySubject(classId: string, subjectId: string) {
    return this.fs.where<Meeting>(`classes/${classId}/meetings`, 'subjectId', '==', subjectId, 50);
  }

  // --------------------------------------------------
  // ✔ Optional: clear cache for one class
  // --------------------------------------------------
  clearClassCache(classId: string) {
    const current = { ...this.classCache() };
    delete current[classId];
    this.classCache.set(current);
  }

  scheduleMeeting$(f: any) {
    const [hours, minutes] = f.time.split(':').map(Number);

    const date = new Date(f.date);
    date.setHours(hours, minutes, 0, 0);

    const start = new Date(date);
    const end = new Date(start.getTime() + (f.duration ?? 0) * 60000);

    const payload: Meeting = {
      id: '', // will be injected in service
      classId: f.classId,
      className: f.className,
      subjectId: f.subjectId,
      subjectName: f.subjectName,
      chapterCode: f.chapterCode,
      chapterName: f.chapterName,
      batchId: f.batchId,
      meetLink: f.meetLink,
      status: 'PART1',
      teacherId: f.teacherId,
      teacherName: f.teacherName,
      duration: f.duration,
      attendance: [],
      isFree: true,
      date: Timestamp.fromDate(start),
      endAt: Timestamp.fromDate(end),
      createdAt: Timestamp.now(),
      imageSrc: f.imageSrc,
    };

    return this.fs.createWithId(GLOBAL_MEETINGS, payload);
  }
}
