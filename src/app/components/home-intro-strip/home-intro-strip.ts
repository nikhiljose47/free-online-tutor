import {
  ChangeDetectionStrategy,
  Component,
  Input,
  signal,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';

export interface HomeIntroStripItem {
  id: string;
  type: 'video' | 'card';
  title: string;
  subtitle?: string;
  src?: string;          // video src
  ctaLabel?: string;
}

@Component({
  selector: 'home-intro-strip',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home-intro-strip.html',
  styleUrls: ['./home-intro-strip.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeIntroStrip {
  private readonly _items = signal<HomeIntroStripItem[]>([
    {
      id: 'v1',
      type: 'video',
      title: 'Live Classes',
      subtitle: 'Concepts in motion',
      src: 'assets/videos/intro.mp4',
    },
    {
      id: 'v2',
      type: 'video',
      title: 'Daily Practice',
      subtitle: 'Short & focused',
      src: 'assets/videos/demo.mp4',
    },
    {
      id: 'c1',
      type: 'card',
      title: 'Smart Tuition',
      subtitle: 'Notes • Tests • Doubts',
      ctaLabel: 'Explore',
    },
  ]);

  readonly items = this._items.asReadonly();

  readonly videoItems = computed(() =>
    this._items().filter(i => i.type === 'video')
  );

  readonly cardItems = computed(() =>
    this._items().filter(i => i.type === 'card')
  );

  trackById = (_: number, item: HomeIntroStripItem) => item.id;
}
