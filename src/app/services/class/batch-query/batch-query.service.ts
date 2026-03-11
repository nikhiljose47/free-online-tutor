import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { FireResponse, FirestoreDocService } from '../../../core/services/fire/firestore-doc.service';
import { BatchDoc } from '../../../models/batch/batch-doc.model';
import { ClassStatus } from '../../../models/classes/class-doc.model';


@Injectable({ providedIn: 'root' })
export class BatchQueryService {

  private fs = inject(FirestoreDocService);
  private readonly basePath = 'classes';

  private path(classId: string) {
    return `${this.basePath}/${classId}/batches`;
  }

  // ---------- BASE SOURCE ----------
  getAll(classId: string): Observable<BatchDoc[]> {
    return this.fs.listenAll<BatchDoc>(this.path(classId)).pipe(
      map((r: FireResponse<BatchDoc>) =>
        r.ok && r.data ? (r.data as BatchDoc[]) : []
      )
    );
  }

  // ---------- UPCOMING ----------
  getUpcoming(classId: string): Observable<BatchDoc[]> {
    return this.getAll(classId).pipe(
      map(arr => {
        const now = Date.now();
        return arr.filter(b => b.startAt.toMillis() > now);
      })
    );
  }

  // ---------- LIVE ----------
  getLive(classId: string): Observable<BatchDoc[]> {
    return this.getAll(classId).pipe(
      map(arr => {
      const now = Date.now();
        return arr.filter(b =>
          b.startAt.toMillis() <= now &&
          b.endAt.toMillis() >= now
        );
      })
    );
  }

  // ---------- ENROLLMENT OPEN ----------
  getEnrollmentOpen(classId: string): Observable<BatchDoc[]> {
    return this.getAll(classId).pipe(
      map(arr =>
        arr.filter(b => b.isEnrollmentOpen)
      )
    );
  }

  // ---------- STATUS FILTER ----------
  getByStatus(
    classId: string,
    status: ClassStatus
  ): Observable<BatchDoc[]> {
    return this.getAll(classId).pipe(
      map(arr => arr.filter(b => b.status === status))
    );
  }

  // ---------- GROUP FILTER ----------
  // getByGroup(
  //   classId: string,
  //   group: string
  // ): Observable<BatchDoc[]> {
  //   return this.getAll(classId).pipe(
  //     map(arr => arr.filter(b => b.group === group))
  //   );
  // }

  // ---------- CAPACITY AVAILABLE ----------
  getAvailableSeats(classId: string): Observable<
    { batchId: string; remaining: number }[]
  > {
    return this.getAll(classId).pipe(
      map(arr =>
        arr.map(b => ({
          batchId: b.id,
          remaining: b.capacity - b.enrolledCount
        }))
      )
    );
  }

  // ---------- COUNTS SNAPSHOT ----------
  getCounts(classId: string) {
    return this.getAll(classId).pipe(
      map(arr => {
        const now = Date.now();

        const upcoming = arr.filter(b => b.startAt.toMillis() > now);
        const live = arr.filter(b =>
          b.startAt.toMillis() <= now &&
          b.endAt.toMillis() >= now
        );

        return {
          total: arr.length,
          upcomingCount: upcoming.length,
          liveCount: live.length,
          enrollmentOpenCount: arr.filter(b => b.isEnrollmentOpen).length
        };
      })
    );
  }

  // ---------- FULL DASHBOARD COMBO ----------
  getDashboard(classId: string) {
    return this.getAll(classId).pipe(
      map(arr => {
        const now = Date.now();

        const upcoming = arr.filter(b => b.startAt.toMillis() > now);
        const live = arr.filter(b =>
          b.startAt.toMillis() <= now &&
          b.endAt?.toMillis() >= now
        );

        return {
          total: arr.length,
          upcoming,
          live,
          enrollmentOpen: arr.filter(b => b.isEnrollmentOpen),
          upcomingCount: upcoming.length,
          liveCount: live.length
        };
      })
    );
  }
}