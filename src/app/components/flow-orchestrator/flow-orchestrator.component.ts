import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
  Type,
  inject,
  effect,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { LearnTubeQuizPlayerComponent } from '../learn-tube-quiz-player/learn-tube-quiz-player.component/learn-tube-quiz-player.component';
import { LearnTubeDashboardComponent } from '../learn-tube-dashboard/learn-tube-dashboard';
import { LearnTubeComponent } from '../learn-tube.component/learn-tube.component';
import { AiLearnComponent } from '../ai-learn/ai-learn-component/ai-learn.component';

import { LearnTubePersistService } from '../../services/learn-tube-persist/learn-tube-persist.service';
import { LearnTubeService, LearnTubeStage } from '../../services/learn-tube/learn-tube.service';

type FlowStep = 'slides' | 'game' | 'ai-learn' | 'dashboard';

@Component({
  selector: 'flow-orchestrator',
  standalone: true,
  imports: [CommonModule],
  template: `
    <ng-container *ngComponentOutlet="currentComponent(); inputs: childInputs()"> </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlowOrchestratorComponent {
  private readonly persistService = inject(LearnTubePersistService);
  private learnTubeApi = inject(LearnTubeService);

  private slideRedoOn = false;
  private readonly flowState = signal<{
    step: FlowStep;
    restarted: boolean;
  }>({
    step: this.getInitialStep(),
    restarted: false,
  });

  private readonly flowSequence: FlowStep[] = ['slides', 'game', 'ai-learn', 'dashboard'];

  readonly currentComponent = computed<Type<unknown>>(() => {
    switch (this.flowState().step) {
      case 'slides':
        return LearnTubeComponent;
      case 'game':
        return LearnTubeQuizPlayerComponent;
      case 'ai-learn':
        return AiLearnComponent;
      default:
        return LearnTubeDashboardComponent;
    }
  });

  readonly childInputs = computed(() => ({
    flowNext: (step?: FlowStep) => this.go(step),
    // flowRestart: () => this.restartToDashboard(),
    flowRedoSlides: () => this.redoSlides(),
  }));

  constructor() {
    effect(() => {
      const stage = this.persistService.stage();
      const current = this.flowState().step;

      if (stage === LearnTubeStage.Slide && current !== 'slides') {
        this.flowState.set({ step: 'slides', restarted: false });
      }

      console.log('[FLOW]', this.flowState().step, '| stage:', stage);
    });

    this.learnTubeApi.stageChanges$.subscribe((stage) => {
      if (!this.slideRedoOn) {
        this.persistService.set(stage);
      }
      this.slideRedoOn = false;

      console.log('Stage changed to:', stage);
      // 👉 MAIN LOGIC
      if (stage === LearnTubeStage.SlideEnded) {
        this.flowState.set({ step: 'dashboard', restarted: false });
      }
    });
  }

  redoSlides() {
    this.slideRedoOn = true;
    this.flowState.set({ step: 'slides', restarted: true });
  }

  private getInitialStep(): FlowStep {
    const stage = this.persistService.stage();

    return stage === LearnTubeStage.Slide ? 'slides' : 'dashboard';
  }

  private go(step?: FlowStep) {
    if (step) {
      this.flowState.set({ step, restarted: false });
      return;
    }

    const current = this.flowState().step;
    const index = this.flowSequence.indexOf(current);
    const nextStep = this.flowSequence[index + 1] ?? 'dashboard';

    this.flowState.set({ step: nextStep, restarted: false });
  }
}
