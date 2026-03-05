import { Injectable, inject } from '@angular/core';
import { SyllabusStore } from '../../shared/state/syllabus.store';
import { map, shareReplay, Observable } from 'rxjs';
import { Chapter, ClassSyllabus, Subject } from '../../models/syllabus/class-syllabus.model';


export interface SubjectWithChapters {
  code: string;
  name: string;
  meta: Record<string, unknown>;
  chapters: Chapter[];
}


@Injectable({ providedIn: 'root' })
export class SyllabusLookupService {
  private syllabusStore = inject(SyllabusStore);

  private readonly list$: Observable<ClassSyllabus[]> = this.syllabusStore
    .getAllClasses$()
    .pipe(shareReplay({ bufferSize: 1, refCount: true }));

  private normalizeChapters(input: any): Chapter[] {
    if (!input) return [];
    return Array.isArray(input) ? input : Object.values(input);
  }

  /* ================= CLASS ================= */

  getClassIds(): Observable<string[]> {
    return this.list$.pipe(map((list) => list.map((c) => c.classId)));
  }

  getClassNames(): Observable<string[]> {
    return this.list$.pipe(map((list) => list.map((c) => c.className)));
  }

  getClass(classId: string): Observable<ClassSyllabus | undefined> {
    return this.list$.pipe(map((list) => list.find((c) => c.classId === classId)));
  }

  getClassCode(classId: string): Observable<string | null> {
    return this.list$.pipe(
      map((list) => list.find((c) => c.classId === classId)?.code_prefix ?? null),
    );
  }

  getClassNameFromCode(prefix: string): Observable<string | null> {
    return this.list$.pipe(
      map((list) => list.find((c) => c.code_prefix === prefix)?.className ?? null),
    );
  }

  hasClass(classId: string): Observable<boolean> {
    return this.list$.pipe(map((list) => list.some((c) => c.classId === classId)));
  }

  /* ================= SUBJECTS ================= */

  getSubjectNames(classId: string): Observable<string[]> {
    return this.list$.pipe(
      map((list) => list.find((c) => c.classId === classId)?.subjects.map((s) => s.name) ?? []),
    );
  }

  getSubjects(
    classId: string,
  ): Observable<{ code: string; name: string; meta: Record<string, unknown> }[]> {
    return this.list$.pipe(
      map((list) => {
        const found = list.find((c) => c.classId === classId);
        if (!found?.subjects?.length) return [];
        return found.subjects.map((s) => ({
          code: s.code,
          name: s.name,
          meta: s.meta,
        }));
      }),
    );
  }
  getSubject(classId: string, subjectName: string): Observable<Subject | null> {
    return this.list$.pipe(
      map(
        (list) =>
          list.find((c) => c.classId === classId)?.subjects.find((s) => s.name === subjectName) ??
          null,
      ),
    );
  }

  getSubjectById(classId: string, subjectId: string): Observable<Subject | null> {
    return this.list$.pipe(
      map(
        (list) =>
          list.find((c) => c.classId === classId)?.subjects.find((s) => s.code === subjectId) ??
          null,
      ),
    );
  }

  hasSubject(classId: string, subjectName: string): Observable<boolean> {
    return this.getSubject(classId, subjectName).pipe(map((subject) => !!subject));
  }

  /* ================= CHAPTERS ================= */

  getChapters(classId: string, subjectId: string): Observable<Chapter[]> {
    return this.list$.pipe(
      map((list) => {
        const cls = list.find((c) => c.classId === classId);
        if (!cls) return [];

        const subject = cls.subjects.find((s) => s.code === subjectId);
        if (!subject) return [];

        return this.normalizeChapters(subject.chapters);
      }),
    );
  }

  getChapter(
    classId: string,
    subjectName: string,
    chapterCode: string,
  ): Observable<Chapter | null> {
    return this.list$.pipe(
      map((list) => {
        const cls = list.find((c) => c.classId === classId);
        if (!cls) return null;

        const subject = cls.subjects.find((s) => s.name === subjectName);
        if (!subject) return null;

        const chapters = this.normalizeChapters(subject.chapters);
        return chapters.find((c) => c.code === chapterCode) ?? null;
      }),
    );
  }

  getChapterByCode(code: string): Observable<{
    classId: string;
    subjectCode: string;
    chapter: Chapter;
  } | null> {
    return this.list$.pipe(
      map((list) => {
        for (const cls of list) {
          for (const subject of cls.subjects) {
            const chapters = this.normalizeChapters(subject.chapters);
            const chapter = chapters.find((c) => c.code === code);
            if (chapter) {
              return {
                classId: cls.classId,
                subjectCode: subject.code,
                chapter,
              };
            }
          }
        }
        return null;
      }),
    );
  }

  hasChapter(classId: string, subjectName: string, chapterCode: string): Observable<boolean> {
    return this.getChapter(classId, subjectName, chapterCode).pipe(map((ch) => !!ch));
  }

  /* ================= DIVISIONS ================= */

  getDivisions(classId: string, subjectName: string, chapterCode: string): Observable<any[]> {
    return this.getChapter(classId, subjectName, chapterCode).pipe(
      map((ch) => ch?.divisions ?? []),
    );
  }

  getDivision(
    classId: string,
    subjectName: string,
    chapterCode: string,
    divisionCode: string,
  ): Observable<any | null> {
    return this.getDivisions(classId, subjectName, chapterCode).pipe(
      map((divs) => divs.find((d) => d.code === divisionCode) ?? null),
    );
  }

  hasDivision(
    classId: string,
    subjectName: string,
    chapterCode: string,
    divisionCode: string,
  ): Observable<boolean> {
    return this.getDivision(classId, subjectName, chapterCode, divisionCode).pipe(map((d) => !!d));
  }


  getSubjectsWithChapters(
  classId: string
): Observable<{
  subjects: SubjectWithChapters[];
}> {
  return this.list$.pipe(
    map(list => {

      const cls = list.find(c => c.classId === classId);
      if (!cls?.subjects?.length) {
        return { subjects: [] };
      }

      const subjects = cls.subjects.map(s => ({
        code: s.code,
        name: s.name,
        meta: s.meta,
        chapters: this.normalizeChapters(s.chapters)
      }));

      return { subjects };
    })
  );
}


}
