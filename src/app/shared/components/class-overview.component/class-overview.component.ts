import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface SubjectOverview {
  name: string;
  currentIndex: number;
  chapters: string[];
}

interface ClassOverview {
  className: string;
  totalStudents: number;
  totalBatches: number;
  upcomingClass: string;
  enrollmentOpen: boolean;
  subjects: SubjectOverview[];
}

@Component({
  selector: 'class-overview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './class-overview.component.html',
  styleUrls: ['./class-overview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClassOverviewComponent {
  readonly data = signal<ClassOverview>({
    className: '6',
    totalStudents: 320,
    totalBatches: 5,
    upcomingClass: '2 hrs',
    enrollmentOpen: true,
    subjects: [
      {
        name: 'Mathematics',
        currentIndex: 2,
        chapters: ['Numbers', 'Fractions', 'Decimals', 'Ratio', 'Algebra']
      },
      {
        name: 'Science',
        currentIndex: 1,
        chapters: ['Food', 'Components', 'Fibre', 'Sorting', 'Separation']
      }
    ]
  });
}
