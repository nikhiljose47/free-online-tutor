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
import { UiStateUtil } from '../../state/ui-state.utils';
import { SyllabusStore } from '../../state/syllabus.store';

@Component({
  selector: 'schedule-live-class',
  standalone: true,
  imports: [CommonModule, ClassWrapup],
  templateUrl: './schedule-live-class.html',
  styleUrl: './schedule-live-class.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScheduleLiveClass implements OnInit {
  /* ------------------ services ------------------ */
  private meetApi = inject(MeetingsService);
  private syllabus = inject(SyllabusLookupService);
  private user = inject(UserProfileService);
  private fire = inject(FirestoreDocService);
  private authApi = inject(Auth2Service);
  private uiStateUtil = inject(UiStateUtil);
  private syllabusStore = inject(SyllabusStore)

  readonly profile = this.user.profile;

  /* ------------------ UI state ------------------ */
  readonly meetings = signal<Meeting[]>([]);
  readonly selectedMeeting = signal<Meeting | null>(null);
  readonly mode = signal<'view' | 'create'>('view');
  readonly submitting = signal(false);
  private teacherId: string | undefined;

  /* ------------------ form (single object) ------------------ */
  readonly form = signal({
    classId: '',
    subjectId: '',
    chapterCode: '',
    batchId: '',
    meetLink: '',
    date: '',
    duration: 30,
  });

  /* ------------------ lookups (signal-safe) ------------------ */
  readonly classList = this.syllabus.classNames;

  readonly subjectList = computed(() => {
    const f = this.form();
    return f.classId ? this.syllabus.getSubjects(f.classId) : [];
  });

  readonly chapterList = computed(() => {
    const f = this.form();
    return f.classId && f.subjectId ? this.syllabus.getChapters(f.classId, f.subjectId) : [];
  });

  /* ------------------ lifecycle ------------------ */
  ngOnInit(): void {
    this.teacherId = this.authApi.uid;
    if (!this.teacherId) return;

    /* ensure lookup initialized once */
    this.syllabus.init();
    
      this.syllabusStore.getAllClasses$().subscribe((data) => {
           console.log('Syllabus 1:', data);

    });
    this.syllabus.waitUntilReady().then(() => {
      console.log('✅ Syllabus ready:', this.syllabus.getClassNames());
    });
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
      teacherName: this.profile?.name ?? '',
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

  updateField(
    key: 'classId' | 'subjectId' | 'chapterCode' | 'batchId' | 'meetLink' | 'date',
    value: string,
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
