import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SessionService } from '../../services/session.service';
import { Session } from '../../models/session.model';
import { DatePipe, NgIf } from '@angular/common';

@Component({
  selector: 'app-booking-drawer',
  standalone: true,
  imports: [NgIf, DatePipe],
  template: `
    <div class="p-3">
      <h4>Book Class</h4>

      <div *ngIf="session()">
        <h5>{{ session()?.title }}</h5>
        <p>Teacher: {{ session()?.teacher }}</p>
        <p>Seats Left: {{ session()?.seatsLeft }}</p>
        <p>Starts: {{ session()?.startAt | date : 'shortTime' }}</p>

        <button class="btn btn-success mt-3" (click)="book()">Confirm Booking</button>

        <div *ngIf="meetingLink()" class="alert alert-info mt-3">
          <strong>Join Link:</strong><br />
          <a [href]="meetingLink()" target="_blank">{{ meetingLink() }}</a>
        </div>
      </div>
    </div>
  `,
})
export class BookingDrawerComponent {
  private route = inject(ActivatedRoute);
  private api = inject(SessionService);

  // 🔥 Signals instead of normal variables
  session = signal<Session | null>(null);
  meetingLink = signal<string | null>(null);

  ngOnInit() {
    const id = this.route.snapshot.params['id'];

    this.api.getUpcoming().subscribe((all) => {
      const found = all.find((s) => s.id === id);
      this.session.set(found ?? null); // 🔥 Triggers UI update
    });
  }

  book() {
    const sess = this.session();
    if (!sess) return;

    this.api.bookSession(sess.id).subscribe((r) => {
      if (r.success) {
        // meetingLink.set(r.meetingLink!);
        alert('Seat booked!');
      } else {
        alert('No seats left');
      }
    });
  }
}
