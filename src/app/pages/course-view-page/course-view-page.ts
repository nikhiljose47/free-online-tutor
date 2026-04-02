import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
  effect,
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';

import { ClassSyllabus, Chapter, Subject } from '../../models/syllabus/class-syllabus.model';

import { SyllabusLookupService } from '../../services/syllabus/syllabus-lookup.service';
import { filter, map, switchMap, distinctUntilChanged } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { CourseSidebarComponent } from '../../shared/components/course-sidebar.component/course-sidebar.component';

@Component({
  selector: 'course-view',
  standalone: true,
  imports: [CommonModule, CourseSidebarComponent],
  templateUrl: './course-view-page.html',
  styleUrls: ['./course-view-page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CourseViewPage {

  private route = inject(ActivatedRoute);
  private service = inject(SyllabusLookupService);

  /* ================= SOURCE ================= */

  readonly syllabus = toSignal<ClassSyllabus | null>(
    this.route.paramMap.pipe(
      map(params => params.get('classId')),
      filter((id): id is string => !!id),
      distinctUntilChanged(),
      switchMap(id => {
        console.log('🚀 API CALL:', id);
        return this.service.loadClass(id);
      })
    ),
    { initialValue: null }
  );

  /* ================= UI STATE ================= */

  readonly selectedSubject = signal<string | null>(null);
  readonly selectedChapter = signal<Chapter | null>(null);
  readonly activeTab = signal<'overview' | 'divisions' | 'instructions'>('overview');

  /* ================= COMPUTED ================= */

  readonly subjects = computed<Subject[]>(() => {
    return this.syllabus()?.subjects ?? [];
  });

  readonly chapters = computed<Chapter[]>(() => {
    const sub = this.selectedSubject();
    if (!sub) return [];

    return this.subjects().find(s => s.code === sub)?.chapters ?? [];
  });

  readonly selectedSubjectName = computed(() => {
    const sub = this.selectedSubject();
    return this.subjects().find(s => s.code === sub)?.name ?? '';
  });

  /* ================= INIT (FIXED: EFFECT NOT COMPUTED) ================= */

  private initEffect = effect(() => {

    const data = this.syllabus();

    if (!data?.subjects?.length) return;

    // already selected → skip
    if (this.selectedSubject()) return;

    // pick first subject WITH chapters (important fix)
    const validSub = data.subjects.find(s => s.chapters?.length);

    if (!validSub) return;

    this.selectedSubject.set(validSub.code);
    this.selectedChapter.set(validSub.chapters[0]);

    console.log('✅ INIT → subject:', validSub.code);

  });

  /* ================= ACTIONS ================= */

  selectSubject(code: string) {

    this.selectedSubject.set(code);

    const sub = this.subjects().find(s => s.code === code);

    if (sub?.chapters?.length) {
      this.selectedChapter.set(sub.chapters[0]);
    } else {
      this.selectedChapter.set(null);
    }

  }

  selectChapter(ch: Chapter) {
    this.selectedChapter.set(ch);
  }

  /* ================= HELPERS ================= */

  getDifficulty(ch: Chapter): string {
    if (!ch?.divisions?.length) return '';
    return ch.divisions.some(d => d.difficulty_level === 'medium')
      ? 'medium'
      : 'easy';
  }

  /* ================= DEBUG ================= */ //Todo

  private debug = effect(() => {
    console.log('📘 syllabus:', this.syllabus());
    console.log('📚 subjects:', this.subjects());
    console.log('📖 chapters:', this.chapters());
  });

}