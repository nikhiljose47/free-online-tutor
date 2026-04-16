import { Injectable, signal, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class AudioEngine {

  private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private audio?: HTMLAudioElement;

  isPlaying = signal(false);
  currentTime = signal(0);

  volume = signal(1);        // 0 → 1
  isMuted = signal(false);

  constructor() {
    if (!this.isBrowser) return;

    this.audio = new Audio();

    const savedVol = Number(localStorage.getItem('vol') ?? 1);
    const savedMute = localStorage.getItem('mute') === '1';

    this.volume.set(savedVol);
    this.isMuted.set(savedMute);

    this.audio.volume = savedMute ? 0 : savedVol;
    this.audio.muted = savedMute;

    this.audio.ontimeupdate = () => {
      this.currentTime.set(this.audio!.currentTime);
    };
  }


  load(src: string) {
    if (!this.audio) return;
    this.audio.src = src;
    this.audio.preload = 'auto';
  }

  async play() {
    if (!this.audio) return;
    await this.audio.play();
    this.isPlaying.set(true);
  }

  pause() {
    if (!this.audio) return;
    this.audio.pause();
    this.isPlaying.set(false);
  }

  setVolume(v: number) {
    if (!this.audio) return;
    const vol = Math.min(1, Math.max(0, v));
    this.volume.set(vol);
    this.isMuted.set(vol === 0);
    this.audio.volume = vol;
    this.audio.muted = vol === 0;
    localStorage.setItem('vol', String(vol));
    localStorage.setItem('mute', vol === 0 ? '1' : '0');
  }

  toggleMute() {
    if (!this.audio) return;
    const mute = !this.isMuted();
    this.isMuted.set(mute);
    this.audio.muted = mute;

    if (!mute) this.audio.volume = this.volume();

    localStorage.setItem('mute', mute ? '1' : '0');
  }
}