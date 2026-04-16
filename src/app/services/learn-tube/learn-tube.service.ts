import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, Subject } from 'rxjs';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AudioEngine } from '../../core/services/audio/audio.engine';
import { LearnTubeModel, LearnTubeQuestion } from '../../models/learn-tube/learn-tube.model';
import { DEF_SLIDE_BG_DURATION, TYPE_CONFIG } from '../../core/constants/app.constants';

type SvgSlide = {
  type: string;
  path: string;
  duration: number;
  data: any;
};

export interface LearnTubeInitConfig {
  audio?: string; // audio url
  index?: number; // slideSet index OR start index (your choice)
  addOutro?: boolean; // default true
  playAudio?: boolean; // default true
}

export enum LearnTubeStage {
  Slide = 'SLIDE',
  SlideEnded = 'SLIDE_ENDED',
  QuizEnded = 'QUIZ_ENDED',
}

@Injectable({ providedIn: 'root' })
export class LearnTubeService {
  private http = inject(HttpClient);
  private sanitizer = inject(DomSanitizer);
  private audio = inject(AudioEngine);

  private slides = signal<SafeHtml[]>([]);
  private config: SvgSlide[] = [];
  private questions = signal<LearnTubeQuestion[]>([]);
  private bg = signal<string | null>(null);

  private index = signal(0);
  private playing = signal(true);
  private audioEnabled = signal(true);

  isAudioOn = this.audioEnabled;

  private timer: any;
  private stage = signal<LearnTubeStage>(LearnTubeStage.Slide);

  // 🔥 external observable
  private stage$ = new Subject<LearnTubeStage>();
  stageChanges$ = this.stage$.asObservable();

  currentSlide = computed(() => this.slides()[this.index()] || '');
  currentIndex = this.index;
  currentBg = this.bg;

  volume = computed(() => this.audio.volume());
  isMuted = computed(() => this.audio.isMuted());
  private hasQuestion = signal(false);
  hasQuestion$ = this.hasQuestion;

  /* ===== INIT ===== */
  async init(model: LearnTubeModel, config?: LearnTubeInitConfig) {
    this.stop();

    const { audio, index = 0, addOutro = true, playAudio = true } = config || {};

    const set = model.slideSets?.[index] || model.slideSets?.[0];
    if (!set) return;

    this.bg.set(set.bg ?? null);

    this.config = set.slides.map((s) => {
      const cfg = TYPE_CONFIG[s.type] || TYPE_CONFIG['text'];
      return {
        type: s.type,
        path: cfg.path,
        duration: cfg.duration,
        data: s.data ?? {},
      };
    });

    if (addOutro) {
      const outro = TYPE_CONFIG['outro'] || TYPE_CONFIG['text'];
      this.config.push({
        type: 'outro',
        path: outro.path,
        duration: outro.duration,
        data: {},
      });
    }

    this.questions.set(set.quiz?.questions ?? []);

    if (!this.config.length) return;

    try {
      const reqs = this.config.map((s) =>
        firstValueFrom(this.http.get(s.path, { responseType: 'text' })),
      );

      const rawSvgs = await Promise.all(reqs);

      const processed = rawSvgs.map((svg, i) =>
        this.sanitizer.bypassSecurityTrustHtml(this.processSlide(svg, this.config[i])),
      );

      this.slides.set(processed);
      this.index.set(0);

      if (audio) {
        this.audio.load(audio);

        if (playAudio) {
          setTimeout(() => this.start(), 0);
        }
      }
      this.runTimer();
    } catch {}
  }

