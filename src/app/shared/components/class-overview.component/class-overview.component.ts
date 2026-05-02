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
import { Chapter, ClassSyllabus } from '../../../models/syllabus/class-syllabus.model';
import { distinctUntilChanged, filter, Subject, switchMap, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LearningViewState } from '../../state/learning-view-state';
import { CourseSidebarComponent } from '../course-sidebar.component/course-sidebar.component';
import { FlowOrchestratorComponent } from '../../../components/flow-orchestrator/flow-orchestrator.component';
import { ClassLookupService } from '../../../services/syllabus/class-lookup/class-lookup.service';

@Component({
  selector: 'class-overview',
  standalone: true,
  imports: [CommonModule, CourseSidebarComponent, FlowOrchestratorComponent],
  templateUrl: './class-overview.component.html',
  styleUrls: ['./class-overview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClassOverviewComponent implements OnInit {
  private classId$ = new Subject<string>();

  @Input({ required: true })
  set classId(value: string) {
    this.classId$.next(value);
  }

  private classLookup = inject(ClassLookupService);
  private batchQueryApi = inject(BatchQueryService);
  readonly viewState = inject(LearningViewState);

  readonly dashboard = signal<any>(null);
  selectedBatchId = signal<string | null>(null);

  readonly syllabus = signal<ClassSyllabus | null>(null);

  selectedType = signal<'live' | 'upcoming' | 'enrollmentOpen'>('live');

  constructor() {
    this.classId$
      .pipe(
        filter(Boolean),
        distinctUntilChanged(),
        switchMap((id) => {
          if (this.classLookup.hasData(id)) {
            return [{ id, ok: true }];
          }
          return this.classLookup.load(id).pipe(tap((ok) => ({ id, ok })));
        }),
        tap((res: any) => {
          const id = res.id ?? res[0]?.id;
          const ok = res.ok ?? res[0]?.ok;
          if (!ok) return;

          const data = this.classLookup.get(id);

          this.syllabus.set(data);
          this.viewState.setSyllabus(data);
          

          const firstSub = data.subjects?.[0]?.code ?? null;
          if (firstSub) this.viewState.selectSubject(firstSub);
        }),
        takeUntilDestroyed(),
      )
      .subscribe();
  }

  readonly allBatches = computed(() => [
    ...(this.dashboard()?.live ?? []),
    ...(this.dashboard()?.upcoming ?? []),
  ]);

  selectedBatch = computed(() => {
    const id = this.selectedBatchId();
    if (!id) return null;
    return this.allBatches().find((b) => b.id === id) ?? null;
  });

  readonly mergedSubjectProgress = computed(() => {
    const batch = this.selectedBatch();
    const syllabus = this.syllabus();

    if (!batch || !syllabus) return [];

    const subjectMap = new Map(syllabus.subjects.map((s) => [s.code, s]));

    return batch.subjectIndex.map((sub: any) => {
      const subject = subjectMap.get(sub.subjectId);

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
    this.batchQueryApi.getDashboard(this.classId).subscribe((db) => {
      this.dashboard.set(db);
      const first = db.live?.[0] ?? db.upcoming?.[0] ?? db.enrollmentOpen?.[0] ?? null;

      if (first) this.selectedBatchId.set(first.id);
    });
  }

  onSelectBatch(b: BatchDoc) {
    this.selectedBatchId.set(b.id);
  }

  trackSubject = (_: number, item: any) => item?.subjectId || item?.subjectName;
  trackBatch = (_: number, item: any) => item?.id;
}
