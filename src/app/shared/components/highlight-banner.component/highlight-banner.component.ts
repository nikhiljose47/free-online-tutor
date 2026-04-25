import { Component, Input, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

type BannerItem = {
  value: string;
  label: string;
};

//Usage
// <highlight-banner [title]="'Learning impact across regions'" [image]="'assets/banner-icon.webp'" [items]="stats()" />
@Component({
  selector: 'highlight-banner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './highlight-banner.component.html',
  styleUrls: ['./highlight-banner.component.scss'],
})
export class HighlightBannerComponent {
  @Input() variant: 'centered' | 'left' | 'compact' = 'centered';

  private _title = signal<string>('');
  private _image = signal<string>('');
  private _items = signal<BannerItem[] | null>(null);

  @Input() set title(v: string) {
    this._title.set(v || '');
  }

  @Input() set image(v: string) {
    this._image.set(v || '');
  }

  @Input() set items(v: BannerItem[] | null) {
    this._items.set(v);
  }

  titleText = computed(() => this._title() || 'Trusted learning journey across India');

  imageSrc = computed(() => this._image() || 'assets/up-wooden-bg.webp');

  itemsList = computed(() => {
    return (
      this._items() ?? [
        { value: '10K+', label: 'Students' },
        { value: '120+', label: 'Sessions' },
        { value: '25+', label: 'Teachers' },
      ]
    );
  });
}
