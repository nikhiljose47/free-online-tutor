import { Component, ChangeDetectionStrategy, computed, signal, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { fromEvent, merge, of } from 'rxjs';
import { map, startWith, shareReplay } from 'rxjs/operators';

type Level = {
  title: string;
  sub: string;
  min: number;
};

@Component({
  selector: 'ai-learn-badge',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ai-learn-badge.component.html',
  styleUrls: ['./ai-learn-badge.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AiLearnBadgeComponent {
  /* INPUTS (replace dummy later) */
  @Input({ required: true }) progress!: () => number; // use your progress()
  @Input({ required: true }) points!: () => number; // use score() or gainedPoints()

  /* LEVEL CONFIG */
  readonly levelData = signal<Level[]>([
    { title: 'Consistent', sub: 'You showed up. Streak begins.', min: 0 },
    { title: 'On Fire', sub: 'Strong. Rolling.', min: 25 },
    { title: 'Elite Club', sub: 'Ahead of top 1%.', min: 55 },
    { title: 'Top Tier', sub: 'Flying beyond limits.', min: 80 },
  ]);

  /* LEVEL DETECTION */
  readonly currentLevel = computed(() => {
    const p = this.progress?.() ?? 0;
    const levels = this.levelData();
    let idx = 0;

    for (let i = 0; i < levels.length; i++) {
      if (p >= levels[i].min) idx = i;
    }
    return idx;
  });

  readonly stepsArr = Array.from({ length: 6 });

  readonly currentStepIndex = computed(() => {
    return Math.min(4, Math.floor((this.progress() || 0) / 20));
  });

  /* CLOCK */
  readonly time = signal('');
  readonly day = signal('');

  /* SPIKES (UI only) */
  readonly spikeArray = Array.from({ length: 20 });

  /* OFFLINE / LOW INTERNET SAFE CACHE */
  private storageKey = 'badge_state_v1';

  private cached = signal<{ progress: number; points: number }>({
    progress: 0,
    points: 0,
  });

  constructor() {
    this.hydrate();
    this.persistEffect();
    this.networkReactiveBoost();
    setInterval(() => {
      const d = new Date();
      this.time.set(d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      this.day.set(d.toLocaleDateString(undefined, { weekday: 'short' }));
    }, 1000);
  }

  /* LOAD CACHE */
  private hydrate() {
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (raw) this.cached.set(JSON.parse(raw));
    } catch {}
  }

  /* SAVE CACHE */
  private persistEffect() {
    computed(() => {
      const data = {
        progress: this.progress?.() ?? 0,
        points: this.points?.() ?? 0,
      };
      localStorage.setItem(this.storageKey, JSON.stringify(data));
      return data;
    });
  }

  /* RXJS INITIAL LOAD + NETWORK AWARE */
  private networkReactiveBoost() {
    const online$ = merge(
      fromEvent(window, 'online').pipe(map(() => true)),
      fromEvent(window, 'offline').pipe(map(() => false)),
    ).pipe(startWith(navigator.onLine), shareReplay(1));

    online$.subscribe((isOnline) => {
      if (!isOnline) {
        const c = this.cached();
        if (c.progress) {
          // fallback to cached when offline
          (this.progress as any) = () => c.progress;
          (this.points as any) = () => c.points;
        }
      }
    });
  }
}
