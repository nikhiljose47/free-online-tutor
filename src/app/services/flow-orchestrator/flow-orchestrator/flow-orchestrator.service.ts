// import { Injectable, computed, signal, inject, effect } from '@angular/core';
// import { Type } from '@angular/core';
// import { toSignal } from '@angular/core/rxjs-interop';
// import { LearnTubePersistService } from '../../learn-tube-persist/learn-tube-persist.service';
// import { LearnTubeService, LearnTubeStage } from '../../learn-tube/learn-tube.service';
// import { LearnTubeComponent } from '../../../components/learn-tube.component/learn-tube.component';
// import { LearnTubeQuizPlayerComponent } from '../../../components/learn-tube-quiz-player/learn-tube-quiz-player.component/learn-tube-quiz-player.component';
// import { AiLearnComponent } from '../../../components/ai-learn/ai-learn-component/ai-learn.component';
// import { LearnTubeDashboardComponent } from '../../../components/learn-tube-dashboard/learn-tube-dashboard';

// type FlowStep = 'slides' | 'game' | 'ai-learn' | 'dashboard';

// @Injectable({ providedIn: 'root' })
// export class FlowOrchestratorService {
//   private persist = inject(LearnTubePersistService);
//   private api = inject(LearnTubeService);

//   private stageSig = toSignal(this.api.stageChanges$, {
//     initialValue: this.persist.stage(),
//   });

//   private step = signal<FlowStep>(this.mapStage(this.stageSig()));

//   readonly currentComponent = computed<Type<unknown>>(
//     () =>
//       ({
//         slides: LearnTubeComponent,
//         game: LearnTubeQuizPlayerComponent,
//         'ai-learn': AiLearnComponent,
//         dashboard: LearnTubeDashboardComponent,
//       })[this.step()],
//   );

//   readonly childInputs = {
//     flowNext: (step?: FlowStep) => this.go(step),
//     flowRedoSlides: () => this.go('slides'),
//   };

//   constructor() {
//     effect(() => {
//       const stage = this.stageSig();
//       this.persist.set(stage);
//       this.step.set(this.mapStage(stage));
//     });
//   }

//   go(step?: FlowStep) {
//     if (!step) return this.step.update((s) => this.next(s));
//     this.step.set(step);
//   }

//   private next(current: FlowStep): FlowStep {
//     const map: Record<FlowStep, FlowStep> = {
//       slides: 'game',
//       game: 'ai-learn',
//       'ai-learn': 'dashboard',
//       dashboard: 'dashboard',
//     };

//     return map[current];
//   }

//   private mapStage(stage: LearnTubeStage): FlowStep {
//     if (stage === LearnTubeStage.Slide) return 'slides';
//     if (stage === LearnTubeStage.SlideEnded) return 'dashboard';
//     return 'dashboard';
//   }
// }
