import { Injectable, signal } from '@angular/core';
import {
  Firestore,
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
} from '@angular/fire/firestore';
import { Timestamp } from '@angular/fire/firestore';
import { from, map, catchError, of } from 'rxjs';

export interface Meeting {
  id: string;
  classId: string;
  chapterCode: string;
  teacherId: string;
  batch: string;
  status: string;
  duration: string;
  createdAt: Timestamp;
  attendence: string[];
  date: Timestamp; // assumed field
  subjectId: string; // assumed field
}

@Injectable({ providedIn: 'root' })
export class MeetingsService {
  constructor(private db: Firestore) {}

  // 🔥 Local cache using signals (Very fast, zoneless friendly)
  private classCache = signal<Record<string, Meeting[]>>({});

  // ---------- Helpers ----------
  private col(path: string) {
    return collection(this.db, path);
  }

  private success<T>(data: T) {
    return { ok: true, data };
  }

  private fail<T>(msg: string) {
    return { ok: false, data: null, message: msg };
  }

  private cacheClassMeetings(classId: string, meetings: Meeting[]) {
    const current = this.classCache();
    this.classCache.set({ ...current, [classId]: meetings });
  }

  // ---------- MAIN FUNCTIONS ----------

  /** ✔ Get all meetings for a class (cached) */
  getMeetingsForClass(classId: string) {
    const cache = this.classCache()[classId];
    if (cache) {
      return of(this.success(cache));
    }

    return from(getDocs(this.col(`classes/${classId}/meetings`))).pipe(
      map((snap) => {
        const data = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as Meeting[];
        this.cacheClassMeetings(classId, data);
        return this.success(data);
      }),
      catchError((err) => of(this.fail(err.message)))
    );
  }

  getCompletedChapters(classId: string) {
    return this.getMeetingsForClass(classId).pipe(
      map((res) => {
        if (!res.ok || !res.data) {
          return this.fail<string[]>('No meeting data available');
        }
        const completed = res.data.filter((m) => m.status === 'completed');
        return this.success<string[]>(completed.map((m) => m.chapterCode));
      })
    );
  }

  /** ✔ Get attendance for a specific meeting */
  getAttendance(classId: string, meetingId: string) {
    return from(getDocs(this.col(`classes/${classId}/meetings`))).pipe(
      map((snap) => {
        const doc = snap.docs.find((d) => d.id === meetingId);
        if (!doc) return this.fail('Meeting not found');
        const data = doc.data() as Meeting;
        return this.success(data.attendence);
      }),
      catchError((err) => of(this.fail(err.message)))
    );
  }

  /** ✔ Get upcoming meetings for a class */
  getUpcomingMeetings(classId: string) {
    const now = Timestamp.fromDate(new Date());

    const q = query(
      this.col(`classes/${classId}/meetings`),
      where('date', '>=', now),
      orderBy('date'),
      limit(50)
    );

    return from(getDocs(q)).pipe(
      map((snap) =>
        this.success(snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as Meeting[])
      ),
      catchError((err) => of(this.fail(err.message)))
    );
  }

  /** ✔ Get meetings of a specific subject in a class */
  getMeetingsBySubject(classId: string, subjectId: string) {
    const q = query(
      this.col(`classes/${classId}/meetings`),
      where('subjectId', '==', subjectId),
      limit(50)
    );

    return from(getDocs(q)).pipe(
      map((snap) =>
        this.success(snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as Meeting[])
      ),
      catchError((err) => of(this.fail(err.message)))
    );
  }
}
