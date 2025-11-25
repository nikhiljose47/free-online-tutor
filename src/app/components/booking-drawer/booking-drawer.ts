import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SessionService } from '../../services/session.service';
import { Session } from '../../models/session.model';
import { CommonModule, DatePipe, NgIf } from '@angular/common';
import { BookSlotComponent } from '../book-slot/book-slot';

@Component({
  selector: 'app-booking-drawer',
  standalone: true,
  imports: [CommonModule, DatePipe, BookSlotComponent],
  templateUrl: './booking-drawer.html',
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
