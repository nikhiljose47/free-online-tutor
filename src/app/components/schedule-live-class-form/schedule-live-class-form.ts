import {
  Component,
  ChangeDetectionStrategy,
  signal,
  computed,
  inject,
  OnInit,
  Output,
  EventEmitter,
  Input,
  effect,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Timestamp } from '@angular/fire/firestore';

import { Meeting } from '../../models/meeting.model';
import { GLOBAL_MEETINGS, PART1 } from '../../core/constants/app.constants';
import { UserProfileService } from '../../core/services/fire/user-profile.service';

import { SyllabusLookupService } from '../../services/syllabus/syllabus-lookup.service';
import { CatalogLookupService } from '../../domain/syllabus-index/catalog-lookup.service';
import { ClassSubjectStore } from '../../store/class-store/class-subject.store';
import { combineLatest, map, Observable, of, shareReplay, switchMap } from 'rxjs';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { MeetingsService } from '../../services/meetings/meetings.service';
import { ToastService } from '../../shared/toast.service';
import { Auth2Service } from '../../core/services/fire/auth2.service';

@Component({
  selector: 'schedule-live-class-form',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './schedule-live-class-form.html',
  styleUrl: './schedule-live-class-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScheduleLiveClassForm implements OnInit {
  @Input({ required: true }) teacherId!: string | null;
  @Output() onSubmit = new EventEmitter<void>();

  private syllabusLookup = inject(SyllabusLookupService);
  private catalogLookup = inject(CatalogLookupService);
  private classStoreApi = inject(ClassSubjectStore);
  private meetApi = inject(MeetingsService);
  private toastApi = inject(ToastService);
  private user = inject(UserProfileService);

  readonly profile = this.user.profile;


  /* ================= FORM ================= */

  readonly form = signal({
    group: '',
    classId: '',
    subjectId: '',
    chapterCode: '',
    divisionId: '',
    batchId: '',
    meetLink: '',
    date: '',
    time: '',
    duration: 30,
  });

  readonly submitting = signal(false);

  /* ================= LOOKUPS ================= */

  readonly groupList = this.catalogLookup.groups;
  readonly batchList = this.catalogLookup.primaryGroups;
  readonly classList = toSignal(this.syllabusLookup.getClassIds(), { initialValue: [] });

  readonly selectedClass = computed(() => this.form().classId);
  readonly selectedSubject = computed(() => this.form().subjectId);

  readonly subjectList = toSignal(
    toObservable(this.selectedClass).pipe(
      switchMap((classId) => (classId ? this.syllabusLookup.getSubjects(classId) : of([]))),
    ),
    { initialValue: [] },
  );

  readonly chapterList$ = toObservable(
    computed(() => ({
      classId: this.selectedClass(),
      subjectId: this.selectedSubject(),
    })),
  ).pipe(
    switchMap(({ classId, subjectId }) => {
      if (!classId || !subjectId) {
        return of([]);
      }

      return this.syllabusLookup.getChapters(classId, subjectId);
    }),
  );

  readonly chapterList = toSignal(this.chapterList$, {
    initialValue: [],
  });
  readonly divisions$ = combineLatest([
    toObservable(this.selectedClass),
    toObservable(this.selectedSubject),
    toObservable(this.form),
  ]).pipe(
    switchMap(([classId, subjectId, form]) => {
      if (!classId || !subjectId || !form.chapterCode) {
        return of([]);
      }

      return this.syllabusLookup.getDivisions(classId, subjectId, form.chapterCode);
    }),
  );

  readonly divisions = toSignal(this.divisions$, {
    initialValue: [],
  });
  currentAndNext$: Observable<string[]> = of([]);

  /* ================= VALIDATION ================= */

  readonly isValid = computed(() => {
    const f = this.form();
    return !!(
      f.group &&
      f.classId &&
      f.subjectId &&
      f.chapterCode &&
      f.batchId &&
      f.date &&
      f.time &&
      this.isValidUrl(f.meetLink)
    );
  });

  // currentAndNext$ = this.classStoreApi.getCurrentAndNextIndex(
  //   f.classId,
  //   subjectId,
  //   chapterId,
  //   divisionId,
  // );

  constructor() {
    this.teacherId = this.profile()?.uid ?? null;
  }

  ngOnInit(): void {
    if (!this.teacherId) {
      this.teacherId = this.user.profile()?.uid ?? null;
    }

    this.currentAndNext$ = this.classStoreApi
      .getCurrentAndNextIndex('CL06', 'CL06-MATH')
      .pipe(shareReplay({ bufferSize: 1, refCount: true }));
  }

  /* ================= HELPERS ================= */

  isValidUrl(url: string): boolean {
    try {
      return !!new URL(url);
    } catch {
      return false;
    }
  }

  updateField<K extends keyof ReturnType<typeof this.form>>(
    key: K,
    value: ReturnType<typeof this.form>[K],
  ) {
    this.form.update((f) => ({
      ...f,
      [key]: value,
    }));
  }

  /* ================= SUBMIT ================= */

  async scheduleClass() {
    const f = this.form();

    if (!this.isValid() || this.submitting()) {
      this.toastApi.show('Invalid form!');
      return;
    }
    if (!f.date) {
      this.toastApi.show('Invalid date');
      return;
    }
    if (!f.classId) {
      this.toastApi.show('Invalid class id');
      return;
    }
    if (!this.teacherId) {
      this.toastApi.show('Invalid teacher id');
      return;
    }

    this.submitting.set(true);
    let imageSrc = this.catalogLookup.getById(f.classId)?.file ?? '';
    let teacherInfo = { id: this.teacherId, name: this.profile()?.name ?? '' };
    this.meetApi.scheduleMeeting$(f, imageSrc, teacherInfo).subscribe((e) => {
      this.onSubmit.emit();
      this.submitting.set(false);
    });

    // const [hours, minutes] = f.time.split(':').map(Number);

    // const date = new Date(f.date);
    // date.setHours(hours, minutes, 0, 0);

    // const start = new Date(date);
    // const end = new Date(start.getTime() + (f.duration ?? 0) * 60000);

    // const payload: Meeting = {
    //   id: '',
    //   classId: f.classId,
    //   subjectId: f.subjectId,
    //   chapterCode: f.chapterCode,
    //   batchId: f.batchId,
    //   meetLink: f.meetLink,
    //   status: PART1,
    //   teacherId: this.teacherId,
    //   teacherName: this.profile()?.name ?? '',
    //   duration: f.duration,
    //   attendance: [],
    //   date: Timestamp.fromDate(start),
    //   endAt: Timestamp.fromDate(end),
    //   createdAt: Timestamp.now(),
    //   imageSrc: this.catalogLookup.getById(f.classId)?.file ?? '',
    // };
    // this.fire.add(GLOBAL_MEETINGS, payload).subscribe(() => {
    //   this.onSubmit.emit();
    //   this.submitting.set(false);
    // });

    this.classStoreApi.setCurrentIndex(f.classId, f.subjectId, 'chapter-5').subscribe();
  }
}
