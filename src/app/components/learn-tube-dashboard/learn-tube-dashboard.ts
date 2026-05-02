import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  computed,
  Input,
  PLATFORM_ID,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { of, delay, tap, shareReplay, fromEvent, merge } from 'rxjs';
import { map, startWith, debounceTime } from 'rxjs/operators';
import { LocalStoreService } from '../../core/services/local-store/local-store.service';

type CardType = 'insight' | 'challenge' | 'flow';

@Component({
  selector: 'app-test-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './learn-tube-dashboard.html',
  styleUrls: ['./learn-tube-dashboard.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LearnTubeDashboardComponent {
  @Input({ required: true }) flowNext!: (
    step?: 'slides' | 'game' | 'dashboard' | 'ai-learn',
  ) => void;

  @Input() flowRedoSlides!: () => void;

  private store = inject(LocalStoreService);
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);


  loading = signal(true);

  private cacheKey = 'learn_tube_dashboard_lite';

  /* step order (IMPORTANT) */
  private readonly order: CardType[] = ['insight', 'challenge', 'flow'];

  /* current active */
  readonly selected = 'challenge';

  /* 🔥 completed logic (clean + scalable) */
  readonly completedSet = computed<Set<CardType>>(() => {
    const currentIndex = this.order.indexOf(this.selected);
    return new Set(this.order.slice(0, currentIndex));
  });

  /* helper (used in HTML) */
  isCompleted = (type: CardType) => this.completedSet().has(type);

  /* cards */
  readonly items = signal([
    {
      type: 'insight' as CardType,
      title: 'Insight',
      sub: 'Daily concept distilled',
      action: () => this.goToDashboard(),
    },
    {
      type: 'challenge' as CardType,
      title: 'Challenge',
      sub: 'Sharpen with one question',
      action: () => this.goToQuestion(),
    },
    {
      type: 'flow' as CardType,
      title: 'Guided Flow',
      sub: 'Adaptive learning + quiz stream',
      action: () => this.goToLearn(),
    },
  ]);

  /* network */
  readonly isOnline$ = this.isBrowser
    ? merge(
        fromEvent(window, 'online').pipe(map(() => true)),
        fromEvent(window, 'offline').pipe(map(() => false)),
      ).pipe(
        startWith(navigator.onLine),
        debounceTime(200),
        shareReplay({ bufferSize: 1, refCount: true }),
      )
    : of(true);

  constructor() {
    this.init();
  }

  private init() {
    const cached = this.store.get<boolean>(this.cacheKey, false);

    if (cached) {
      this.loading.set(false);
      return;
    }

    this.prefetch()
      .pipe(
        tap(() => {
          this.store.set(this.cacheKey, true);
          this.loading.set(false);
        }),
        shareReplay(1),
      )
      .subscribe();
  }

  redoInsight() {
    this.flowRedoSlides();
  }

  private prefetch() {
    return of(true).pipe(delay(500));
  }

  select(item: CardType, action: () => void) {
    action();
  }

  goToQuestion() {
    this.flowNext('game');
  }

  goToLearn() {
    this.flowNext('ai-learn');
  }

  goToDashboard() {
    this.flowNext('dashboard');
  }
}
