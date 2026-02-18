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

@Component({
  selector: 'schedule-live-class',
  standalone: true,
  imports: [CommonModule, ClassWrapup, ScheduleLiveClassForm],
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

  readonly selectedClassId = computed(() => this.form().classId);
  readonly selectedSubjectId = computed(() => this.form().subjectId);
  readonly subjectList = computed(() => {
    const classId = this.selectedClassId();
    return classId ? this.syllabus.getSubjects(classId) : [];
  });

  readonly chapterList = computed(() => {
    const classId = this.selectedClassId();
    const subjectId = this.selectedSubjectId();
    this.getCurrentChapter('batch-blue', subjectId);

    if (!classId || !subjectId) return [];

    return this.syllabus.getChapters(classId, subjectId);
  });

  batchList = signal<Array<string>>([]);

  /* ------------------ lifecycle ------------------ */
  ngOnInit(): void {
    this.teacherId = this.authApi.uid;
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

  getCurrentChapter(batchId: string, subCode: string) {
    // this.indexService.getCurrentChapterCode$(batchId, subCode).subscribe((e) => {
    //   console.log('value got', e);
    // });
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
      classId: this.syllabus.getClass(f.classId)?.classId ?? '',
      subjectId: f.subjectId,
      chapterCode: f.chapterCode,
      batchId: f.batchId,
      meetLink: f.meetLink,
      status: PART1,
      teacherId: this.teacherId,
      teacherName: this.profile()?.name ?? '',
      duration: f.duration,
      attendance: [],
      date: Timestamp.fromDate(start),
      createdAt: Timestamp.now(),
      endAt: Timestamp.fromDate(end),
    };

    this.fire.add(GLOBAL_MEETINGS, payload).subscribe(() => {
      this.submitting.set(false);
      this.mode.set('view');
    });
  }

  updateField(
    key: 'classId' | 'subjectId' | 'chapterCode' | 'batchId' | 'meetLink' | 'date' | 'time',
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
