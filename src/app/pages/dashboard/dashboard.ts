import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SessionService } from '../../services/session.service';
import { Router } from '@angular/router';
import { AttendanceAnalytics } from '../../components/attendance-analytics/attendance-analytics';
import { UserProfileService } from '../../services/fire/user-profile.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, AttendanceAnalytics],
  templateUrl: './dashboard.html',
})
export class DashboardComponent {
  private svc = inject(SessionService);
  private router = inject(Router);
  profile = inject(UserProfileService).profile;

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
