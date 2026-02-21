import { Injectable, inject, signal, computed } from '@angular/core';
import { SyllabusStore } from '../../shared/state/syllabus.store';
import { map, shareReplay } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { Chapter, ClassSyllabus, Subject } from '../../models/syllabus/class-syllabus.model';

@Injectable({ providedIn: 'root' })
export class SyllabusLookupService {
  private syllabusStore = inject(SyllabusStore);

  /* ================= SOURCE RX STREAM ================= */

  private readonly list$ = this.syllabusStore
    .getAllClasses$()
    .pipe(shareReplay({ bufferSize: 1, refCount: true }));

  /* ================= SIGNAL STATE ================= */

  private readonly _list = toSignal(this.list$, {
    initialValue: [] as ClassSyllabus[],
  });

  readonly list = computed(() => this._list());

  /* ================= DERIVED ================= */

  readonly classIds = computed(() => this.list().map((c) => c.classId));

  readonly classNames = computed(() => this.list().map((c) => c.className));

  private readonly classMap = computed(() => new Map(this.list().map((s) => [s.classId, s])));

  private readonly codeMap = computed(() => new Map(this.list().map((s) => [s.code_prefix, s])));

  /* ===== Heavy chapter map (ID based) ===== */

  private readonly chapterMap$ = this.list$.pipe(
    map((list) => {
      const mapData = new Map<string, { classId: string; subjectCode: string; chapter: Chapter }>();

      for (const cls of list) {
        for (const subject of cls.subjects) {
          const chapters = this.normalizeChapters(subject.chapters);

          for (const chapter of chapters) {
            mapData.set(chapter.code, {
              classId: cls.classId,
              subjectCode: subject.code,
              chapter,
            });
          }
        }
      }

      return mapData;
    }),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  private readonly chapterMap = toSignal(this.chapterMap$, {
    initialValue: new Map(),
  });

  private normalizeChapters(input: any): Chapter[] {
    if (!input) return [];
    return Array.isArray(input) ? input : Object.values(input);
  }

  /* ================= PUBLIC LOOKUPS ================= */

  getClassIds(): string[] {
    return this.classIds();
  }

  getClassNames(): string[] {
    return this.classNames();
  }

  getClass(classId: string): ClassSyllabus | undefined {
    return this.classMap().get(classId);
  }

  getClassCode(classId: string): string | null {
    return this.classMap().get(classId)?.code_prefix ?? null;
  }

  getClassNameFromCode(prefix: string): string | null {
    return this.codeMap().get(prefix)?.className ?? null;
  }

  hasClass(classId: string): boolean {
    return this.classMap().has(classId);
  }

  /* ================= SUBJECTS ================= */

  getSubjects(classId: string): string[] {
    return (
      this.classMap()
        .get(classId)
        ?.subjects.map((s) => s.name) ?? []
    );
  }

  getSubject(classId: string, subjectName: string): Subject | null {
    return (
      this.classMap()
        .get(classId)
        ?.subjects.find((s) => s.name === subjectName) ?? null
    );
  }

  hasSubject(classId: string, subjectName: string): boolean {
    return !!this.getSubject(classId, subjectName);
  }

  /* ================= CHAPTERS ================= */

  getChapters(classId: string, subjectName: string): Chapter[] {
    return this.getSubject(classId, subjectName)?.chapters ?? [];
  }

  getChapter(classId: string, subjectName: string, chapterCode: string): Chapter | null {
    return (
      this.getSubject(classId, subjectName)?.chapters.find((c) => c.code === chapterCode) ?? null
    );
  }

  getChapterByCode(code: string) {
    return this.chapterMap().get(code) ?? null;
  }

  hasChapter(classId: string, subjectName: string, chapterCode: string): boolean {
    return !!this.getChapter(classId, subjectName, chapterCode);
  }

  /* ================= DIVISIONS ================= */

  getDivisions(classId: string, subjectName: string, chapterCode: string) {
    return this.getChapter(classId, subjectName, chapterCode)?.divisions ?? [];
  }

  getDivision(classId: string, subjectName: string, chapterCode: string, divisionCode: string) {
    return (
      this.getDivisions(classId, subjectName, chapterCode).find((d) => d.code === divisionCode) ??
      null
    );
  }

  hasDivision(
    classId: string,
    subjectName: string,
    chapterCode: string,
    divisionCode: string,
  ): boolean {
    return !!this.getDivision(classId, subjectName, chapterCode, divisionCode);
  }
}
