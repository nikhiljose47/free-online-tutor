import { Component, Input, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AttendanceAnalyticsService } from '../../services/fire/analytics/attendance-analytics.service';
import { Meeting } from '../../services/fire/meetings/meetings.service';

@Component({
  selector: 'attendance-analytics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './attendance-analytics.html',
  styleUrls: ['./attendance-analytics.scss'],
})
export class AttendanceAnalytics {
  @Input() meetings: Meeting[] = [];
  @Input() totalStudents = 40;

  constructor(private analytics: AttendanceAnalyticsService) {}

  meetingStats = computed(() =>
    this.meetings.map((m) => ({
      id: m.id ?? 'Session',
      count: this.analytics.countAttendance(m),
      percent: this.analytics.attendancePercentage(m, this.totalStudents),
    }))
  );

  topStudents = computed(() => this.analytics.topStudents(this.meetings, 5));
}
