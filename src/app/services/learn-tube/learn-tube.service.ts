import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, ReplaySubject } from 'rxjs';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AudioEngine } from '../../core/services/audio/audio.engine';
import { LearnTubeModel } from '../../models/learn-tube/learn-tube.model';
import { DEF_SLIDE_BG_DURATION, TYPE_CONFIG } from '../../core/constants/app.constants';

type SvgSlide = {
  type: string;
  path: string;
  duration: number;
  data: any;
};

export interface LearnTubeInitConfig {
  audio?: string;
  index?: number;
  addOutro?: boolean;
  playAudio?: boolean;
}

@Injectable({ providedIn: 'root' })
export class LearnTubeService {
  private http = inject(HttpClient);
  private sanitizer = inject(DomSanitizer);
  private audio = inject(AudioEngine);

  private slides = signal<SafeHtml[]>([]);
  private config: SvgSlide[] = [];

  private index = signal(0);
  private playing = signal(false);
  private audioEnabled = signal(true);

  private timer: any;

  private completed$ = new ReplaySubject<boolean>(1);
  playbackCompleted$ = this.completed$.asObservable();

  currentSlide = computed(() => this.slides()[this.index()] || '');
  currentIndex = this.index;

  isPlaying = this.playing;
  isAudioOn = this.audioEnabled;

  volume = computed(() => this.audio.volume());
  isMuted = computed(() => this.audio.isMuted());

  async init(model: LearnTubeModel, cfg?: LearnTubeInitConfig) {
    this.stop();

    this.completed$.next(false); // reset completion state
    this.index.set(0);
    this.playing.set(false);

    const { audio, index = 0, addOutro = true, playAudio = true } = cfg || {};
    const set = model.slideSets?.[index] || model.slideSets?.[0];
    if (!set) return;

    this.config = set.slides.map((s) => {
      const c = TYPE_CONFIG[s.type] || TYPE_CONFIG['text'];
      return { type: s.type, path: c.path, duration: c.duration, data: s.data ?? {} };
    });

    if (addOutro) {
      const outro = TYPE_CONFIG['outro'] || TYPE_CONFIG['text'];
      this.config.push({ type: 'outro', path: outro.path, duration: outro.duration, data: {} });
    }

    if (!this.config.length) return;

    try {
      const raw = await Promise.all(
        this.config.map((s) => firstValueFrom(this.http.get(s.path, { responseType: 'text' }))),
      );

      const processed = raw.map((svg, i) =>
        this.sanitizer.bypassSecurityTrustHtml(this.process(svg, this.config[i])),
      );

      this.slides.set(processed);

      if (audio) {
        this.audio.load(audio);
        if (playAudio) setTimeout(() => this.start(), 0);
      }
    } catch {}
  }

  async start() {
    this.playing.set(true);
    try {
      await this.audio.play();
    } catch {}
    this.runTimer();
  }

  pause() {
    this.playing.set(false);
    this.audio.pause();
    clearTimeout(this.timer);
  }

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
  }

  setVolume(v: number) {
    this.audio.setVolume(v);
  }

  toggleMute() {
    this.audio.toggleMute();
  }

  private runTimer() {
    clearTimeout(this.timer);
    if (!this.playing()) return;

    const i = this.index();
    const duration = this.config[i]?.duration ?? DEF_SLIDE_BG_DURATION;

    this.timer = setTimeout(() => {
      const next = i + 1;

      if (next >= this.config.length) {
        this.playing.set(false);
        this.completed$.next(true);
        return;
      }

      this.index.set(next);
      this.runTimer();
    }, duration);
  }

  private process(svg: string, slide: SvgSlide): string {
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
    Object.entries(data).forEach(([k, v]) => {
      const nodes = root.querySelectorAll(`[data-key="${k}"]`);
      nodes.forEach((el: any) => {
        const tag = el.tagName?.toLowerCase();
        if (tag === 'text') el.textContent = v;
        if (tag === 'image') {
          el.setAttribute('href', v);
          el.setAttributeNS('http://www.w3.org/1999/xlink', 'href', v);
        }
      });
    });
  }

  stop() {
    this.audio.pause();
    clearTimeout(this.timer);
    this.playing.set(false);
  }
}
