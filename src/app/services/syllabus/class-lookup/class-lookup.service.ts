import { Injectable, signal, inject } from '@angular/core';
import { ClassSyllabus } from '../../../models/syllabus/class-syllabus.model';
import { SyllabusRepository } from '../../../domain/repositories/syllabus.repository';
import { catchError, map, Observable, of, shareReplay, switchMap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ClassLookupService {
  private repo = inject(SyllabusRepository);
  private store = signal<Record<string, ClassSyllabus>>({});

  //Do load + get success before accessing data
  load(classId: string): Observable<boolean> {
    if (this.store()[classId]) {
      return of(true);
    }

    return this.repo.loadIndex().pipe(
      switchMap((index) => this.repo.loadClassById(classId, index)),
      map((data) => {
        if (!data) return false;

        this.store.update((s) => ({
          ...s,
          [classId]: data,
        }));

        return true;
      }),
      catchError(() => of(false)),
      shareReplay(1),
    );
  }

  get(classId: string): ClassSyllabus {
    return this.store()[classId]; // assumed present after load
  }

  getClassName(classId: string): string {
    return this.get(classId).className;
  }

  getSubjects(classId: string) {
    return this.get(classId).subjects;
  }

  getSubjectNames(classId: string): string[] {
    return this.get(classId).subjects.map((s) => s.name);
  }

  getChapters(classId: string, subjectCode: string) {
    return this.get(classId).subjects.find((s) => s.code === subjectCode)!.chapters;
  }

  getChapterNames(classId: string, subjectCode: string): string[] {
    return this.getChapters(classId, subjectCode).map((c) => c.name);
  }

  getChapterByCode(classId: string, subjectCode: string, chapterCode: string) {
    return this.get(classId)
      .subjects.find((s) => s.code === subjectCode)!
      .chapters.find((c) => c.code === chapterCode)!;
  }

  getDivisions(classId: string, subjectCode: string, chapterCode: string) {
    return this.getChapters(classId, subjectCode).find((c) => c.code === chapterCode)!.divisions;
  }

  getDivisionNames(classId: string, subjectCode: string, chapterCode: string): string[] {
    return this.getDivisions(classId, subjectCode, chapterCode).map((d) => d.name);
  }

  hasData(classId: string): boolean {
    return !!this.store()[classId];
  }
}
