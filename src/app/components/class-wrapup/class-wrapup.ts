import { ChangeDetectionStrategy, Component, inject, Input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AttendanceApiService } from '../../features/attendance/attendance-api.service';
import { UiStateUtil } from '../../core/state/ui-state.utils';
import { Meeting } from '../../models/meeting.model';
import { DotLoader } from '../dot-loader/dot-loader';

interface Student {
  id: string;
  name: string;
  present: boolean;
}

@Component({
  selector: 'class-wrapup',
  standalone: true,
  imports: [CommonModule, DotLoader],
  templateUrl: './class-wrapup.html',
  styleUrls: ['./class-wrapup.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClassWrapup implements OnInit {
  @Input({ required: true }) meetId!: string;

  private attendanceApi = inject(AttendanceApiService);
  private uiState = inject(UiStateUtil);

  meeting!: Meeting;

  /** UI state */
  readonly isLoading = signal(true);
  readonly isSavingAttendance = signal(false);

  /** Attendance list */
  readonly students = signal<Student[]>([]);
  readonly feedback = signal('');

  ngOnInit(): void {
    this.loadMeeting();
    this.loadStudents();
  }

  private loadMeeting(): void {
    const meeting = this.uiState.get<Meeting>(this.meetId);

    if (!meeting) {
      console.error('[ClassWrapup] Meeting not found in UiStateUtil');
      return;
    }

    this.meeting = meeting;
  }

  private loadStudents(): void {
    /**
     * API returns only userIds + names
     * attendance already exists in meeting.attendance
     */
    this.attendanceApi.getUsersBySubjectCode('5', 1, 50).subscribe({
      next: (res) => {
        const presentSet = new Set(this.meeting.attendance ?? []);

        this.students.set(
          res.users.map((u: any) => ({
            id: u.id,
            name: 'to do',
            present: presentSet.has(u.id),
          }))
        );

        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      },
    });
  }

  /* ===============================
     ATTENDANCE
  ================================ */

  toggleAttendance(student: Student): void {
    this.students.update((list) =>
      list.map((s) => (s.id === student.id ? { ...s, present: !s.present } : s))
    );
  }

  scheduleNextClass(): void {
    console.log('Schedule next class for meeting:', this.meeting.id);
  }

  endAndSaveClass(): void {
    if (this.isSavingAttendance()) return;

    this.isSavingAttendance.set(true);

    const payload = {
      meetingId: this.meeting.id,
      presentUserIds: this.students()
        .filter((s) => s.present)
        .map((s) => s.id),
      feedback: this.feedback(),
    };

    // replace with real API
    setTimeout(() => {
      console.log('[ClassWrapup] Saved', payload);
      this.isSavingAttendance.set(false);
    }, 800);
  }
}
