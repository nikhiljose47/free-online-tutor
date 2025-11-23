import { Injectable, inject } from '@angular/core';
import { of, delay } from 'rxjs';
import { Session } from '../models/session.model';

@Injectable({ providedIn: 'root' })
export class SessionService {
  // mock data — replace later
  private mockSessions: Session[] = [
    {
      id: '1',
      title: 'Class 9 - Algebra Basics',
      teacher: 'Ananya Sharma',
      startAt: new Date(Date.now() + 1000 * 60 * 20).toISOString(), // starts in 20 min
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
  ];

  getUpcoming() {
    return of(this.mockSessions).pipe(delay(300));
  }

  bookSession(id: string) {
    const session = this.mockSessions.find((s) => s.id === id);
    if (!session || session.seatsLeft === 0) return of({ success: false });

    session.seatsLeft -= 1;
    session.meetingLink = 'https://meet.google.com/xyz-abc-pqr';

    return of({ success: true, meetingLink: session.meetingLink }).pipe(delay(400));
  }

  getBookings() {
    // mock: some bookings referencing sessions
    return of([
      {
        id: 'b1',
        sessionId: '1',
        sessionTitle: 'Class 9 - Algebra Basics',
        startAt: new Date(Date.now() + 1000 * 60 * 20).toISOString(),
        status: 'booked',
      },
    ]).pipe(delay(200));
  }
}
