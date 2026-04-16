import { ChangeDetectionStrategy, Component, computed, signal, Type, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LearnTubeQuizPlayerComponent } from '../learn-tube-quiz-player/learn-tube-quiz-player.component/learn-tube-quiz-player.component';
import { LearnTubeDashboardComponent } from '../learn-tube-dashboard/learn-tube-dashboard';
import { LearnTubeComponent } from '../learn-tube.component/learn-tube.component';
import { AiLearnComponent } from '../ai-learn/ai-learn-component/ai-learn.component';

import { LearnTubePersistService } from '../../services/learn-tube-persist/learn-tube-persist.service';
import { LearnTubeStage } from '../../services/learn-tube/learn-tube.service';

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

  private readonly flowState = signal<{
    step: FlowStep;
    restarted: boolean;
  }>(this.resolveInitialState());

  // 👉 updated sequence
  private readonly flowSequence: FlowStep[] = ['slides', 'game', 'ai-learn', 'dashboard'];

  readonly currentComponent = computed<Type<unknown>>(() => {
    const { step, restarted } = this.flowState();

    if (restarted) return LearnTubeDashboardComponent;

    switch (step) {
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
    flowRestart: () => this.restartToDashboard(),
  }));

  private go(step?: FlowStep) {
    if (step) {
      this.flowState.set({ step, restarted: false });
      return;
    }

    const current = this.flowState().step;
    const index = this.flowSequence.indexOf(current);
    const nextStep = this.flowSequence[index + 1] ?? 'dashboard';

    this.flowState.set({
      step: nextStep,
      restarted: false,
    });
  }

  private restartToDashboard() {
    this.flowState.set({
      step: 'dashboard',
      restarted: true,
    });
  }

  initFlowFromCache(cache?: { restarted?: boolean }) {
    if (cache?.restarted) this.restartToDashboard();
  }

  // 👉 updated stage mapping
  private resolveInitialState() {
    const stage = this.persistService.stage();

    if (stage === LearnTubeStage.Slide) {
      return { step: 'slides' as FlowStep, restarted: false };
    }

    if (stage === LearnTubeStage.SlideEnded) {
      return { step: 'game' as FlowStep, restarted: false };
    }

    if (stage === LearnTubeStage.QuizEnded) {
      return { step: 'ai-learn' as FlowStep, restarted: false };
    }

    return { step: 'dashboard' as FlowStep, restarted: false };
  }
}
