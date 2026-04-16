import { Component, computed, inject, afterNextRender, signal, effect, Input } from '@angular/core';
import { LearnTubeService, LearnTubeStage } from '../../services/learn-tube/learn-tube.service';
import { AUDIO_BG_PATH, TYPE_CONFIG } from '../../core/constants/app.constants';
import { CommonModule } from '@angular/common';
import { LearnTubeFetchService } from '../../services/learntube-fetch/learntube-fetch.service';
import { LearnTubeModel } from '../../models/learn-tube/learn-tube.model';
import { LearnTubePersistService } from '../../services/learn-tube-persist/learn-tube-persist.service';

@Component({
  selector: 'learn-tube',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './learn-tube.component.html',
  styleUrl: './learn-tube.component.scss',
})
export class LearnTubeComponent {
  @Input({ required: true }) flowNext!: (
    step?: 'slides' | 'game' | 'dashboard' | 'ai-learn',
  ) => void;
  @Input() flowRestart!: () => void;

  service = inject(LearnTubeService);
  fetchService = inject(LearnTubeFetchService);
  persistService = inject(LearnTubePersistService);

  isLoading = signal(true);
  hasError = signal(false);

  safeContent = this.service.currentSlide;
  volume = this.service.volume;
  isMuted = this.service.isMuted;
  isPlaying = this.service['playing'];
  isAudioOn = this.service.isAudioOn;

  constructor() {
    afterNextRender(() => this.init());

    this.service.stageChanges$.subscribe((stage) => {
      this.persistService.set(stage);

      console.log('Stage changed to:', stage);
      // 👉 MAIN LOGIC
      if (stage === LearnTubeStage.SlideEnded) {
        console.log('Slide ended, navigating to dashboard');
        this.flowNext('dashboard');
      }
    });
  }

  init() {
    this.isLoading.set(true);
    this.hasError.set(false);

    this.fetchService.getById('mob-flutter-adv').subscribe({
      next: (res: LearnTubeModel | null) => {
        if (!res) {
          this.fail();
          return;
        }

        this.service.init(res, {
          audio: AUDIO_BG_PATH,
          index: 1,
        });

        this.isLoading.set(false);
      },
      error: () => this.fail(),
    });
  }

  setVolume(v: number) {
    this.service.setVolume(v);
    document.documentElement.style.setProperty('--val', `${v * 100}%`);
  }

  toggleMute() {
    this.service.toggleMute();
  }

  private fail() {
    this.hasError.set(true);
    this.isLoading.set(false);
  }

  togglePlay() {
    if (this.isLoading()) return;
    this.isPlaying() ? this.service.pause() : this.service.start();
  }

  toggleAudio() {
    this.service.toggleAudio();
  }

  ngOnDestroy() {
    this.service.stop();
  }
}
