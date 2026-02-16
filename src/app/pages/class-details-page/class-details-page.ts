import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { McqPuzzleCardComponent } from '../../components/mcq-puzzle-card/mcq-puzzle-card';
import { Timetable } from '../../components/timetable/timetable';
import { CommonModule } from '@angular/common';
import { TeacherListComponent } from '../../components/teacher-list/teacher-list';

@Component({
  selector: 'class-details-page',
  standalone: true,
  templateUrl: './class-details-page.html',
  styleUrl: './class-details-page.scss',
  imports: [McqPuzzleCardComponent, Timetable, CommonModule, TeacherListComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClassDetailsPage {
  classId = 'CL09';
  classTitle = 'Class 6 – Blue Batch';
  puzzleId = 'puzzle_001';

  tabs = ['Overview', 'Timetable', 'Tests', 'Announcements'] as const;

  activeTab = signal<(typeof this.tabs)[number]>('Overview');

  subjects = signal(Array.from({ length: 8 }).map((_, i) => ({ id: i + 1 })));

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
