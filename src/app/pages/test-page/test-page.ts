import { ChangeDetectionStrategy, Component, inject, signal, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { fromEvent, merge, of } from 'rxjs';
import { debounceTime, map, startWith, shareReplay } from 'rxjs/operators';

type CardType = 'insight' | 'challenge' | 'flow';

@Component({
  selector: 'test-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './test-page.html',
  styleUrls: ['./test-page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TestPage {
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  readonly active = signal<CardType | null>(null);

  /* REQUIRED for html → items() */
  readonly items = signal([
    { type: 'insight' as CardType, title: 'Insight', sub: 'Daily concept distilled' },
    { type: 'challenge' as CardType, title: 'Challenge', sub: 'Sharpen with one question' },
    { type: 'flow' as CardType, title: 'Guided Flow', sub: 'Adaptive learning + quiz stream' }
  ]);

  readonly isOnline$ = this.isBrowser
    ? merge(
        fromEvent(window, 'online').pipe(map(() => true)),
        fromEvent(window, 'offline').pipe(map(() => false))
      ).pipe(
        startWith(navigator.onLine),
        debounceTime(200),
        shareReplay({ bufferSize: 1, refCount: true })
      )
    : of(true);

  open(type: CardType) {
    this.active.set(type);

    const routeMap: Record<CardType, string> = {
      insight: '/insight',
      challenge: '/challenge',
      flow: '/learn-flow'
    };

    this.router.navigateByUrl(routeMap[type]);
  }

  preload$ = of({
    insight: { title: 'Insight', content: 'Atomic habits concept' },
    challenge: { q: 'What is diffusion rate proportional to?' },
    flow: { steps: 5 }
  }).pipe(shareReplay(1));

  /*
    replace later:
    preload$ = this.service.getHomeData().pipe(shareReplay(1))
  */
}