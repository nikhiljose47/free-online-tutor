import { Injectable, inject, signal, computed } from '@angular/core';
import { Chapter, ClassSyllabus, Subject } from '../../models/syllabus/class-syllabus';
import { SyllabusStore } from '../../state/syllabus.store';

@Injectable({ providedIn: 'root' })
export class SyllabusLookupService {
  private syllabusStore = inject(SyllabusStore);

  /* ================= RAW LIST ================= */

  private readonly _list = signal<ClassSyllabus[]>([]);
  readonly list = computed(() => this._list());

  /* ================= READY PROMISE (optional imperative wait) ================= */

  private _resolveReady!: () => void;
  private readonly _ready = new Promise<void>((res) => (this._resolveReady = res));

  async waitUntilReady() {
    await this._ready;
  }

  /* ================= INIT (called once from bootstrap/resolver) ================= */

  init() {
    this.syllabusStore.getAllClasses$().subscribe((data) => {
      this._list.set(data ?? []);
      this._resolveReady();
    });
  }

  /* ================= DERIVED SIGNALS ================= */

  readonly classNames = computed(() => this.list().map((c) => c.className));

  private readonly classMap = computed(() => new Map(this.list().map((s) => [s.className, s])));

  private readonly codeMap = computed(() => new Map(this.list().map((s) => [s.code_prefix, s])));

  private readonly chapterMap = computed(() => {
    const map = new Map<string, { className: string; subjectName: string; chapter: Chapter }>();

    for (const cls of this.list()) {
      for (const subject of cls.subjects) {
        for (const chapter of this.normalizeChapters(subject.chapters)) {
          map.set(chapter.code, {
            className: cls.className,
            subjectName: subject.name,
            chapter,
          });
        }
      }
    }

    return map;
  });

 private normalizeChapters(input: any): Chapter[] {
  if (!input) return [];

  return Array.isArray(input)
    ? input
    : Object.values(input);
}


  /* ================= PUBLIC SYNC LOOKUPS ================= */

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
    const cls = this.classMap().get(className);
    return cls ? cls.subjects.map((s) => s.name) : [];
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
