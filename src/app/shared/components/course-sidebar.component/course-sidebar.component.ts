import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  Signal,
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { Chapter, Subject } from '../../../models/syllabus/class-syllabus.model';

@Component({
  selector: 'course-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './course-sidebar.component.html',
  styleUrls: ['./course-sidebar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CourseSidebarComponent {

  @Input({ required: true }) subjects!: Signal<Subject[]>;
  @Input({ required: true }) chapters!: Signal<Chapter[]>;
  @Input({ required: true }) selectedSubject!: Signal<string | null>;
  @Input({ required: true }) selectedChapter!: Signal<Chapter | null>;

  @Output() selectSubject = new EventEmitter<string>();
  @Output() selectChapter = new EventEmitter<Chapter>();

  trackByCode = (_: number, item: Chapter) => item.code;

  getDifficulty(ch: Chapter): string {
    if (!ch?.divisions?.length) return '';
    return ch.divisions.some(d => d.difficulty_level === 'medium')
      ? 'medium'
      : 'easy';
  }
}