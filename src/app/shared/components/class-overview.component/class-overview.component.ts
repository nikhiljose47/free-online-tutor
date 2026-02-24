import { ChangeDetectionStrategy, Component, inject, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { of, switchMap } from 'rxjs';
import { BatchDataStore } from '../../../domain/data/batch.data';

interface SubjectOverview {
  name: string;
  currentIndex: number;
  chapters: string[];
}

interface BatchOverview {
  name: string;
  time: string;
  status: 'upcoming' | 'live' | 'completed';
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

  batchDataApi = inject(BatchDataStore);

  readonly batches = signal<BatchOverview[]>([
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

  readonly selectedBatchIndex = signal(0);

  readonly selectedBatch = signal(this.batches()[0]);

  constructor() {
    this.loadBatchStore();
  }

  loadBatchStore() {
    this.batchDataApi.init('CL06');
    console.log(this.batchDataApi.upcomingBatches())
  }

  onClickBatch(b: any) {
    this.batchDataApi.selectBatch(b);
  }

  selectBatch(i: number) {
    this.selectedBatchIndex.set(i);
    this.selectedBatch.set(this.batches()[i]);
  }
}
