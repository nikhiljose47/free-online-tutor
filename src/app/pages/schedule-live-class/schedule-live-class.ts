import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Timestamp } from '@angular/fire/firestore';

import { MeetingsService } from '../../domain/meetings/meetings.service';
import { SyllabusLookupService } from '../../services/syllabus/syllabus-lookup.service';
import { UserProfileService } from '../../services/fire/user-profile.service';
import { FirestoreDocService } from '../../services/fire/firestore-doc.service';
import { Meeting } from '../../models/meeting.model';
import { PART1, COMPLETED, GLOBAL_MEETINGS } from '../../core/constants/app.constants';
import { Auth2Service } from '../../services/fire/auth2.service';
import { ClassWrapup } from '../../components/class-wrapup/class-wrapup';
import { UiStateUtil } from '../../utils/ui-state.utils';

@Component({
  selector: 'schedule-live-class',
  standalone: true,
  imports: [CommonModule, ClassWrapup],
  templateUrl: './schedule-live-class.html',
  styleUrl: './schedule-live-class.scss',
})
export class ScheduleLiveClass implements OnInit {
  /* ------------------ services ------------------ */
  private meetApi = inject(MeetingsService);
  private syllabus = inject(SyllabusLookupService);
  private user = inject(UserProfileService);
  private fire = inject(FirestoreDocService);
  private authApi = inject(Auth2Service);
  private uiStateUtil = inject(UiStateUtil);
  profile = inject(UserProfileService).profile;
  /* ------------------ UI state ------------------ */
  meetings = signal<Meeting[]>([]);
  selectedMeeting = signal<Meeting | null>(null);
  mode = signal<'view' | 'create'>('view');
  submitting = signal(false);
  teacherId: string | undefined;

  /* ------------------ form (single object) ------------------ */
  form = signal({
    classId: '',
    subjectId: '',
    chapterCode: '',
    batchId: '',
    meetLink: '',
    date: '',
    duration: 30,
  });

  /* ------------------ lookups ------------------ */
  classList = computed(() => this.syllabus.getClassNames());

  subjectList = computed(() =>
    this.form().classId ? this.syllabus.getSubjects(this.form().classId) : []
  );

  chapterList = computed(() =>
    this.form().classId && this.form().subjectId
      ? this.syllabus.getChapters(this.form().classId, this.form().subjectId)
      : []
  );

  ngOnInit(): void {
    this.teacherId = this.authApi.uid;
    if (!this.teacherId) return;

    this.meetApi.getLiveMeetingsByTeacher(this.teacherId).subscribe((res) => {
      if (res.ok && res.data) {
        this.meetings.set(res.data as Meeting[]);
        this.meetings().forEach((e) => this.uiStateUtil.set(e.id, e));
      }
    });
  }

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

  /* ------------------ business actions ------------------ */
  scheduleClass() {
    const f = this.form();

    if (!this.teacherId || !f.date) return;

    this.submitting.set(true);

    const start = new Date(f.date);
    const end = new Date(start.getTime() + f.duration * 60000);

    const payload: Meeting = {
      id: '',
      classId: f.classId,
      subjectId: f.subjectId,
      chapterCode: f.chapterCode,
      batchId: f.batchId,
      meetLink: f.meetLink,
      status: PART1,
      date: Timestamp.fromDate(start),
      teacherId: this.teacherId,
      teacherName: this.user.profile?.name ?? '',
      duration: f.duration,
      attendance: [],
      createdAt: Timestamp.now(),
      endAt: Timestamp.fromDate(end),
    };

    this.fire.add(GLOBAL_MEETINGS, payload).subscribe(() => {
      this.submitting.set(false);
      this.mode.set('view');
    });
  }

  updateField<K extends keyof typeof this.form extends never ? never : any>(
    key: 'classId' | 'subjectId' | 'chapterCode' | 'batchId' | 'meetLink' | 'date',
    value: string
  ) {
    this.form.update((f) => ({ ...f, [key]: value }));
  }

  endClass() {
    const m = this.selectedMeeting();
    if (!m) return;

    this.fire.update(GLOBAL_MEETINGS, m.id, {
      status: COMPLETED,
      endAt: Timestamp.now(),
    });
  }
}
