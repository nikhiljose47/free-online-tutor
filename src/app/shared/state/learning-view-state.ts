import { Injectable, Signal, computed, signal } from '@angular/core';
import { ClassSyllabus, Chapter, Subject } from '../../models/syllabus/class-syllabus.model';

export interface LearningViewStateModel {
  subjects: Signal<Subject[]>;
  chapters: Signal<Chapter[]>;
  selectedSubject: Signal<string | null>;
  selectedChapter: Signal<Chapter | null>;
  hasData: Signal<boolean>;
}

@Injectable({ providedIn: 'root' })
export class LearningViewState {
  /* SOURCE */
  private syllabus = signal<ClassSyllabus | null>(null);

  /* STATE */
  private _selectedSubject = signal<string | null>(null);
  private _selectedChapter = signal<Chapter | null>(null);

  /* DERIVED */
  private _subjects = computed<Subject[]>(() => this.syllabus()?.subjects ?? []);

  private _chapters = computed<Chapter[]>(() => {
    const sub = this._selectedSubject();
    return sub ? (this._subjects().find((s) => s.code === sub)?.chapters ?? []) : [];
  });

  private _hasData = computed(() => this._subjects().length > 0);

  /* PUBLIC STATE */
  readonly subjects = this._subjects;
  readonly chapters = this._chapters;
  readonly selectedSubject = this._selectedSubject;
  readonly selectedChapter = this._selectedChapter;
  readonly hasData = this._hasData;

  readonly state: LearningViewStateModel = {
    subjects: this._subjects,
    chapters: this._chapters,
    selectedSubject: this._selectedSubject,
    selectedChapter: this._selectedChapter,
    hasData: this._hasData,
  };

  /* INIT */
  setSyllabus(data: ClassSyllabus | null) {
    this.syllabus.set(data);

    if (!data?.subjects?.length) return;

    if (this._selectedSubject()) return;

    const sub = data.subjects.find((s) => s.chapters?.length);
    if (!sub) return;

    this._selectedSubject.set(sub.code);
    this._selectedChapter.set(sub.chapters[0]);
  }

  /* ACTIONS */
  selectSubject(code: string) {
    this._selectedSubject.set(code);

    const sub = this._subjects().find((s) => s.code === code);
    this._selectedChapter.set(sub?.chapters?.[0] ?? null);
  }

  selectChapter(ch: Chapter) {
    this._selectedChapter.set(ch);
  }

  /* OPTIONAL (shared logic reuse across components) */
  getDifficulty(ch: Chapter): string {
    if (!ch?.divisions?.length) return '';
    return ch.divisions.some((d) => d.difficulty_level === 'medium') ? 'medium' : 'easy';
  }
}
