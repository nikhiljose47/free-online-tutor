import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClassSyllabus } from '../../models/syllabus.model';
import { UiStateUtil } from '../../utils/ui-state.utils';

@Component({
  selector: 'timetable',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './timetable.html',
  styleUrls: ['./timetable.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Timetable implements OnInit {
  private uiState = inject(UiStateUtil);

  /** syllabus always comes from resolver → UiStateUtil */
  readonly syllabus = signal<ClassSyllabus | null>(null);

  /** current chapter code per subject */
  readonly current = signal<Record<string, string>>({});

  /** numeric progress index per subject */
  readonly progressIndex = signal<Record<string, number>>({});

  ngOnInit(): void {
    const data = this.uiState.get<ClassSyllabus>('syllabus');

    if (!data) {
      console.error('[Timetable] Syllabus missing in UiStateUtil');
      return;
    }

    this.syllabus.set(data);
    this.initRandomProgress(data);
  }

  /* ------------------------------------ */
  /* helpers                              */
  /* ------------------------------------ */

  private initRandomProgress(data: ClassSyllabus): void {
    const cur: Record<string, string> = {};
    const prog: Record<string, number> = {};

    Object.entries(data.subjects).forEach(([subjectKey, subject]) => {
      const total = subject.chapters.length;
      if (!total) return;

      // random current index: [0 .. total-1]
      const idx = Math.floor(Math.random() * total);

      prog[subjectKey] = idx;
      cur[subjectKey] = subject.chapters[idx].code;
    });

    this.progressIndex.set(prog);
    this.current.set(cur);
  }

  getChapterName(subjectKey: string, chapterCode: string): string {
    const data = this.syllabus();
    if (!data) return '';

    return data.subjects[subjectKey]?.chapters.find((c) => c.code === chapterCode)?.name ?? '';
  }

  /* ------------------------------------ */
  /* derived flags (used by template)     */
  /* ------------------------------------ */

  isCompleted(subjectKey: string, idx: number): boolean {
    return idx < (this.progressIndex()[subjectKey] ?? -1);
  }

  isCurrent(subjectKey: string, code: string): boolean {
    return this.current()[subjectKey] === code;
  }

  isLocked(subjectKey: string, idx: number): boolean {
    return idx > (this.progressIndex()[subjectKey] ?? -1);
  }

  getProgress(subjectKey: string): number {
    return this.progressIndex()[subjectKey] ?? -1;
  }

  getCurrent(subjectKey: string): string | null {
    return this.current()[subjectKey] ?? null;
  }
}
