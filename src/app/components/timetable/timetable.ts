import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { UiStateUtil } from '../../state/ui-state.utils';
import { ClassSyllabus } from '../../models/syllabus/class-syllabus';
import { SyllabusRepository } from '../../data/repositories/syllabus.repository';

@Component({
  selector: 'timetable',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './timetable.html',
  styleUrls: ['./timetable.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Timetable implements OnInit {
  @Input({ required: true }) classFileId!: string;
  
  private syllRepo = inject(SyllabusRepository);

  /** full syllabus */
  readonly syllabus = signal<ClassSyllabus | null>(null);

  /** current chapter code per subjectCode */
  readonly current = signal<Record<string, string>>({});

  /** numeric progress index per subjectCode */
  readonly progressIndex = signal<Record<string, number>>({});

  readonly subjects = computed(() => {
    const data = this.syllabus();
    if (!data) return [];

    return Array.isArray(data.subjects)
      ? data.subjects
      : Object.values(data.subjects ?? {}).map((s: any) => ({
          ...s,
          chapters: Array.isArray(s.chapters) ? s.chapters : Object.values(s.chapters ?? {}),
        }));
  });

  ngOnInit(): void {
    this.syllRepo.loadClass(this.classFileId).subscribe((data) => {
      if (!data) {
        console.error('[Timetable] Syllabus missing');
        return;
      }

      const normalized = this.normalizeSyllabus(data);

      this.syllabus.set(normalized);
      console.log(normalized);
      this.initRandomProgress(normalized);
    });
  }

  /* ------------------------------------ */
  /* helpers                              */
  /* ------------------------------------ */

  private initRandomProgress(data: ClassSyllabus): void {
    const cur: Record<string, string> = {};
    const prog: Record<string, number> = {};

    data.subjects.forEach((subject) => {
      const chapters = subject.chapters; // already normalized

      const total = chapters.length;
      if (total === 0) return;

      const idx = Math.floor(Math.random() * total);

      prog[subject.code] = idx;
      cur[subject.code] = chapters[idx].code; // ✅ FIXED
    });

    this.progressIndex.set(prog);
    this.current.set(cur);
  }

  normalizeSyllabus(data: any): ClassSyllabus {
    return {
      ...data,
      subjects: Object.values(data.subjects ?? {}).map((s: any) => ({
        ...s,
        chapters: Object.values(s.chapters ?? {}),
      })),
    };
  }

  getChapterName(subjectCode: string, chapterCode: string): string {
    const data = this.syllabus();
    if (!data) return '';

    const subject = data.subjects.find((s) => s.code === subjectCode);
    return subject?.chapters.find((c) => c.code === chapterCode)?.name ?? '';
  }

  /* ------------------------------------ */
  /* derived flags (template helpers)     */
  /* ------------------------------------ */

  isCompleted(subjectCode: string, idx: number): boolean {
    return idx < (this.progressIndex()[subjectCode] ?? -1);
  }

  isCurrent(subjectCode: string, chapterCode: string): boolean {
    return this.current()[subjectCode] === chapterCode;
  }

  isLocked(subjectCode: string, idx: number): boolean {
    return idx > (this.progressIndex()[subjectCode] ?? -1);
  }

  getProgress(subjectCode: string): number {
    return this.progressIndex()[subjectCode] ?? -1;
  }

  getCurrent(subjectCode: string): string | null {
    return this.current()[subjectCode] ?? null;
  }
}
