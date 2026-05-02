import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, signal, effect } from '@angular/core';

@Component({
  selector: 'announcement-banner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './announcement-banner.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnnouncementBannerComponent {
  private storageKey = 'announcements_cache_v1';

  announcements = signal<string[]>(this.loadInitial());

  count = computed(() => this.announcements().length);

  hasOne = computed(() => this.count() === 1);
  hasTwo = computed(() => this.count() === 2);

  constructor() {
    effect(() => {
      const data = this.announcements();
     // localStorage.setItem(this.storageKey, JSON.stringify(data));
    });
  }

  update(list: string[]) {
    if (!list?.length) return;
    this.announcements.set(list.slice(0, 2));
  }

  private loadInitial(): string[] {
    try {
      // const cached = localStorage.getItem(this.storageKey);
      // if (cached) return JSON.parse(cached);

      return ['New AI learning path available', 'Practice quizzes upgraded with rewards'];
    } catch {
      return ['Welcome back'];
    }
  }
}
