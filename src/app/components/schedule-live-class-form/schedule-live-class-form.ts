import { Component, ChangeDetectionStrategy, input, output, signal, computed, inject, Injectable } from '@angular/core';
import { combineLatest, map, startWith } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

type Chapter = { code: string; name: string };

@Component({
  selector: 'schedule-live-class-form',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './schedule-live-class-form.html',
  styleUrl:  './schedule-live-class-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScheduleLiveClassForm {

  /* ================= INPUT / OUTPUT ================= */

  readonly presetClassId = input<string | null>(null);
  readonly scheduled = output<any>();

  /* ================= SERVICES ================= */

  private readonly classApi = inject(ClassDataService);
  private readonly subjectApi = inject(SubjectDataService);
  private readonly chapterApi = inject(ChapterDataService);
  private readonly batchApi = inject(BatchDataService);
  private readonly sessionApi = inject(SessionDataService);

  /* ================= STATE ================= */

  private readonly form = signal({
    classId: this.presetClassId(),
    subjectId: '',
    chapterCode: '',
    batchId: '',
    meetLink: '',
    date: '',
    time: ''
  });

  readonly submitting = signal(false);

  /* ================= DATA STREAMS ================= */

  private readonly class$ = this.classApi.list().pipe(startWith([]));
  private readonly subject$ = this.subjectApi.list().pipe(startWith([]));
  private readonly chapter$ = this.chapterApi.list().pipe(startWith([]));
  private readonly batch$ = this.batchApi.list().pipe(startWith([]));

  readonly classList = toSignal(this.class$, { initialValue: [] as string[] });
  readonly subjectList = toSignal(this.subject$, { initialValue: [] as string[] });
  readonly chapterList = toSignal(this.chapter$, { initialValue: [] as Chapter[] });
  readonly batchList = toSignal(this.batch$, { initialValue: [] as string[] });

  /* ================= VALIDATION ================= */

  readonly isValid = computed(() => {
    const f = this.form();
    return !!(
      f.classId &&
      f.subjectId &&
      f.chapterCode &&
      f.batchId &&
      this.isValidUrl(f.meetLink) &&
      f.date &&
      f.time
    );
  });

  isValidUrl(url: string): boolean {
    try { return !!new URL(url); } catch { return false; }
  }

  /* ================= FORM UPDATE ================= */

  updateField<K extends keyof ReturnType<typeof this.form>>(key: K, value: string) {
    this.form.update(f => ({ ...f, [key]: value }));
  }

  /* ================= SUBMIT ================= */

  async scheduleClass() {
    if (!this.isValid() || this.submitting()) return;

    this.submitting.set(true);

    const payload = {
      ...this.form(),
      scheduledAt: new Date(`${this.form().date}T${this.form().time}`)
    };

    try {
      const res = await this.sessionApi.create(payload);
      this.scheduled.emit(res);
      this.form.set({ classId: this.presetClassId(), subjectId: '', chapterCode: '', batchId: '', meetLink: '', date: '', time: '' });
    } finally {
      this.submitting.set(false);
    }
  }
}


import { delay, of } from 'rxjs';
import { CommonModule } from '@angular/common';

/* ================= TYPES ================= */


/* ================= CLASS ================= */

@Injectable({ providedIn: 'root' })
export class ClassDataService {
  list() {
    return of([
      'Class 7',
      'Class 8',
      'Class 9',
      'Class 10'
    ]).pipe(delay(300));
  }
}

/* ================= SUBJECT ================= */

@Injectable({ providedIn: 'root' })
export class SubjectDataService {
  list() {
    return of([
      'Mathematics',
      'Science',
      'English'
    ]).pipe(delay(300));
  }
}

/* ================= CHAPTER ================= */

@Injectable({ providedIn: 'root' })
export class ChapterDataService {
  list() {
    const data: Chapter[] = [
      { code: 'CH1', name: 'Introduction' },
      { code: 'CH2', name: 'Basics' },
      { code: 'CH3', name: 'Advanced Concepts' }
    ];
    return of(data).pipe(delay(300));
  }
}

/* ================= BATCH ================= */

@Injectable({ providedIn: 'root' })
export class BatchDataService {
  list() {
    return of([
      'Batch A',
      'Batch B',
      'Batch C'
    ]).pipe(delay(300));
  }
}

/* ================= SESSION ================= */

@Injectable({ providedIn: 'root' })
export class SessionDataService {
  async create(data: any): Promise<any> {
    await new Promise(r => setTimeout(r, 500));

    return {
      id: crypto.randomUUID(),
      ...data,
      createdAt: new Date().toISOString()
    };
  }
}

