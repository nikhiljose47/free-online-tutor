import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { McqPuzzleCardComponent } from '../../components/mcq-puzzle-card/mcq-puzzle-card';
import { Timetable } from '../../components/timetable/timetable';
import { CommonModule } from '@angular/common';
import { TeacherListComponent } from '../../components/teacher-list/teacher-list';
import { ClassOverviewComponent } from '../../shared/components/class-overview.component/class-overview.component';

interface Faq {
  q: string;
  a: string;
}

interface ClassStat {
  value: string;
  label: string;
}

@Component({
  selector: 'class-details-page',
  standalone: true,
  templateUrl: './class-details-page.html',
  styleUrl: './class-details-page.scss',
  imports: [McqPuzzleCardComponent, Timetable, CommonModule, TeacherListComponent, ClassOverviewComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClassDetailsPage {
  classId = 'CL09';
  classTitle = 'Class 6 – Blue Batch';
  puzzleId = 'puzzle_001';

  tabs = [ 'Timetable', 'Tests', 'Announcements'] as const;

  activeTab = signal<(typeof this.tabs)[number]>('Announcements');

  subjects = signal(Array.from({ length: 8 }).map((_, i) => ({ id: i + 1 })));

  readonly openIndex = signal<number | null>(0);

  readonly faqs = signal<Faq[]>([
    {
      q: 'How are classes conducted?',
      a: 'Classes are delivered through structured live sessions, recorded lessons, and guided practice modules for consistent learning.',
    },
    {
      q: 'Can I access content offline?',
      a: 'Yes, key learning resources are cached for smooth access even on low or unstable internet connections.',
    },
    {
      q: 'How do I track my progress?',
      a: 'You can monitor performance using weekly analytics, teacher feedback, and assessment scores inside your dashboard.',
    },
    {
      q: 'Are doubt-solving sessions available?',
      a: 'Dedicated doubt-clearing sessions and teacher chat support are available to ensure concept clarity.',
    },
  ]);

  readonly stats = signal<ClassStat[]>([
    { value: '12,500+', label: 'Students learning in this class' },
    { value: '28', label: 'States actively connected' },
    { value: '4,200+', label: 'Hours of guided sessions' },
    { value: '96%', label: 'Concept clarity satisfaction' },
  ]);

  toggle(i: number) {
    this.openIndex.update((v) => (v === i ? null : i));
  }

  selectTab(tab: (typeof this.tabs)[number]) {
    this.activeTab.set(tab);
  }

  onPuzzleCompleted(id: string) {
    console.log('Puzzle completed:', id);

    // example:
    // give XP
    // unlock next lesson
    // call API
  }
}
