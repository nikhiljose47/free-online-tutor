import {
  Component,
  ChangeDetectionStrategy,
  input,
  signal,
  computed,
  inject,
  OnInit,
  Injectable,
  Output,
  EventEmitter,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Meeting } from '../../models/meeting.model';
import { Timestamp } from '@angular/fire/firestore';
import { FirestoreDocService } from '../../core/services/fire/firestore-doc.service';
import { GLOBAL_MEETINGS, PART1 } from '../../core/constants/app.constants';
import { Auth2Service } from '../../core/services/fire/auth2.service';
import { UserProfileService } from '../../core/services/fire/user-profile.service';

import { SyllabusLookupService } from '../../services/syllabus/syllabus-lookup.service';
import { CatalogLookupService } from '../../domain/syllabus-index/catalog-lookup.service';

type Chapter = { code: string; name: string };

@Component({
  selector: 'schedule-live-class-form',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './schedule-live-class-form.html',
  styleUrl: './schedule-live-class-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScheduleLiveClassForm implements OnInit {
  /* ================= INPUT / OUTPUT ================= */

  readonly presetClassId = input<string | null>(null);
  @Output() onSubmit = new EventEmitter<void>();

  /* ================= SERVICES ================= */
  private fire = inject(FirestoreDocService);
  private readonly syllabusLookup = inject(SyllabusLookupService);
  private readonly catalogLookup = inject(CatalogLookupService);
  private authApi = inject(Auth2Service);
  private user = inject(UserProfileService);

  readonly profile = this.user.profile;

  /* ================= FORM STATE ================= */

  readonly form = signal({
    group: '' as string,
    classId: this.presetClassId(),
    subjectId: '',
    chapterCode: '',
    batchId: '',
    meetLink: '',
    date: '',
    time: '',
    duration: 30,
  });

  readonly submitting = signal(false);

  /* ================= GROUPS ================= */

  readonly groupList = this.catalogLookup.groups;
  private teacherId: string | undefined;

  readonly batchList = this.catalogLookup.getAllGroupLabels();

  readonly classList = this.syllabusLookup.classNames;

  readonly selectedClassId = computed(() => this.form().classId);
  readonly selectedSubjectId = computed(() => this.form().subjectId);
  readonly subjectList = computed(() => {
    const classId = this.selectedClassId();
    return classId ? this.syllabusLookup.getSubjects(classId) : [];
  });

  readonly chapterList = computed(() => {
    const classId = this.selectedClassId();
    const subjectId = this.selectedSubjectId();
    this.getCurrentChapter('batch-blue', subjectId);

    if (!classId || !subjectId) return [];

    return this.syllabusLookup.getChapters(classId, subjectId);
  });

  /* ================= VALIDATION ================= */

  readonly isValid = computed(() => {
    const f = this.form();
    return !!(
      f.group &&
      f.classId &&
      f.subjectId &&
      f.chapterCode &&
      f.batchId &&
      this.isValidUrl(f.meetLink) &&
      f.date &&
      f.time
    );
  });

  /* ================= INIT ================= */

  ngOnInit(): void {
    this.teacherId = this.authApi.uid;
    if (!this.teacherId) return;
  }

  /* ================= HELPERS ================= */

  isValidUrl(url: string): boolean {
    try {
      return !!new URL(url);
    } catch {
      return false;
    }
  }

  getCurrentChapter(batchId: string, subCode: string) {
    // this.indexService.getCurrentChapterCode$(batchId, subCode).subscribe((e) => {
    //   console.log('value got', e);
    // });
  }

  updateField<K extends keyof ReturnType<typeof this.form>>(key: K, value: string) {
    this.form.update((f) => ({ ...f, [key]: value }));
  }

  /* ================= SUBMIT ================= */

  async scheduleClass() {
    const f = this.form();
    if (!this.isValid() || this.submitting()) return;
    if (!f.date || !f.classId || !this.teacherId) return;

    this.submitting.set(true);

    const start = new Date(f.date);
    const end = new Date(start.getTime() + (f.duration ?? 0) * 60000);

    const payload: Meeting = {
      id: '',
      classId: this.syllabusLookup.getClass(f.classId)?.classId ?? '',
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
      endAt: Timestamp.fromDate(end),
      createdAt: Timestamp.now(),
      imageSrc: this.catalogLookup.getById(f.classId)?.file ?? '',
    };
    this.fire.add(GLOBAL_MEETINGS, payload).subscribe(() => {
      this.onSubmit.emit();
      this.submitting.set(false);
    });
  }
}
