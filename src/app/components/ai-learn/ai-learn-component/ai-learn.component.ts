import {
  Component,
  ChangeDetectionStrategy,
  ElementRef,
  ViewChild,
  effect,
  inject,
  signal,
  computed,
  Input,
  DestroyRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { AiLearnService } from '../../../services/ai-learn/ai-learn.service';
import { AiLearnResultCardComponent } from '../ai-learn-result-card.component/ai-learn-result-card.component';
import { AiContentRendererComponent } from '../ai-learn-content-renderer/ai-learn-content-renderer.component';
import { AiLearnBadgeComponent } from '../ai-learn-badge/ai-learn-badge.component';
import { UserPointsService } from '../../../services/user/user-points/user-points.service';
import { UiStateUtil } from '../../../shared/state/ui-state.utils';
import { defer, of } from 'rxjs';

@Component({
  selector: 'ai-learn',
  standalone: true,
  imports: [
    CommonModule,
    AiLearnBadgeComponent,
    AiLearnResultCardComponent,
    AiContentRendererComponent,
  ],
  templateUrl: './ai-learn.component.html',
  styleUrls: ['./ai-learn.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AiLearnComponent {
  private learn = inject(AiLearnService);
  private destroyRef = inject(DestroyRef);

  @ViewChild('container') container!: ElementRef;

  @Input({ required: true }) flowNext!: (
    step?: 'slides' | 'game' | 'dashboard' | 'ai-learn',
  ) => void;
   @Input() flowRedoSlides!: () => void;

  private pointsService = inject(UserPointsService);
  private uiStateUtil = inject(UiStateUtil);

  domain = toSignal(
    defer(() => of(this.uiStateUtil.get<string>('currentClassName') || '')),
    { initialValue: '' },
  );
  
  private context = 'Getting started with Flutter & Apps';
  private MAX_STEPS = 10;

  readonly steps = this.learn.steps;
  readonly currentIndex = this.learn.currentIndex;
  readonly score = this.learn.score;
  readonly loading = this.learn.loading;

  readonly answer = signal('');
  readonly expanded = signal(false);

  /* RESULT STATE */
  readonly showResult = signal(false);
  readonly isCorrect = signal(false);
  readonly feedback = signal('');
  readonly gainedPoints = signal(0);
  readonly nextClicked = signal(false);

  readonly currentStep = computed(() => this.steps()[this.currentIndex()]);
  readonly progress = computed(() => this.learn.progress());

  constructor() {
    effect(() => {
      this.steps();
      queueMicrotask(() => {
        this.container?.nativeElement?.scrollTo({
          top: this.container.nativeElement.scrollHeight,
          behavior: 'smooth',
        });
      });
    });
  }

  ngOnInit() {
    this.learn
      .init(this.context, this.domain())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }

  /* NEXT FLOW */
  next() {
    if (this.loading()) return;

    this.nextClicked.set(true);
    setTimeout(() => this.nextClicked.set(false), 120);

    if (this.showResult()) {
      this.resetResultState();
    }

    if (this.currentIndex() >= this.MAX_STEPS - 1) {
      console.log('Limit reached — trigger payment');
      return;
    }

    this.answer.set('');
    this.expanded.set(false);

    this.learn.next().pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
  }

  /* SUBMIT ANSWER */
  submit() {
    const val = this.answer().trim();
    if (!val || this.loading()) return;

    this.learn
      .evaluate(val)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res: any) => {
        const correct = res?.correct ?? false;

        this.pointsService.addPoints(2, this.currentStep().title).subscribe();

        this.isCorrect.set(correct);
        this.feedback.set(res?.feedback || '');

        const pts = res?.scoreDelta ?? 0;
        this.gainedPoints.set(pts);

        this.showResult.set(true);

        if (pts > 0) {
          setTimeout(() => this.gainedPoints.set(0), 1200);
        }
      });
  }

  /* RESULT CONTINUE */
  onResultNext() {
    this.next();
  }

  /* RESET RESULT */
  private resetResultState() {
    this.showResult.set(false);
    this.isCorrect.set(false);
    this.feedback.set('');
    this.gainedPoints.set(0);
  }
}
