import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  Input,
  OnInit,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { BatchQueryService } from '../../../services/class/batch-query/batch-query.service';
import { BatchDoc } from '../../../models/batch/batch-doc.model';
import { SyllabusLookupService } from '../../../services/syllabus/syllabus-lookup.service';
import { Chapter } from '../../../models/syllabus/class-syllabus.model';
import { combineLatest, map, of, shareReplay, switchMap, tap } from 'rxjs';

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
export class ClassOverviewComponent implements OnInit {
  @Input({ required: true }) classId!: string;

  batchQueryApi = inject(BatchQueryService);
  syllLookUpApi = inject(SyllabusLookupService);

  readonly dashboard = signal<DashBoard | null>(null);
  selectedBatchId = signal<string | null>(null);
  private syllabusSignal = signal<any[]>([]);
  selectedType = signal<'live' | 'upcoming' | 'enrollmentOpen'>('live');

  selectedBatch = computed(() => {
    const db = this.dashboard();
    if (!db || !this.selectedBatchId()) return null;

    return [...db.live, ...db.upcoming].find((b) => b.id === this.selectedBatchId()) ?? null;
  });

  readonly mergedSubjectProgress = computed(() => {
    const batch = this.selectedBatch();
    const syllabus = this.syllabusSignal();

    if (!batch || !syllabus.length) return [];

    return batch.subjectIndex.map((sub) => {
      const subject = syllabus.find((s) => s.code === sub.subjectId);

      if (!subject || !subject.chapters.length) {
        return {
          subjectName: sub.subjectId,
          total: 0,
          currentIndex: 0,
          percent: 0,
          status: 'not-started',
          currentChapterName: null,
        };
      }

      const total = subject.chapters.length;

      if (!sub.curIndex) {
        return {
          subjectName: subject.name,
          total,
          currentIndex: 0,
          percent: 0,
          status: 'not-started',
          currentChapterName: null,
        };
      }

      const index = subject.chapters.findIndex((c: Chapter) => c.code === sub.curIndex);

      if (index < 0) {
        return {
          subjectName: subject.name,
          total,
          currentIndex: 0,
          percent: 0,
          status: 'not-started',
          currentChapterName: null,
        };
      }

      const percent = ((index + 1) * 100) / total;

      return {
        subjectName: subject.name,
        total,
        currentIndex: index,
        percent,
        status: 'in-progress',
        currentChapterName: subject.chapters[index].name,
      };
    });
  });

  ngOnInit(): void {
    this.loadBatchStore();
    this.loadSyllabus();
  }

  onSelectBatch(b: BatchDoc) {
    this.selectedBatchId.set(b.id);
  }

  private loadBatchStore(): void {
    this.batchQueryApi.getDashboard(this.classId).subscribe((db) => {
      this.dashboard.set(db);
      const first = db.live?.[0] ?? db.upcoming?.[0] ?? db.enrollmentOpen?.[0] ?? null;

      if (first) this.selectedBatchId.set(first.id);
    });
  }

  private loadSyllabus(): void {
    // this.syllLookUpApi
    //   .getSubjects(this.classId)
    //   .pipe(
    //     switchMap((subjects) =>
    //       subjects?.length
    //         ? combineLatest(
    //             subjects.map((s) =>
    //               this.syllLookUpApi.getChapters(this.classId, s.code).pipe(
    //                 map((chapters) => ({
    //                   code: s.code,
    //                   name: s.name,
    //                   chapters,
    //                 })),
    //               ),
    //             ),
    //           )
    //         : of([]),
    //     ),
    //     shareReplay({ bufferSize: 1, refCount: true }),
    //   )
    //   .subscribe((data) => {
    //     this.syllabusSignal.set(data);
    //   });

    this.syllLookUpApi
      .getSubjects(this.classId)
      .pipe(
        switchMap((subjects) =>
          subjects?.length
            ? combineLatest(
                subjects.map((s) =>
                  this.syllLookUpApi.getChapters(this.classId, s.code).pipe(
                    map((chapters) => ({
                      code: s.code,
                      name: s.name,
                      chapters,
                    })),
                  ),
                ),
              )
            : of([]),
        ),

        shareReplay({ bufferSize: 1, refCount: true }),
      )
      .subscribe((data) => {
        this.syllabusSignal.set(data);
      });
  }
}

// readonly batches = signal<any[]>([
//   {
//     name: 'Batch A',
//     time: '4:30 PM',
//     status: 'live',
//     totalStudents: 320,
//     totalBatches: 3,
//     upcomingClass: '2 hrs',
//     enrollmentOpen: true,
//     subjects: [
//       {
//         name: 'Mathematics',
//         currentIndex: 2,
//         chapters: ['Numbers', 'Fractions', 'Decimals', 'Ratio', 'Algebra'],
//       },
//       {
//         name: 'Science',
//         currentIndex: 1,
//         chapters: ['Food', 'Components', 'Fibre', 'Sorting', 'Separation'],
//       },
//     ],
//   },
//   {
//     name: 'Batch B',
//     time: '6:00 PM',
//     status: 'upcoming',
//     totalStudents: 210,
//     totalBatches: 3,
//     upcomingClass: '5 hrs',
//     enrollmentOpen: true,
//     subjects: [
//       {
//         name: 'Mathematics',
//         currentIndex: 1,
//         chapters: ['Numbers', 'Fractions', 'Decimals', 'Ratio', 'Algebra'],
//       },
//       {
//         name: 'Science',
//         currentIndex: 0,
//         chapters: ['Food', 'Components', 'Fibre', 'Sorting', 'Separation'],
//       },
//     ],
//   },
// ]);
