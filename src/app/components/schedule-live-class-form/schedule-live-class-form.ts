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
import { of } from 'rxjs';

import { UserProfileService } from '../../core/services/fire/user-profile.service';
import { CatalogLookupService } from '../../domain/syllabus-index/catalog-lookup.service';
import { MeetingsService } from '../../services/meetings/meetings.service';
import { ToastService } from '../../shared/toast.service';
import { ClassLookupService } from '../../services/syllabus/class-lookup/class-lookup.service';

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

  private classLookup = inject(ClassLookupService);
  private catalogLookup = inject(CatalogLookupService);
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

  constClassNameMap = signal<Record<string, string>>({});

  readonly selectedClass = computed(() => this.form().classId);
  readonly selectedSubject = computed(() => this.form().subjectId);
  readonly selectedChapter = computed(() => this.form().chapterCode);

  readonly subjectList = computed(() => {
    const cls = this.selectedClass();
    return cls && this.classLookup.hasData(cls)
      ? this.classLookup.getSubjects(cls)
      : [];
  });

  readonly chapterList = computed(() => {
    const cls = this.selectedClass();
    const sub = this.selectedSubject();

    return cls && sub && this.classLookup.hasData(cls)
      ? this.classLookup.getChapters(cls, sub)
      : [];
  });

  readonly divisions = computed(() => {
    const cls = this.selectedClass();
    const sub = this.selectedSubject();
    const ch = this.selectedChapter();

    return cls && sub && ch && this.classLookup.hasData(cls)
      ? this.classLookup.getDivisions(cls, sub, ch)
      : [];
  });

  currentAndNext$ = of(['chapter-1', 'chapter-2']); // replace with store later

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
    const cls = 'class_10'; // dummy initial
    this.classLookup.load(cls).subscribe((ok) => {
      if (!ok) return;

      this.form.update((f) => ({
        ...f,
        classId: cls,
        subjectId: this.classLookup.getSubjects(cls)[0]?.code ?? '',
      }));

      this.constClassNameMap.set({
        [cls]: this.classLookup.getClassName(cls),
      });
    });
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
      className: this.constClassNameMap()[f.classId] ?? '',
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

    // replace later with real store sync
    console.log('Persist current index', f.classId, f.subjectId, f.chapterCode);
  }
}