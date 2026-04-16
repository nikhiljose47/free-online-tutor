import { ChangeDetectionStrategy, Component, inject, signal, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { of, delay, tap, shareReplay } from 'rxjs';
import { LearnTubePersistService } from '../../services/learn-tube-persist/learn-tube-persist.service';

@Component({
  selector: 'learn-tube-dashboard',
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
  @Input() flowRestart!: () => void;

  private stageSvc = inject(LearnTubePersistService);

  loading = signal(true);

  isSlides = this.stageSvc.isSlides;
  isQuestion = this.stageSvc.isSlideEnded;
  isLearn = this.stageSvc.isQuizEnded;

  private cacheKey = 'learn-tube-dashboard-lite';

  constructor() {
    this.init();
  }

  private init() {
    const cached = localStorage.getItem(this.cacheKey);

    if (cached) {
      this.loading.set(false);
      return;
    }

    this.prefetch()
      .pipe(
        tap(() => {
          localStorage.setItem(this.cacheKey, '1');
          this.loading.set(false);
        }),
        shareReplay(1),
      )
      .subscribe();
  }

  private prefetch() {
    return of(true).pipe(delay(500));
  }

  // 👉 BUTTON DRIVEN FLOW

  goToQuestion() {
    this.flowNext('game');
  }

  goToLearn() {
    this.flowNext('ai-learn');
  }

  goToDashboard() {
    // 👉 stay/reset dashboard
    this.flowNext('dashboard');
  }
}
