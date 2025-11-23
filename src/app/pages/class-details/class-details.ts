import { Component, inject } from '@angular/core';
import { CommonModule, NgIf, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { SessionService } from '../../services/session.service';
import { Session } from '../../models/session.model';

@Component({
  selector: 'class-details',
  standalone: true,
  imports: [CommonModule, NgIf, RouterModule, DatePipe],
  template: `
    <div class="container mt-4" *ngIf="session">
      <div class="card p-3">
        <div class="d-flex justify-content-between align-items-start">
          <div>
            <h4 class="fw-bold">{{ session.title }}</h4>
            <div class="text-muted">Teacher: {{ session.teacher }}</div>
            <div class="my-2"><small>Starts: {{ session.startAt | date:'fullDate' }} • {{ session.startAt | date:'shortTime' }}</small></div>
          </div>
          <div class="text-end">
            <div class="badge bg-info text-dark mb-1">Seats: {{ session.seatsLeft }} / {{ session.seatsTotal }}</div>
            <div *ngIf="timeLeft" class="small text-muted">Starts in {{ timeLeft }}</div>
          </div>
        </div>

        <hr>

        <h6>Agenda</h6>
        <ul>
          <li>Quick revision (5 min)</li>
          <li>Main topic walkthrough (15-25 min)</li>
          <li>Practice problems & Q/A (remaining)</li>
        </ul>

        <div class="mt-3 d-flex gap-2">
          <button class="btn btn-primary" (click)="book()" [disabled]="bookingInProgress || session.seatsLeft === 0">Book Slot</button>
          <a *ngIf="session.meetingLink" [href]="session.meetingLink" target="_blank" class="btn btn-outline-success">Join Class</a>
        </div>

        <div *ngIf="bookingSuccess" class="alert alert-success mt-3">
          Booked! Join link: <a [href]="meetingLink" target="_blank">{{ meetingLink }}</a>
        </div>
      </div>
    </div>
  `
})
export class ClassDetailsComponent {
  private route = inject(ActivatedRoute);
  private api = inject(SessionService);

  session!: Session|undefined;
  bookingInProgress = false;
  bookingSuccess = false;
  meetingLink: string|null = null;
  timeLeft: string|null = null;

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    this.api.getUpcoming().subscribe(list => {
      this.session = list.find(s => s.id === id);
      if (this.session) this.computeTimeLeft();
    });
  }

  computeTimeLeft() {
    if (!this.session) return;
    const diff = new Date(this.session.startAt).getTime() - Date.now();
    if (diff <= 0) { this.timeLeft = 'Starting'; return; }
    const minutes = Math.floor(diff / (60*1000));
    const secs = Math.floor((diff % (60*1000)) / 1000);
    this.timeLeft = `${minutes}m ${secs}s`;
    // update every 15s
    setTimeout(()=>this.computeTimeLeft(), 15000);
  }

  book() {
    if (!this.session) return;
    this.bookingInProgress = true;
    this.api.bookSession(this.session.id).subscribe((r:any) => {
      this.bookingInProgress = false;
      if (r.success) {
        this.bookingSuccess = true;
        this.meetingLink = r.meetingLink;
        // update local seatsLeft
        if (this.session) this.session.seatsLeft = Math.max(0, this.session.seatsLeft - 1);
      } else {
        alert('Booking failed — no seats left.');
      }
    });
  }
}
