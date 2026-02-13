import { Injectable, signal } from '@angular/core';
import { of, map, Observable, shareReplay } from 'rxjs';
import { endAt, Timestamp } from '@angular/fire/firestore';

import { Meeting } from '../../models/meeting.model';
import {
  FireResponse,
  FireResponse2,
  FirestoreDocService,
} from '../../services/fire/firestore-doc.service';
import { GLOBAL_MEETINGS } from '../../core/constants/app.constants';

@Injectable({ providedIn: 'root' })
export class MeetingsService {
  constructor(private fs: FirestoreDocService) {}

  // --------------------------------------------------
  // 🔥 Local domain cache (classId → meetings[])
  // --------------------------------------------------
  private classCache = signal<Record<string, Meeting[]>>({});

  /// For live/realtime caching
  private live$?: Observable<FireResponse<Meeting[]>>;

  getLiveMeetings(): Observable<FireResponse<Meeting[]>> {
    if (!this.live$) {
      this.live$ = this.fs.realtimeNotEnded<Meeting>(GLOBAL_MEETINGS).pipe(
        shareReplay({
          bufferSize: 1,
          refCount: true, // auto-unsubscribe when no subscribers
        })
      );
    }
    return this.live$;
  }

  getLiveMeetingsByTeacher(teacherId: string): Observable<FireResponse2<Meeting[]>> {
    return this.getLiveMeetings().pipe(
      map((res): FireResponse2<Meeting[]> => {
        if (!res.ok || !res.data) {
          return res as FireResponse2<Meeting[]>;
        }
        const data = res.data as Meeting[];
        return {
          ok: true,
          data: data.filter((m) => m.teacherId == teacherId),
        };
      })
    );
  }

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
      })
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

    return this.fs.getAllOnce<Meeting>(`classes/${classId}/meetings`).pipe(
      map((res) => {
        if (!res.ok || !res.data) return res;

        const meetings = res.data as Meeting[];
        this.cacheMeetings(classId, meetings);

        return { ok: true, data: meetings } as FireResponse<Meeting>;
      })
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
      })
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
      })
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
      })
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
}
