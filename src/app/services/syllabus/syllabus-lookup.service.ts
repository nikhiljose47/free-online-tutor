import { Injectable } from '@angular/core';

import { ClassSyllabus } from '../../models/syllabus.model';
import { CLASS5_SYLLABUS } from '../../core/constants/syllabus/cl5-syllabus';
import { CLASS6_SYLLABUS } from '../../core/constants/syllabus/cl6-syllabus';

@Injectable({ providedIn: 'root' })
export class SyllabusLookupService {
  private readonly list: ClassSyllabus[] = [CLASS5_SYLLABUS, CLASS6_SYLLABUS];

  private readonly classMap = new Map<string, ClassSyllabus>(this.list.map((s) => [s.class, s]));

  private readonly codeMap = new Map<string, ClassSyllabus>(
    this.list.map((s) => [s.code_prefix, s])
  );

  getClassNames(): string[] {
    return [...this.classMap.keys()];
  }

  getClass(className: string): ClassSyllabus | undefined {
    return this.classMap.get(className);
  }

  getClassCode(className: string): string | null {
    return this.classMap.get(className)?.code_prefix ?? null;
  }

  getClassNameFromCode(prefix: string): string | null {
    return this.codeMap.get(prefix)?.class ?? null;
  }

  getSubjects(className: string): string[] {
    const cls = this.classMap.get(className);
    return cls ? Object.keys(cls.subjects) : [];
  }

  getChapters(className: string, subjectName: string) {
    const cls = this.classMap.get(className);
    return cls?.subjects?.[subjectName]?.chapters ?? [];
  }

  getChapterByCode(code: string) {
    for (const cls of this.list) {
      for (const subjectName in cls.subjects) {
        const subject = cls.subjects[subjectName];
        const chapter = subject.chapters.find((c) => c.code === code);
        if (chapter) {
          return {
            class: cls.class,
            subject: subjectName,
            chapter,
          };
        }
      }
    }
    return null;
  }

  hasClass(className: string): boolean {
    return this.classMap.has(className);
  }

  hasSubject(className: string, subjectName: string): boolean {
    return !!this.classMap.get(className)?.subjects?.[subjectName];
  }
}
