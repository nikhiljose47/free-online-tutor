import { ChangeDetectionStrategy, Component, inject, Input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClassDocService } from '../../../services/class/class-doc/class-doc';
import { ClassDoc } from '../../../models/classes/class-doc.model';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClassOverviewComponent {
  @Input({ required: true }) classId!: string;

  private classDocApi = inject(ClassDocService);

  // readonly data = signal<ClassOverview>({
  //   className: '6',
  //   totalStudents: 320,
  //   totalBatches: 5,
  //   upcomingClass: '2 hrs',
  //   enrollmentOpen: true,
  //   subjects: [
  //     {
  //       name: 'Mathematics',
  //       currentIndex: 2,
  //       chapters: ['Numbers', 'Fractions', 'Decimals', 'Ratio', 'Algebra'],
  //     },
  //     {
  //       name: 'Science',
  //       currentIndex: 1,
  //       chapters: ['Food', 'Components', 'Fibre', 'Sorting', 'Separation'],
  //     },
  //   ],
  // });
  readonly data = signal<ClassOverview | null>(null);

  readonly classDocData = signal<ClassDoc | null>(null); 

  constructor() {
    this.load('CL06');
  }

  private load(classId: string) {
    this.classDocApi.getOnce(classId).subscribe((doc) => {
      if (!doc) return;
      this.classDocData.set(doc);
      this.data.set(this.mapToOverview(doc));
    });
  }

  private mapToOverview(doc: ClassDoc): ClassOverview {
    const now = Date.now();
    const next = doc.nextClassAt?.toMillis?.() ?? now;
    const diffMs = next - now;
    const upcoming = diffMs > 0 ? `${Math.floor(diffMs / 3600000)} hrs` : 'Ongoing';

    return {
      className: doc.title,
      totalStudents: doc.studentCount,
      totalBatches: 1,
      upcomingClass: upcoming,
      enrollmentOpen: doc.enrollmentOpen,
      subjects: [],
    };
  }
}
