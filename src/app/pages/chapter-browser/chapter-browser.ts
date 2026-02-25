import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
  computed,
} from '@angular/core';

import { ClassSyllabus, Chapter, Subject } from '../../models/syllabus/class-syllabus.model';
import { SyllabusLookupService } from '../../services/syllabus/syllabus-lookup.service';
import { EMPTY, switchMap, take } from 'rxjs';

@Component({
  selector: 'chapter-browser',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chapter-browser.html',
  styleUrls: ['./chapter-browser.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChapterBrowser implements OnInit {
  /* ------------------ services ------------------ */
  private syllabusLookup = inject(SyllabusLookupService);

  /* ------------------ core state ------------------ */
  readonly classes = signal<string[]>(['Class']);
  readonly syllabus = signal<ClassSyllabus | null>(null);

  readonly selectedClass = signal<string | null>(null);
  readonly selectedSubjectCode = signal<string | null>(null);

  readonly isOnline = signal<boolean>(navigator.onLine);
  readonly syncing = signal<boolean>(false);

  /* ------------------ derived data ------------------ */
  readonly subjects = computed<Subject[]>(() => {
    return this.syllabus()?.subjects ?? [];
  });

  readonly chapters = computed<Chapter[]>(() => {
    const syllabus = this.syllabus();
    const subjectCode = this.selectedSubjectCode();

    if (!syllabus || !subjectCode) return [];

    return syllabus.subjects.find((s) => s.code === subjectCode)?.chapters ?? [];
  });

  /* ------------------ UI helpers ------------------ */
  readonly expanded = signal<Record<string, boolean>>({});

  toggleExpand(chapterCode: string): void {
    this.expanded.update((m) => ({
      ...m,
      [chapterCode]: !m[chapterCode],
    }));
  }

  /* ------------------ lifecycle ------------------ */
  async ngOnInit(): Promise<void> {
    /* use already-loaded class instead of re-fetching */
    this.syllabusLookup
      .getClassNames()
      .pipe(
        take(1),

        switchMap((names) => {
          this.classes.set(names);

          if (!names.length) return EMPTY;

          return this.syllabusLookup.getClass(names[0]).pipe(take(1));
        }),
      )
      .subscribe((f) => {
        if (!f) return;

        this.syllabus.set(f);
        this.selectedClass.set(f.classId);

        if (f.subjects.length) {
          this.selectedSubjectCode.set(f.subjects[0].code);
        }
      });
  }

  /* ------------------ interactions ------------------ */
  selectClass(className: string): void {
    this.selectedSubjectCode.set(className);
  }

  selectSubject(subjectCode: string): void {
    this.selectedSubjectCode.set(subjectCode);
  }

  notifyAdmin(chapter: Chapter): void {
    if (!this.isOnline()) {
      this.queueOfflineRequest(chapter);
      return;
    }

    this.syncing.set(true);

    setTimeout(() => {
      this.syncing.set(false);
      alert(`Change request sent for "${chapter.name}"`);
    }, 800);
  }

  private queueOfflineRequest(chapter: Chapter): void {
    console.warn('Offline: change request queued for', chapter.code);
  }
}
