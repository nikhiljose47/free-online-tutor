import { Injectable, computed, signal, inject, effect } from '@angular/core';
import { Type } from '@angular/core';
import { UserProfileService } from '../../../core/services/fire/user-profile.service';

import { LearnTubeComponent } from '../../../components/learn-tube.component/learn-tube.component';
import { LearnTubeQuizPlayerComponent } from '../../../components/learn-tube-quiz-player/learn-tube-quiz-player.component/learn-tube-quiz-player.component';
import { AiLearnComponent } from '../../../components/ai-learn/ai-learn-component/ai-learn.component';
import { LearnTubeDashboardComponent } from '../../../components/learn-tube-dashboard/learn-tube-dashboard';
import { FlowPersistService } from '../flow-persist/flow-persist.service';

type FlowStep = 'slides' | 'game' | 'ai-learn' | 'dashboard';

@Injectable({ providedIn: 'root' })
export class FlowOrchestratorService {
  private persist = inject(FlowPersistService);
  private profileApi = inject(UserProfileService);

  readonly userProfile = this.profileApi.profile;

  private step = signal<FlowStep>('slides');
  private loadedUser = signal<string | null>(null);

  readonly currentComponent = computed<Type<unknown>>(() => {
    const s = this.step();
    console.log('[FLOW] render component →', s);
    return {
      slides: LearnTubeComponent,
      game: LearnTubeQuizPlayerComponent,
      'ai-learn': AiLearnComponent,
      dashboard: LearnTubeDashboardComponent,
    }[s];
  });

  readonly childInputs = {
    flowNext: () => this.next(),
    flowRedoSlides: () => this.redoSlides(),
  };

  constructor() {
    effect(async () => {
      const user = this.userProfile();
      if (!user?.uid) return;

      if (this.loadedUser() === user.uid) return;

      console.log('[FLOW] loading user →', user.uid);
      this.loadedUser.set(user.uid);

      await this.persist.load(user.uid);

      const state = this.persist.state();
      console.log('[FLOW] loaded state →', state);

      if (state) {
        const step = this.deriveStep(state);
        console.log('[FLOW] initial step →', step);
        this.step.set(step);
      }
    });

    effect(() => {
      const state = this.persist.state();
      if (!state) return;

      console.log('[FLOW] state changed →', state);

      const step = this.deriveStep(state);
      console.log('[FLOW] derived step →', step);

      this.step.set(step);
    });
  }

  private next() {
    const user = this.userProfile();
    const state = this.persist.state();

    console.log('[FLOW] next() called', { user, state });

    if (!user?.uid || !state) return;

    if (!state.states.slides.done) {
      console.log('[FLOW] marking slides done');
      this.persist.markDone(user.uid, 'slides');
      return;
    }

    if (!state.states.game.done) {
      console.log('[FLOW] marking game done');
      this.persist.markDone(user.uid, 'game');
      return;
    }

    if (!state.states.ai.done) {
      console.log('[FLOW] marking ai done');
      this.persist.markDone(user.uid, 'ai');
      return;
    }

    console.log('[FLOW] all done → dashboard');
  }

  private redoSlides() {
    const user = this.userProfile();

    console.log('[FLOW] redoSlides()', user);

    if (!user?.uid) return;

    this.persist.redoSlides(user.uid);
  }

  private deriveStep(state: any): FlowStep {
    const result =
      !state.states.slides.done ? 'slides' :
      !state.states.game.done ? 'game' :
      !state.states.ai.done ? 'ai-learn' :
      'dashboard';

    console.log('[FLOW] deriveStep()', state.states, '→', result);

    return result;
  }
}