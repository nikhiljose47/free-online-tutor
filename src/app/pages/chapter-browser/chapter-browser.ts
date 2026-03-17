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
import { DotLoader } from '../../components/dot-loader/dot-loader';

@Component({
  selector: 'chapter-browser',
  standalone: true,
  imports: [CommonModule, DotLoader],
  templateUrl: './chapter-browser.html',
  styleUrls: ['./chapter-browser.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChapterBrowser implements OnInit {
  private syllabusLookup = inject(SyllabusLookupService);

  readonly classes = signal<string[]>([]);
  readonly syllabus = signal<ClassSyllabus | null>(null);

  readonly selectedClass = signal<string | null>(null);
  readonly selectedSubjectCode = signal<string | null>(null);

  readonly isOnline = signal<boolean>(navigator.onLine);
  readonly syncing = signal<boolean>(false);

  readonly subjects = computed<Subject[]>(() => {
    return this.syllabus()?.subjects ?? [];
  });

  readonly chapters = computed<Chapter[]>(() => {
    const syl = this.syllabus();
    const subjectCode = this.selectedSubjectCode();

    if (!syl || !subjectCode) return [];

    const subject = syl.subjects.find((s) => s.code === subjectCode);

    return subject?.chapters ?? [];
  });

  readonly expanded = signal<Record<string, boolean>>({});

  toggleExpand(chapterCode: string) {
    this.expanded.update((m) => ({
      ...m,
      [chapterCode]: !m[chapterCode],
    }));
  }

  ngOnInit(): void {
    this.syllabusLookup
      .getClassIds()
      .pipe(
        take(1),
        switchMap((ids) => {
          this.classes.set(ids);

          if (!ids.length) return EMPTY;

          const firstClass = ids[0];

          this.selectedClass.set(firstClass);

          return this.syllabusLookup.getClass(firstClass).pipe(take(1));
        }),
      )
      .subscribe((cls) => {
        if (!cls) return;

        this.syllabus.set(cls);

        if (cls.subjects?.length) {
          this.selectedSubjectCode.set(cls.subjects[0].code);
        }
      });
  }

  selectClass(classId: string) {
    this.selectedClass.set(classId);

    this.syllabusLookup
      .getClass(classId)
      .pipe(take(1))
      .subscribe((cls) => {
        if (!cls) return;

        this.syllabus.set(cls);

        if (cls.subjects?.length) {
          this.selectedSubjectCode.set(cls.subjects[0].code);
        }
      });
  }

  selectSubject(subjectCode: string) {
    this.selectedSubjectCode.set(subjectCode);
  }

  notifyAdmin(chapter: Chapter) {
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

  private queueOfflineRequest(chapter: Chapter) {
    console.warn('Offline: change request queued for', chapter.code);
  }
}
