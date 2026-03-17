import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Timestamp } from '@angular/fire/firestore';

import { SyllabusLookupService } from '../../services/syllabus/syllabus-lookup.service';
import { UserProfileService } from '../../core/services/fire/user-profile.service';
import { FirestoreDocService } from '../../core/services/fire/firestore-doc.service';
import { Meeting } from '../../models/meeting.model';
import { PART1, COMPLETED, GLOBAL_MEETINGS } from '../../core/constants/app.constants';
import { Auth2Service } from '../../core/services/fire/auth2.service';
import { ClassWrapup } from '../../components/class-wrapup/class-wrapup';
import { UiStateUtil } from '../../shared/state/ui-state.utils';
import { MeetingsService } from '../../services/meetings/meetings.service';
import { ScheduleLiveClassForm } from '../../components/schedule-live-class-form/schedule-live-class-form';
import {
  SessionAssessmentEntryComponent,
  SessionImportRow,
} from '../../shared/components/session-assessment-entry.component/session-assessment-entry.component';
import { StudentSessionResult } from '../../models/assessment/student-session-result.model';
import { ToastService } from '../../shared/toast.service';
import { StudentSessionResultsListComponent } from '../../shared/components/student-session-results-list.component/student-session-results-list.component';
import { StudentAssessmentService } from '../../services/assessment/student-assessment.service';

@Component({
  selector: 'schedule-live-class',
  standalone: true,
  imports: [
    CommonModule,
    StudentSessionResultsListComponent,
    ClassWrapup,
    ScheduleLiveClassForm,
    SessionAssessmentEntryComponent,
  ],
  templateUrl: './schedule-live-class.html',
  styleUrl: './schedule-live-class.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScheduleLiveClass implements OnInit {
  /* ------------------ services ------------------ */
  private meetApi = inject(MeetingsService);
  private assessmentApi = inject(StudentAssessmentService);
  private fire = inject(FirestoreDocService);
  private authApi = inject(Auth2Service);
  private uiStateUtil = inject(UiStateUtil);
  private toastApi = inject(ToastService);
  private user = inject(UserProfileService);

  readonly profile = this.user.profile;

  /* ------------------ UI state ------------------ */
  readonly meetings = signal<Meeting[]>([]);
  readonly selectedMeeting = signal<Meeting | null>(null);
  readonly mode = signal<'view' | 'create'>('view');
  readonly submitting = signal(false);
  teacherId: string | null = this.authApi.uid ?? null;
  sessionResults = signal<StudentSessionResult[]>([]);
  batchList = signal<Array<string>>([]);

  assessmentImportOpen = signal(false);

  /* ------------------ lifecycle ------------------ */
  ngOnInit(): void {
    if (!this.teacherId) return;

    /* load meetings */
    this.meetApi.getLiveMeetingsByTeacher(this.teacherId).subscribe((res) => {
      if (res.ok && res.data) {
        const list = res.data as Meeting[];
        this.meetings.set(list);

        /* cache in UI state */
        list.forEach((m) => this.uiStateUtil.set(m.id, m));
      }
    });
  }

  isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  onScheduleSuccess() {
    this.mode.set('view');
  }

  openAssessmentImport() {
    this.assessmentImportOpen.set(true);
  }

  handleImportedData(rows: SessionImportRow[]) {
    if (!this.selectedMeeting()) {
      this.toastApi.show('No meeting selected for import');
      return;
    }

    const data: StudentSessionResult[] = rows.map((r) => ({
      studentUid: 'dummy_uid',
      studentId: r.studentId ?? null,
      sessionId: this.selectedMeeting()!.id ?? '',
      subjectId: this.selectedMeeting()!.subjectId,
      chapterCode: this.selectedMeeting()!.chapterCode,
      divisionCode: 'division_dummy',

      sessionType: 'class',

      assignmentMarks: Number(r.assignmentMarks ?? 0),
      maxMarks: Number(r.maxMarks ?? 0),

      engagementScore: Number(r.engagementScore ?? 0),
      remarks: r.remarks ?? '',
      createdAt: Timestamp.now(),
    }));

    this.sessionResults.set(data);
    //console.log('Converted', data);
  }

  /* ------------------ template helpers ------------------ */
  trackByMeetingId(index: number, m: Meeting) {
    return m.id;
  }

  /* ------------------ UI actions ------------------ */
  selectMeeting(m: Meeting) {
    this.selectedMeeting.set(m);
    this.mode.set('view');
  }

  startCreate() {
    this.selectedMeeting.set(null);
    this.mode.set('create');
  }

  submitClass() {
    this.assessmentApi.saveSessions(this.sessionResults()).subscribe(() => {
      this.toastApi.show('Sessions saved');
    });
    const m = this.selectedMeeting();
    if (!m) return;

    this.fire.update(GLOBAL_MEETINGS, m.id, {
      status: COMPLETED,
      endAt: Timestamp.now(),
    });
  }
}
