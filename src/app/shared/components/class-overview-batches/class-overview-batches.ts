import {
  ChangeDetectionStrategy,
  Component,
  Input,
  computed,
  inject,
  signal,
  effect,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';

import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { IndexingService } from '../../../services/indexing/indexing.service';

/* ===============================
   MODELS
================================ */
export interface BatchRoadmapItem {
  subject: string;
  done: number;
  total: number;
}

export interface BatchOverview {
  started: boolean;
  percent: number;
  roadmap: BatchRoadmapItem[];
}

/* ===============================
   MOCK SERVICE CONTRACT
   (replace with real domain service)
================================ */
interface BatchService {
  getBatchOverview$(classId: string): Observable<{
    blue: BatchOverview;
    yellow: BatchOverview;
  }>;
}

@Component({
  selector: 'class-overview-batches',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './class-overview-batches.html',
  styleUrls: ['./class-overview-batches.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClassOverviewBatchesComponent implements OnInit {
  private batchApi = inject<BatchService>(Object as any); // replace with real service
  private readonly _classId = signal<string | null>(null);

  private indexApi = inject(IndexingService);

  @Input({ required: true })
  set classId(value: string | null) {
    this._classId.set(value);
  }

  readonly batchList = toSignal(
    toObservable(this._classId).pipe(
      switchMap((id) => (id ? this.indexApi.getAllBatches$() : of([]))),
    ),
    { initialValue: [] },
  );

  ngOnInit() {
    if (this._classId()) {
    }
  }
}
