import { Injectable, inject, signal } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { IndexedDbService } from '../../../core/services/cache/db/indexed-db.service';

type FlowStep = 'slides' | 'game' | 'ai-learn' | 'dashboard';

type FlowState = {
  id: string;
  isSync: boolean;
  updatedAt: number;
  states: {
    slides: { done: boolean; updatedAt: number };
    game: { done: boolean; updatedAt: number };
    ai: { done: boolean; updatedAt: number };
  };
  lastStep: FlowStep;
};


@Injectable({ providedIn: 'root' })
export class FlowPersistService {
  private db = inject(IndexedDbService);

  private stateSig = signal<FlowState | null>(null);
  readonly state = this.stateSig.asReadonly();

  private writeQueue$ = new Subject<FlowState>();

  constructor() {
    this.writeQueue$
      .pipe(
        debounceTime(300),
        distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b))
      )
      .subscribe(async (state) => {
        await this.db.set('user_flow_state' as any, state);
        this.stateSig.set(state);
      });
  }

  async load(userId: string) {
    const existing = await this.db.get<FlowState>('user_flow_state' as any, userId);

    if (existing) {
      this.stateSig.set(existing);
      return;
    }

    const fresh: FlowState = {
      id: userId,
      isSync: false,
      updatedAt: Date.now(),
      lastStep: 'slides',
      states: {
        slides: { done: false, updatedAt: 0 },
        game: { done: false, updatedAt: 0 },
        ai: { done: false, updatedAt: 0 },
      },
    };

    this.enqueue(fresh);
  }

  private enqueue(state: FlowState) {
    this.writeQueue$.next(state);
  }

  update(userId: string, patch: Partial<FlowState>) {
    const current = this.stateSig();
    if (!current) return;

    const updated: FlowState = {
      ...current,
      ...patch,
      updatedAt: Date.now(),
      isSync: false,
    };

    this.enqueue(updated);
  }

  markDone(userId: string, key: 'slides' | 'game' | 'ai') {
    const current = this.stateSig();
    if (!current) return;

    const updated: FlowState = {
      ...current,
      updatedAt: Date.now(),
      isSync: false,
      states: {
        ...current.states,
        [key]: { done: true, updatedAt: Date.now() },
      },
    };

    this.enqueue(updated);
  }

  redoSlides(userId: string) {
    const current = this.stateSig();
    if (!current) return;

    const updated: FlowState = {
      ...current,
      updatedAt: Date.now(),
      isSync: false,
      lastStep: 'slides',
      states: {
        ...current.states,
        slides: { done: false, updatedAt: Date.now() },
      },
    };

    this.enqueue(updated);
  }
}