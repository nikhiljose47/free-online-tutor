import { Injectable, inject, signal, computed } from '@angular/core';
import { SyllabusStore } from '../../shared/state/syllabus.store';
import { map, shareReplay } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { Chapter, ClassSyllabus, Subject } from '../../models/syllabus/class-syllabus.model';



///How to use this?
// private lookup = inject(SyllabusLookupService);

// readonly classes = this.lookup.classNames;

// readonly subjects = computed(() =>
//   this.selectedClass()
//     ? this.lookup.getSubjects(this.selectedClass()!)
//     : []
// );


@Injectable({ providedIn: 'root' })
export class SyllabusLookupService {
  private syllabusStore = inject(SyllabusStore);

  /* ================= SOURCE RX STREAM ================= */

  private readonly list$ = this.syllabusStore
    .getAllClasses$()
    .pipe(shareReplay({ bufferSize: 1, refCount: true }));

  /* ================= SIGNAL STATE ================= */

  private readonly _list = toSignal(this.list$, { initialValue: [] as ClassSyllabus[] });

  readonly list = computed(() => this._list());

  /* ================= DERIVED ================= */

  readonly classNames = computed(() => this.list().map((c) => c.className));

  private readonly classMap = computed(() => new Map(this.list().map((s) => [s.className, s])));

  private readonly codeMap = computed(() => new Map(this.list().map((s) => [s.code_prefix, s])));

  /* ===== Heavy chapter map stays in RXJS (perf safe) ===== */

  private readonly chapterMap$ = this.list$.pipe(
    map((list) => {
      const mapData = new Map<
        string,
        { className: string; subjectName: string; chapter: Chapter }
      >();

      for (const cls of list) {
        for (const subject of cls.subjects) {
          const chapters = this.normalizeChapters(subject.chapters);

          for (const chapter of chapters) {
            mapData.set(chapter.code, {
              className: cls.className,
              subjectName: subject.name,
              chapter,
            });
          }
        }
      }

      return mapData;
    }),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  private readonly chapterMap = toSignal(this.chapterMap$, { initialValue: new Map() });

  private normalizeChapters(input: any): Chapter[] {
    if (!input) return [];
    return Array.isArray(input) ? input : Object.values(input);
  }

  /* ================= PUBLIC LOOKUPS ================= */

  getClassNames(): string[] {
    return this.classNames();
  }

  getClass(className: string): ClassSyllabus | undefined {
    return this.classMap().get(className);
  }

  getClassCode(className: string): string | null {
    return this.classMap().get(className)?.code_prefix ?? null;
  }

  getClassNameFromCode(prefix: string): string | null {
    return this.codeMap().get(prefix)?.className ?? null;
  }

  hasClass(className: string): boolean {
    return this.classMap().has(className);
  }

  getSubjects(className: string): string[] {
    return (
      this.classMap()
        .get(className)
        ?.subjects.map((s) => s.name) ?? []
    );
  }

  getSubject(className: string, subjectName: string): Subject | null {
    return (
      this.classMap()
        .get(className)
        ?.subjects.find((s) => s.name === subjectName) ?? null
    );
  }

  hasSubject(className: string, subjectName: string): boolean {
    return !!this.getSubject(className, subjectName);
  }

  getChapters(className: string, subjectName: string): Chapter[] {
    return this.getSubject(className, subjectName)?.chapters ?? [];
  }

  getChapter(className: string, subjectName: string, chapterCode: string): Chapter | null {
    return (
      this.getSubject(className, subjectName)?.chapters.find((c) => c.code === chapterCode) ?? null
    );
  }

  getChapterByCode(code: string) {
    return this.chapterMap().get(code) ?? null;
  }
}
