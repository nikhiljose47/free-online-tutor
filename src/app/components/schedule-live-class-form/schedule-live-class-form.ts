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
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { combineLatest, Observable, of, shareReplay, switchMap } from 'rxjs';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';

import { UserProfileService } from '../../core/services/fire/user-profile.service';
import { SyllabusLookupService } from '../../services/syllabus/syllabus-lookup.service';
import { CatalogLookupService } from '../../domain/syllabus-index/catalog-lookup.service';
import { ClassSubjectStore } from '../../store/class-store/class-subject.store';
import { MeetingsService } from '../../services/meetings/meetings.service';
import { ToastService } from '../../shared/toast.service';


interface ScheduleForm {
  classId: string;
  subjectId: string;
  chapterCode: string;
  divisionId: string;
  batchId: string;
  meetLink: string;
  date: string;
  time: string;
  duration: number;
}

@Component({
  selector: 'schedule-live-class-form',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './schedule-live-class-form.html',
  styleUrl: './schedule-live-class-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScheduleLiveClassForm implements OnInit {
  @Input({ required: true }) teacherId!: string;
  @Output() onSubmit = new EventEmitter<void>();

  private syllabusLookup = inject(SyllabusLookupService);
  private catalogLookup = inject(CatalogLookupService);
  private classStore = inject(ClassSubjectStore);
  private meetingsService = inject(MeetingsService);
  private toastService = inject(ToastService);
  private userProfile = inject(UserProfileService);

  readonly profile = this.userProfile.profile;
  readonly form = signal<ScheduleForm>({
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
  readonly groupList = this.catalogLookup.groups;
  readonly batchList = this.catalogLookup.primaryGroups;
  readonly classNameMap = toSignal(this.syllabusLookup.getClassNameMap(), {
    initialValue: new Map<string, string>(),
  });

  readonly selectedClass = computed(() => this.form().classId);
  readonly selectedSubject = computed(() => this.form().subjectId);
  readonly selectedChapter = computed(() => this.form().chapterCode);

  readonly subjectList = toSignal(
    toObservable(this.selectedClass).pipe(
      switchMap((classId) => (classId ? this.syllabusLookup.getSubjects(classId) : of([]))),
    ),
    { initialValue: [] },
  );

  readonly chapterList$ = combineLatest([
    toObservable(this.selectedClass),
    toObservable(this.selectedSubject),
  ]).pipe(
    switchMap(([classId, subjectId]) => {
      if (!classId || !subjectId) return of([]);
      return this.syllabusLookup.getChapters(classId, subjectId);
    }),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  readonly chapterList = toSignal(this.chapterList$, { initialValue: [] });

  readonly divisions$ = combineLatest([
    toObservable(this.selectedClass),
    toObservable(this.selectedSubject),
    toObservable(this.selectedChapter),
  ]).pipe(
    switchMap(([classId, subjectId, chapterCode]) => {
      if (!classId || !subjectId || !chapterCode) return of([]);
      return this.syllabusLookup.getDivisions(classId, subjectId, chapterCode);
    }),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  readonly divisions = toSignal(this.divisions$, { initialValue: [] });
  currentAndNext$: Observable<string[]> = of([]);
  readonly isValid = computed(() => {
    const f = this.form();
    return (
      !!f.classId &&
      !!f.subjectId &&
      !!f.chapterCode &&
      !!f.batchId &&
      !!f.date &&
      !!f.time &&
      this.isValidUrl(f.meetLink)
    );
  });

  
  ngOnInit(): void {
    this.currentAndNext$ = this.classStore
      .getCurrentAndNextIndex('CL06', 'CL06-MATH')
      .pipe(shareReplay({ bufferSize: 1, refCount: true }));
  }

  updateField<K extends keyof ScheduleForm>(key: K, value: ScheduleForm[K]) {
    this.form.update((f) => ({ ...f, [key]: value }));
  }

  isValidUrl(url: string): boolean {
    try {
      return !!new URL(url);
    } catch {
      return false;
    }
  }

  scheduleClass() {
    if (!this.isValid() || this.submitting()) {
      this.toastService.show('Invalid form!');
      return;
    }
    if (!this.profile()?.uid) {
      this.toastService.show('Invalid teacher id');
      return;
    }

    this.submitting.set(true);
    const f = this.form();
    const payload = {
      ...f,
      imageSrc: this.catalogLookup.getById(f.classId)?.file ?? '',
      teacherId: this.profile()?.uid ?? '',
      teacherName: this.profile()?.name ?? '',
      className: this.classNameMap().get(f.classId) ?? '',
      subjectName: this.subjectList().find((s) => s.code === f.subjectId)?.name ?? '',
      chapterName: this.chapterList().find((c) => c.code === f.chapterCode)?.name ?? '',
    };

    this.meetingsService.scheduleMeeting$(payload).subscribe({
      next: () => {
        this.onSubmit.emit();
        this.submitting.set(false);
      },
      error: () => {
        this.submitting.set(false);
        this.toastService.show('Failed to schedule class');
      },
    });

    this.classStore.setCurrentIndex(f.classId, f.subjectId, 'chapter-5').subscribe();
  }
}
