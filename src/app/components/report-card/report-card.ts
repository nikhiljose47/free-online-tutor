import { Component, ChangeDetectionStrategy, inject, signal, effect, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { UserProfileService } from '../../services/fire/user-profile.service';
import { MeetingsService } from '../../domain/meetings/meetings.service';
import { Auth2Service } from '../../services/fire/auth2.service';

@Component({
  selector: 'report-card',
  standalone: true,
  imports: [CommonModule, DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './report-card.html',
})
export class ReportCard implements OnInit {
  private meetApi = inject(MeetingsService);
  private authApi = inject(Auth2Service);
  loading = signal(true);
  meetings = signal<any[]>([]);

  ngOnInit(): void {
    const teacherId = this.authApi.uid;
    if (!teacherId) return;

    this.meetApi.getMeetingsByTecher(teacherId).subscribe((res) => {
      if (res.ok && res.data) {
        // normalize → array
        this.meetings.set(Array.isArray(res.data) ? res.data : [res.data]);
      }
      this.loading.set(false);
    });
  }
}
