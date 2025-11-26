import { Injectable, signal } from '@angular/core';
import { of, delay, map } from 'rxjs';
import { Session } from '../models/session.model';

@Injectable({ providedIn: 'root' })
export class SessionService {
  // local cache (zoneless-safe)
  private sessions = signal<Session[]>([
    {
      id: '1',
      title: 'Class 9 - Algebra Basics',
      teacher: 'Ananya Sharma',
      startAt: new Date(Date.now() + 1000 * 60 * 20).toISOString(),
      seatsTotal: 20,
      seatsLeft: 7,
    },
    {
      id: '2',
      title: 'Class 8 - Geometry Intro',
      teacher: 'Rahul Nair',
      startAt: new Date(Date.now() + 1000 * 60 * 50).toISOString(),
      seatsTotal: 15,
      seatsLeft: 3,
    },
  ]);

  // store bookings cleanly
  private bookings = signal<
    { id: string; sessionId: string; status: string }[]
  >([]);

  /** GET UPCOMING SESSIONS */
  getUpcoming() {
    return of(this.sessions()).pipe(delay(300));
  }

  /** BOOK A SESSION */
  bookSession(id: string) {
    const current = this.sessions();
    const session = current.find((s) => s.id === id);

    if (!session || session.seatsLeft === 0) {
      return of({ success: false, meetingLink: '' });
    }

    // immutable update
    const updated = current.map((s) =>
      s.id === id
        ? { ...s, seatsLeft: s.seatsLeft - 1, meetingLink: 'https://meet.google.com/xyz-abc-pqr' }
        : s
    );

    this.sessions.set(updated);

    // also add booking
    this.bookings.update((b) => [
      ...b,
      { id: crypto.randomUUID(), sessionId: id, status: 'booked' },
    ]);

    return of({
      success: true,
      meetingLink: 'https://meet.google.com/xyz-abc-pqr',
    }).pipe(delay(400));
  }

  /** GET USER BOOKINGS */
  getBookings() {
    return of(this.bookings()).pipe(
      delay(200),
      map((items) =>
        items.map((b) => {
          const session = this.sessions().find((s) => s.id === b.sessionId);
          return {
            id: b.id,
            sessionId: b.sessionId,
            status: b.status,
            sessionTitle: session?.title ?? '',
            startAt: session?.startAt ?? '',
          };
        })
      )
    );
  }
}
