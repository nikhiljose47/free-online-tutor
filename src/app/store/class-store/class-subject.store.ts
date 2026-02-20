import { Injectable, inject, signal } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { ClassSubjectService } from '../../services/class/class-subject/class-subject.service';
import { ClassSubject } from '../../models/classes/class-subject.model';
import { FireResponse } from '../../core/services/fire/firestore-doc.service';

@Injectable({ providedIn: 'root' })
export class ClassSubjectStore {
  private subjectService = inject(ClassSubjectService);

  private currentIndex = signal<Record<string, string | null>>({});

  getCurrentIndex(classId: string, subjectId: string) {
    return this.subjectService.getOnce(classId, subjectId).pipe(map((s) => s?.curIndex ?? null));
  }

  setCurrentIndex(classId: string, subjectId: string, idx: string | null) {
    return this.subjectService.update(classId, subjectId, {
      curIndex: idx,
      lastUpdatedAt: new Date() as any,
    });
  }

  // ---------- SIGNAL ACCESS (optional for UI) ----------
  selectCurrent(classId: string, subjectId: string) {
    return this.currentIndex()[`${classId}-${subjectId}`] ?? null;
  }
}
