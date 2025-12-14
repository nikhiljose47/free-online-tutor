import { Component, ChangeDetectionStrategy, inject, signal, effect } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { UserProfileService } from '../../services/fire/user-profile.service';
import { MeetingsService } from '../../domain/meetings/meetings.service';

@Component({
  selector: 'report-card',
  standalone: true,
  imports: [CommonModule, DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './report-card.html',
})
export class ReportCard {
  private user = inject(UserProfileService);
  private meetApi = inject(MeetingsService);

  loading = signal(true);
  meetings = signal<any[]>([]);

  constructor() {
    const teacherId = this.user.profile()?.uid;

    if (!teacherId) return;

    this.meetApi.getMeetingsByTecher('hqMujan3ozLE2okrCm5F4rlO1PA2').subscribe((res) => {
      if (res.ok && res.data) {
        // normalize → array
        this.meetings.set(Array.isArray(res.data) ? res.data : [res.data]);
      }
      this.loading.set(false);
    });
  }
}
