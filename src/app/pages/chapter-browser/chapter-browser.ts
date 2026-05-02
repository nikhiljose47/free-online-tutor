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
import { DotLoader } from '../../components/dot-loader/dot-loader';
import { take } from 'rxjs';
import { ClassLookupService } from '../../services/syllabus/class-lookup/class-lookup.service';

@Component({
  selector: 'chapter-browser',
  standalone: true,
  imports: [CommonModule, DotLoader],
  templateUrl: './chapter-browser.html',
  styleUrls: ['./chapter-browser.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChapterBrowser implements OnInit {
  private classLookup = inject(ClassLookupService);

  readonly classes = signal<string[]>(['class_10', 'class_9']); // replace via service later
  readonly syllabus = signal<ClassSyllabus | null>(null);

  readonly selectedClass = signal<string | null>(null);
  readonly selectedSubjectCode = signal<string | null>(null);

  readonly isOnline = signal<boolean>(navigator.onLine);
  readonly syncing = signal<boolean>(false);
  readonly loading = signal<boolean>(true);

  readonly subjects = computed<Subject[]>(() => {
    const cls = this.selectedClass();
    return cls ? this.classLookup.getSubjects(cls) : [];
  });

  readonly chapters = computed<Chapter[]>(() => {
    const cls = this.selectedClass();
    const subjectCode = this.selectedSubjectCode();

    if (!cls || !subjectCode || !this.classLookup.hasData(cls)) return [];

    return this.classLookup.getChapters(cls, subjectCode);
  });

  readonly expanded = signal<Record<string, boolean>>({});

  toggleExpand(chapterCode: string) {
    this.expanded.update((m) => ({
      ...m,
      [chapterCode]: !m[chapterCode],
    }));
  }

  ngOnInit(): void {
    const firstClass = this.classes()[0];
    if (!firstClass) return;

    this.selectedClass.set(firstClass);

    this.classLookup
      .load(firstClass)
      .pipe(take(1))
      .subscribe((ok) => {
        this.loading.set(false);
        if (!ok) return;

        this.syllabus.set(this.classLookup.get(firstClass));

        const subjects = this.classLookup.getSubjects(firstClass);
        if (subjects?.length) {
          this.selectedSubjectCode.set(subjects[0].code);
        }
      });
  }

  selectClass(classId: string) {
    this.selectedClass.set(classId);
    this.loading.set(true);

    this.classLookup
      .load(classId)
      .pipe(take(1))
      .subscribe((ok) => {
        this.loading.set(false);
        if (!ok) return;

        this.syllabus.set(this.classLookup.get(classId));

        const subjects = this.classLookup.getSubjects(classId);
        if (subjects?.length) {
          this.selectedSubjectCode.set(subjects[0].code);
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
    console.warn('Offline queued', chapter.code);
  }
}