  private updateStage() {
    const i = this.index();
    const total = this.config.length;
    const questions = this.questions();

    const isLastSlide = i === total - 1;
    const hasQuestions = questions.length > 0;

    // question logic
    const isQuestionPresent = !!questions[i];
    this.hasQuestion.set(isQuestionPresent);

    // 🔥 QUIZ ENDED
    if (hasQuestions && i >= questions.length) {
      //this.setStage(LearnTubeStage.QuizEnded);
      return;
    }

    // 🔥 SLIDE ENDED (includes outro)
    // if (isLastSlide) {
    //   this.setStage(LearnTubeStage.SlideEnded);
    //   return;
    // }

    // 🔥 NORMAL SLIDE FLOW
    this.setStage(LearnTubeStage.Slide);
  }

  private setStage(stage: LearnTubeStage) {
    if (this.stage() === stage) return; // prevent duplicate emits
    this.stage.set(stage);
    this.stage$.next(stage); // 🔥 emit to outside
  }

  /* ===== AUDIO SYNC ===== */
  private syncWithAudio() {
    const loop = () => {
      const t = this.audio.currentTime();

      let acc = 0;
      for (let i = 0; i < this.config.length; i++) {
        acc += this.config[i].duration / 1000;

        if (t <= acc) {
          if (this.index() !== i) {
            this.index.set(i);
            this.updateStage();
          }
          break;
        }
      }

      requestAnimationFrame(loop);
    };

    loop();
  }

  /* ===== AUDIO CONTROL ===== */
  toggleAudio() {
    this.audioEnabled() ? this.disableAudio() : this.enableAudio();
  }

  async enableAudio() {
    this.audioEnabled.set(true);
    if (this.playing()) {
      try {
        await this.audio.play();
      } catch {}
    }
  }

  disableAudio() {
    this.audioEnabled.set(false);
    this.audio.pause();
    this.runTimer();
  }

  setVolume(v: number) {
    this.audio.setVolume(v);
  }

  toggleMute() {
    this.audio.toggleMute();
  }

  /* ===== QUIZ ===== */
  getQuestions() {
    return this.questions();
  }

  getCurrentQuestion() {
    return this.questions()[this.index()] || null;
  }

  /* ===== PLAY ===== */
  async start() {
    this.playing.set(true);

    try {
      await this.audio.play();
    } catch (e) {
      console.warn('Audio blocked (user interaction needed)', e);
    }
  }

  pause() {
    this.playing.set(false);
    this.audio.pause();
    clearTimeout(this.timer);
  }

  /* ===== TIMER ===== */
  private runTimer() {
    clearTimeout(this.timer);

    if (!this.playing()) return;

    const i = this.index();
    const duration = this.config[i]?.duration ?? DEF_SLIDE_BG_DURATION;

    this.timer = setTimeout(() => {
      const next = i + 1;

      if (next >= this.config.length) {
        this.setStage(LearnTubeStage.SlideEnded);
        this.updateStage();
        this.playing.set(false);
        return;
      }
      this.index.set(next);
      this.updateStage();
      this.runTimer();
    }, duration);
  }

  /* ===== SVG PROCESS ===== */
  private processSlide(svg: string, slide: SvgSlide): string {
    const doc = new DOMParser().parseFromString(svg, 'image/svg+xml');

    const d = slide.data || {};

    if (slide.type === 'bullet') {
      const flat: Record<string, string> = { title: d.title || '' };
      (d.points || []).forEach((p: string, i: number) => (flat[`point${i + 1}`] = p));
      this.bind(doc, flat);
    } else {
      this.bind(doc, d);
    }

    return new XMLSerializer().serializeToString(doc);
  }

  private bind(root: ParentNode, data: Record<string, string>) {
    Object.entries(data).forEach(([key, val]) => {
      const nodes = root.querySelectorAll(`[data-key="${key}"]`);
      nodes.forEach((el: any) => {
        const tag = el.tagName?.toLowerCase();
        if (tag === 'text') el.textContent = val;
        if (tag === 'image') {
          el.setAttribute('href', val);
          el.setAttributeNS('http://www.w3.org/1999/xlink', 'href', val);
        }
      });
    });
  }

  /* ===== STOP ===== */
  stop() {
    this.audio.pause();
    clearTimeout(this.timer);
  }
}
