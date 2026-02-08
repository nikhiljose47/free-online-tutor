import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
  computed,
} from '@angular/core';

import {
  ClassSyllabus,
  Chapter,
  Subject,
} from '../../models/syllabus/class-syllabus';
import { SyllabusRepository } from '../../data/repositories/syllabus.repository';

@Component({
  selector: 'chapter-browser',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chapter-browser.html',
  styleUrls: ['./chapter-browser.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChapterBrowser implements OnInit {
  private syllabusRepo = inject(SyllabusRepository);

  readonly syllabus = signal<ClassSyllabus | null>(null);

  readonly selectedClass = signal<string | null>(null);
  readonly selectedSubjectCode = signal<string | null>(null);

  readonly isOnline = signal<boolean>(navigator.onLine);
  readonly syncing = signal<boolean>(false);

  readonly subjects = computed<Subject[]>(() => {
    return this.syllabus()?.subjects ?? [];
  });



  readonly chapters = computed<Chapter[]>(() => {
    const syllabus = this.syllabus();
    const subjectCode = this.selectedSubjectCode();

    if (!syllabus || !subjectCode) return [];

    return (
      syllabus.subjects.find(s => s.code === subjectCode)?.chapters ?? []
    );
  });


  readonly expanded = signal<Record<string, boolean>>({});

toggleExpand(chapterCode: string): void {
  this.expanded.update(m => ({
    ...m,
    [chapterCode]: !m[chapterCode],
  }));
}



  ngOnInit(): void {
    this.syllabusRepo.loadClass('syllabus-class-8').subscribe(data => {
      if (!data) return;
 

      this.syllabus.set(data);
      this.selectedClass.set(data.classId);
      console.log(data);
      console.log(data.classId)
          console.log(data.subjects[0])
      if (data.subjects.length) {
        this.selectedSubjectCode.set(data.subjects[0].code);
      }
                 console.log(this.selectedSubjectCode())

    });
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
