import { Component, computed, inject, afterNextRender, signal, effect, Input } from '@angular/core';
import { LearnTubeService } from '../../services/learn-tube/learn-tube.service';
import { AUDIO_BG_PATH, TYPE_CONFIG } from '../../core/constants/app.constants';
import { CommonModule } from '@angular/common';
import { LearnTubeFetchService } from '../../services/learntube-fetch/learntube-fetch.service';
import { LearnTubeModel } from '../../models/learn-tube/learn-tube.model';
import { filter, take } from 'rxjs';
import { UserPointsService } from '../../services/user/user-points/user-points.service';

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
  @Input() flowRedoSlides!: () => void;

  private pointsService = inject(UserPointsService);
  service = inject(LearnTubeService);
  fetchService = inject(LearnTubeFetchService);

  isLoading = signal(true);
  hasError = signal(false);

  safeContent = this.service.currentSlide;
  volume = this.service.volume;
  isMuted = this.service.isMuted;
  isPlaying = this.service['playing'];
  isAudioOn = this.service.isAudioOn;

  constructor() {
    afterNextRender(() => this.init());
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

    this.service.playbackCompleted$.pipe(filter(Boolean), take(1)).subscribe(() => {
      this.pointsService
        .addPoints(2, 'slides') // 👈 full question as key
        .subscribe();
      this.flowNext('dashboard');
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
