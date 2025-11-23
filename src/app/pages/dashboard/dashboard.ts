import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SessionService } from '../../services/session.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mt-4">
      <h3 class="fw-bold mb-3">Your Dashboard</h3>

      <div class="row">
        <div class="col-md-6">
          <div class="card p-3 mb-3">
            <h6>Upcoming Bookings</h6>
            <div *ngFor="let b of bookings" class="border-bottom py-2">
              <div class="d-flex justify-content-between">
                <div>
                  <div class="fw-bold">{{ b.sessionTitle }}</div>
                  <small class="text-muted">{{ b.startAt | date : 'short' }}</small>
                </div>
                <div class="text-end">
                  <button class="btn btn-sm btn-outline-primary" (click)="goToSession(b.sessionId)">
                    View
                  </button>
                </div>
              </div>
            </div>
            <div *ngIf="!bookings.length" class="text-muted small mt-2">No bookings yet</div>
          </div>
        </div>

        <div class="col-md-6">
          <div class="card p-3 mb-3">
            <h6>Quick Actions</h6>
            <div class="d-grid gap-2">
              <button class="btn btn-outline-success" (click)="navigate('/book-slot')">
                Book a Seat
              </button>
              <button class="btn btn-outline-info" (click)="navigate('/roadmap')">
                Browse Roadmaps
              </button>
              <button class="btn btn-outline-secondary" (click)="navigate('/syllabus')">
                Syllabus
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class DashboardComponent {
  private svc = inject(SessionService);
  private router = inject(Router);

  bookings: any[] = [];

  ngOnInit() {
    this.svc.getBookings().subscribe((r: any) => {
      this.bookings = r;
    });
  }

  goToSession(sessionId: string) {
    this.router.navigate(['/class', sessionId]);
  }

  navigate(path: string) {
    this.router.navigate([path]);
  }
}
