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

  /* ================= SOURCE ================= */

  private readonly list$: Observable<ClassSyllabus[]> = this.syllabusStore
    .getAllClasses$()
    .pipe(shareReplay({ bufferSize: 1, refCount: true }));

  /* ================= LOOKUP MAPS (OPTIMIZED) ================= */

  private readonly classMap$ = this.list$.pipe(
    map((list) => new Map(list.map((c) => [c.classId, c]))),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  private readonly classNameMap$ = this.list$.pipe(
    map((list) => new Map(list.map((c) => [c.classId, c.className]))),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  /* ================= HELPERS ================= */

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

  getClass(classId: string): Observable<ClassSyllabus | null> {
    return this.classMap$.pipe(map((mapData) => mapData.get(classId) ?? null));
  }

  getClassCode(classId: string): Observable<string | null> {
    return this.classMap$.pipe(map((mapData) => mapData.get(classId)?.code_prefix ?? null));
  }

  getClassNameFromCode(prefix: string): Observable<string | null> {
    return this.list$.pipe(
      map((list) => list.find((c) => c.code_prefix === prefix)?.className ?? null),
    );
  }

  getClassNameFromId(classId: string): Observable<string | null> {
    return this.classNameMap$.pipe(map((mapData) => mapData.get(classId) ?? null));
  }

  getClassNameMap(): Observable<Map<string, string>> {
    return this.classNameMap$;
  }

  hasClass(classId: string): Observable<boolean> {
    return this.classMap$.pipe(map((mapData) => mapData.has(classId)));
  }

  /* ================= SUBJECTS ================= */

  getSubjectNames(classId: string): Observable<string[]> {
    return this.classMap$.pipe(
      map((mapData) => {
        const cls = mapData.get(classId);
        return cls?.subjects?.map((s) => s.name) ?? [];
      }),
    );
  }

  getSubjects(
    classId: string,
  ): Observable<{ code: string; name: string; meta: Record<string, unknown> }[]> {
    return this.classMap$.pipe(
      map((mapData) => {
        const cls = mapData.get(classId);
        if (!cls?.subjects?.length) return [];

        return cls.subjects.map((s) => ({
          code: s.code,
          name: s.name,
          meta: s.meta,
        }));
      }),
    );
  }

  getSubject(classId: string, subjectName: string): Observable<Subject | null> {
    return this.classMap$.pipe(
      map((mapData) => mapData.get(classId)?.subjects.find((s) => s.name === subjectName) ?? null),
    );
  }

  getSubjectNameById(classId: string, subjectId: string): Observable<string | null> {
    return this.classMap$.pipe(
      map(
        (mapData) => mapData.get(classId)?.subjects.find((s) => s.code === subjectId)?.name ?? null,
      ),
    );
  }

  hasSubject(classId: string, subjectName: string): Observable<boolean> {
    return this.getSubject(classId, subjectName).pipe(map((subject) => !!subject));
  }

  /* ================= CHAPTERS ================= */

  getChapters(classId: string, subjectId: string): Observable<Chapter[]> {
    return this.classMap$.pipe(
      map((mapData) => {
        const cls = mapData.get(classId);
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
    return this.classMap$.pipe(
      map((mapData) => {
        const cls = mapData.get(classId);
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

  /* ================= SUBJECTS + CHAPTERS ================= */

  getSubjectsWithChapters(classId: string): Observable<{
    subjects: SubjectWithChapters[];
  }> {
    return this.classMap$.pipe(
      map((mapData) => {
        const cls = mapData.get(classId);
        if (!cls?.subjects?.length) {
          return { subjects: [] };
        }

        const subjects = cls.subjects.map((s) => ({
          code: s.code,
          name: s.name,
          meta: s.meta,
          chapters: this.normalizeChapters(s.chapters),
        }));

        return { subjects };
      }),
    );
  }
}
