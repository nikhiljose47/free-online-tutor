import { Injectable, signal, inject, DestroyRef, computed } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Timestamp } from 'firebase/firestore';
import { BatchService } from '../../services/batch/batch.service';
import { Batch, BatchItem } from '../../models/batch/batch.model';

export type UiStatus = 'past' | 'current' | 'upcoming';

export interface UiBatch {
  id: string;
  name: string;
  startTime: Date;
  info: string;
  status: UiStatus;
  isDefault: boolean;
}

@Injectable({ providedIn: 'root' })
export class BatchDataStore {
  private api = inject(BatchService);
  private destroyRef = inject(DestroyRef);

  private _batches = signal<UiBatch[]>([]);
  private _selectedId = signal<string | null>(null);
  private _loading = signal(true);

  batches = this._batches.asReadonly();
  loading = this._loading.asReadonly();

  activeBatches = computed(() => this._batches().filter((b) => b.status === 'current'));

  upcomingBatches = computed(() => this._batches().filter((b) => b.status === 'upcoming'));

  selectedBatch = computed(() => this._batches().find((b) => b.id === this._selectedId()) ?? null);

  count = computed(() => this._batches().length);

  init(classId: string) {
    this._loading.set(true);

    this.api
      .getOnce(classId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res: Batch | null) => {
        const current = res?.curBatches ?? [];
        const upcoming = res?.upcomingBatches ?? [];

        const mapped: UiBatch[] = [
          ...current.map((b) => this.map(b, 'current')),
          ...upcoming.map((b) => this.map(b, 'upcoming')),
        ];

        this._batches.set(mapped);

        const blue =
          mapped.find((b) => b.isDefault && b.status === 'current') ??
          mapped.find((b) => b.status === 'current') ??
          mapped[0];

        this._selectedId.set(blue?.id ?? null);
        this._loading.set(false);
      });
  }

  selectBatch = (b: UiBatch) => {
    if (b.status === 'upcoming') return;
    this._selectedId.set(b.id);
  };

  private map(b: BatchItem, status: UiStatus): UiBatch {
    return {
      id: b.id,
      name: b.label,
      startTime: (b.startAt as Timestamp).toDate(),
      info: 'Live class session',
      status,
      isDefault: b.label === 'Blue',
    };
  }
}
