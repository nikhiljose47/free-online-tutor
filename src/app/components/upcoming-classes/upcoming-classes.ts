import { Component, inject, signal } from '@angular/core';
import { CommonModule, DatePipe, NgForOf } from '@angular/common';
import { SessionService } from '../../services/session.service';
import { Router } from '@angular/router';
import { Session } from '../../models/session.model';

@Component({
  selector: 'upcoming-classes',
  standalone: true,
  imports: [CommonModule, NgForOf, DatePipe],
  template: `
    <h4 class="mb-3">Upcoming Classes</h4>

    <div *ngFor="let s of sessions()">
      <div class="card mb-3 p-3">
        <h5>{{ s.title }}</h5>
        <div>Teacher: {{ s.teacher }}</div>
        <div>Starts at: {{ s.startAt | date : 'shortTime' }}</div>
        <div>Seats left: {{ s.seatsLeft }}</div>

        <button class="btn btn-primary mt-2" (click)="openBooking(s.id)">Book Slot</button>
      </div>
    </div>
  `,
})
export class UpcomingClassesComponent {
  private api = inject(SessionService);
  private router = inject(Router);

  // 🔥 Signal instead of normal array
  sessions = signal<Session[]>([]);

  ngOnInit() {
    this.api.getUpcoming().subscribe((r) => {
      this.sessions.set(r); // 🔥 UI updates immediately in zoneless mode
    });
  }

  openBooking(id: string) {
    this.router.navigate(['/book', id]);
  }
}
