import { ChangeDetectionStrategy, Component, computed, inject, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BatchQueryService } from '../../../services/class/batch-query/batch-query.service';
import { BatchDoc } from '../../../models/batch/batch-doc.model';
import { SyllabusLookupService } from '../../../services/syllabus/syllabus-lookup.service';

interface DashBoard {
  total: number;
  upcoming: BatchDoc[];
  live: BatchDoc[];
  enrollmentOpen: BatchDoc[];
  upcomingCount: number;
  liveCount: number;
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

  batchQueryApi = inject(BatchQueryService);
  syllLookUpApi = inject(SyllabusLookupService);

  readonly batches = signal<any[]>([
    {
      name: 'Batch A',
      time: '4:30 PM',
      status: 'live',
      totalStudents: 320,
      totalBatches: 3,
      upcomingClass: '2 hrs',
      enrollmentOpen: true,
      subjects: [
        {
          name: 'Mathematics',
          currentIndex: 2,
          chapters: ['Numbers', 'Fractions', 'Decimals', 'Ratio', 'Algebra'],
        },
        {
          name: 'Science',
          currentIndex: 1,
          chapters: ['Food', 'Components', 'Fibre', 'Sorting', 'Separation'],
        },
      ],
    },
    {
      name: 'Batch B',
      time: '6:00 PM',
      status: 'upcoming',
      totalStudents: 210,
      totalBatches: 3,
      upcomingClass: '5 hrs',
      enrollmentOpen: true,
      subjects: [
        {
          name: 'Mathematics',
          currentIndex: 1,
          chapters: ['Numbers', 'Fractions', 'Decimals', 'Ratio', 'Algebra'],
        },
        {
          name: 'Science',
          currentIndex: 0,
          chapters: ['Food', 'Components', 'Fibre', 'Sorting', 'Separation'],
        },
      ],
    },
  ]);

  readonly dashboard = signal<DashBoard | null>(null);

  selectedBatchId = signal<string | null>(null);

  selectedType = signal<'live' | 'upcoming' | 'enrollmentOpen'>('live');
  selectedBatch = computed(() => {
    const db = this.dashboard();
    if (!db || !this.selectedBatchId()) return null;

    return [...db.live, ...db.upcoming].find((b) => b.id === this.selectedBatchId()) ?? null;
  });

  constructor() {
    this.loadBatchStore();
    var x = this.syllLookUpApi.getChapters('CL06', 'CL06-MATH').subscribe((e) => {
      console.log(e);
    });
    var y = this.syllLookUpApi.getSubjects('CL06');

    console.log(y);
  }

  onSelectBatch(b: BatchDoc) {
    this.selectedBatchId.set(b.id);
  }

  loadBatchStore() {
    this.batchQueryApi.getDashboard('CL06').subscribe((e) => {
      this.dashboard.set(e);
    });
  }
}
