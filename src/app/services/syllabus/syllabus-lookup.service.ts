import { Injectable, inject, signal, computed } from '@angular/core';
import { Chapter, ClassSyllabus, Subject } from '../../models/syllabus/class-syllabus';
import { SyllabusParser } from '../../state/syllabus.store';

@Injectable({ providedIn: 'root' })
export class SyllabusLookupService {
  private syllabusParser = inject(SyllabusParser);

  private readonly _list = signal<ClassSyllabus[]>([]);
  readonly list = computed(() => this._list());

  constructor() {
    this.syllabusParser.getAllClasses().subscribe((data) => {
       console.log('LOADED CLASSES', data);
      this._list.set(data ?? []);
    });
  }

  private readonly classMap = computed(
    () => new Map(this.list().map((s) => [s.className, s]))
  );

  private readonly codeMap = computed(
    () => new Map(this.list().map((s) => [s.code_prefix, s]))
  );

  getClassNames(): string[] {
    return [...this.classMap().keys()];
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
    return this.classMap().get(className)?.subjects.find((s) => s.name === subjectName) ?? null;
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

  getChapterByCode(
    code: string
  ): { className: string; subjectName: string; chapter: Chapter } | null {
    for (const cls of this.list()) {
      for (const subject of cls.subjects) {
        const chapter = subject.chapters.find((c) => c.code === code);
        if (chapter) {
          return { className: cls.className, subjectName: subject.name, chapter };
        }
      }
    }
    return null;
  }
}
