import { Injectable, inject, signal } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { ClassSubjectService } from '../../services/class/class-subject/class-subject.service';
import { SyllabusLookupService } from '../../services/syllabus/syllabus-lookup.service';
import { ClassUtil } from '../../shared/utils/class.util';

//Never return null for index

@Injectable({ providedIn: 'root' })
export class ClassSubjectStore {
  private subjectService = inject(ClassSubjectService);
  private syllabusLookupApi = inject(SyllabusLookupService);
 

  //Todo
  getCurrentAndNextIndex(classId: string, subjectId: string): Observable<string[]> {
    return this.getCurrentIndex(classId, subjectId).pipe(
      map((cur) => {
        let isDiv = ClassUtil.isDivision(cur);

        if (isDiv) {
          let nextDivId = ClassUtil.getNextCode(cur);
         // const hasDiv = this.syllabusLookupApi.hasChapter(classId, subjectId, cur, nextDivId);
          let tmp = ClassUtil.convertToClassId(cur);
          var nextChapterId = ClassUtil.getNextCode(tmp);
          const hasChapter = this.syllabusLookupApi.hasChapter(classId, subjectId, nextChapterId);
         // return true ? [cur, nextDivId] : hasChapter() ? [cur, nextChapterId] : [cur, ''];
         return [cur, nextDivId] ;
        } else {
          let tmp = ClassUtil.convertToDivisionId(cur);
          const hasDivision = this.syllabusLookupApi.hasChapter(classId, subjectId, tmp);
          let nextChapter = ClassUtil.getNextCode(cur);
          const hasChapter = this.syllabusLookupApi.hasChapter(classId, subjectId, nextChapter);
          return [cur, tmp] ;
          //return hasDivision() ? [cur, tmp] : hasChapter() ? [cur, nextChapter] : [cur, ''];
        }
      }),
    );
  }

  getCurrentIndex(classId: string, subjectId: string) {
    return this.subjectService.getOnce(classId, subjectId).pipe(map((s) => s?.curIndex ?? ''));
  }

  setCurrentIndex(classId: string, subjectId: string, idx: string) {
    return this.subjectService.update(classId, subjectId, {
      curIndex: idx,
      lastUpdatedAt: new Date() as any,
    });
  }
}
