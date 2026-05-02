// import { Injectable, signal, computed, inject, PLATFORM_ID } from '@angular/core';
// import { isPlatformBrowser } from '@angular/common';
// import { LearnTubeStage } from '../learn-tube/learn-tube.service';

// @Injectable({ providedIn: 'root' })
// export class LearnTubePersistService {

//   private readonly KEY = 'lt_stage_v1';
//   private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

//   private _stage = signal<LearnTubeStage>(this.getInitial());

//   stage = this._stage.asReadonly();

//   isSlides = computed(() => this._stage() === LearnTubeStage.Slide);
//   isSlideEnded = computed(() => this._stage() === LearnTubeStage.SlideEnded);
//   isQuizEnded = computed(() => this._stage() === LearnTubeStage.QuizEnded);

//   /* ===== FLOW ===== */
//   next() {
//     const current = this._stage();

//     let next: LearnTubeStage;

//     switch (current) {
//       case LearnTubeStage.Slide:
//         next = LearnTubeStage.SlideEnded;
//         break;
//       case LearnTubeStage.SlideEnded:
//         next = LearnTubeStage.QuizEnded;
//         break;
//       default:
//         next = current;
//     }

//     this.set(next);
//   }

//   set(stage: LearnTubeStage) {
//     this._stage.set(stage);
//     this.persist(stage);
//   }

//   reset() {
//     this.set(LearnTubeStage.Slide);
//   }

//   toQuestion() {
//     this.set(LearnTubeStage.SlideEnded);
//   }

//   /* ===== STORAGE ===== */
//   private getInitial(): LearnTubeStage {
//     if (!this.isBrowser) return LearnTubeStage.Slide;

//     try {
//       const v = localStorage.getItem(this.KEY) as LearnTubeStage | null;
//       return v && Object.values(LearnTubeStage).includes(v)
//         ? v
//         : LearnTubeStage.Slide;
//     } catch {
//       return LearnTubeStage.Slide;
//     }
//   }

//   private persist(stage: LearnTubeStage) {
//     if (!this.isBrowser) return;
//     try {
//       localStorage.setItem(this.KEY, stage);
//     } catch {}
//   }
// }