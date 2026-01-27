import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  signal,
  computed,
} from '@angular/core';

interface Chapter {
  id: string;
  title: string;
  description: string;
  subsections: string[];
  verified: boolean;
  show?: boolean;
}

@Component({
  selector: 'chapter-browser',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chapter-browser.html',
  styleUrls: ['./chapter-browser.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChapterBrowser {
  /* ===============================
     FILTER DATA
  =============================== */
  readonly classes = signal<string[]>([
    'Class 6',
    'Class 7',
    'Class 8',
    'Class 9',
    'Class 10',
  ]);

  readonly subjects = signal<string[]>([
    'Mathematics',
    'Science',
    'English',
    'Social Studies',
  ]);

  readonly selectedClass = signal<string | null>(null);
  readonly selectedSubject = signal<string | null>(null);

  /* ===============================
     OFFLINE / SYNC STATE
  =============================== */
  readonly isOnline = signal<boolean>(navigator.onLine);
  readonly syncing = signal<boolean>(false);

  /* ===============================
     CHAPTER DATA (DUMMY)
  =============================== */
  readonly chapters = signal<Chapter[]>([
    {
      id: 'ch1',
      title: 'Introduction to Algebra',
      description: 'Basic algebraic concepts and expressions',
      subsections: [
        'Variables and constants',
        'Simple expressions',
        'Algebra in daily life',
      ],
      verified: true,
      show: false,
    },
    {
      id: 'ch2',
      title: 'Linear Equations',
      description: 'Understanding and solving linear equations',
      subsections: [
        'Equation formation',
        'Solving one-variable equations',
        'Word problems',
      ],
      verified: false,
      show: false,
    },
    {
      id: 'ch3',
      title: 'Geometry Basics',
      description: 'Shapes, lines, and angles',
      subsections: [
        'Points and lines',
        'Angles and types',
        'Basic constructions',
      ],
      verified: true,
      show: false,
    },
  ]);

  /* ===============================
     DERIVED DATA
  =============================== */
  readonly filteredChapters = computed(() => {
    return this.chapters();
  });

  /* ===============================
     ACTIONS
  =============================== */
  toggleSubsections(chapter: Chapter) {
    this.chapters.update(list =>
      list.map(c =>
        c.id === chapter.id ? { ...c, show: !c.show } : c
      )
    );
  }

  notifyAdmin(chapter: Chapter) {
    if (!this.isOnline()) {
      this.queueOfflineRequest(chapter);
      return;
    }

    this.syncing.set(true);

    setTimeout(() => {
      this.syncing.set(false);
      alert(`Change request sent for "${chapter.title}"`);
    }, 800);
  }

  /* ===============================
     OFFLINE QUEUE (PLACEHOLDER)
  =============================== */
  private queueOfflineRequest(chapter: Chapter) {
    console.warn(
      'Offline: change request queued for',
      chapter.id
    );
  }

  /* ===============================
     FILTER HANDLERS
  =============================== */
  selectClass(value: string) {
    this.selectedClass.set(value);
  }

  selectSubject(value: string) {
    this.selectedSubject.set(value);
  }
}
