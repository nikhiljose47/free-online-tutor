import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

interface TuitionAd {
  id: string;
  centerName: string;
  description: string;
  city: string;
  mode: 'online' | 'offline' | 'hybrid';
  subjects: string[];
  rating: number;
  reviewCount: number;
  isPremium: boolean;
  slug: string;
}

@Component({
  selector: 'tuition-marketplace',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './tuition-marketplace.html',
  styleUrl: './tuition-marketplace.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TuitionMarketplace {
private router = inject(Router)
private route = inject(ActivatedRoute);

  private readonly _ads = signal<TuitionAd[]>([
    {
      id: '1',
      centerName: 'Bright Future Academy',
      description: 'NEET & JEE focused coaching with structured mentorship.',
      city: 'Bangalore',
      mode: 'offline',
      subjects: ['Physics', 'Chemistry', 'Biology'],
      rating: 4.7,
      reviewCount: 124,
      isPremium: true,
      slug: 'bright-future-academy'
    },
    {
      id: '2',
      centerName: 'Maths Master Hub',
      description: 'Advanced mathematics training.',
      city: 'Hyderabad',
      mode: 'online',
      subjects: ['Mathematics'],
      rating: 4.5,
      reviewCount: 89,
      isPremium: false,
      slug: 'maths-master-hub'
    }
  ]);

  readonly cities = computed(() =>
    [...new Set(this._ads().map(a => a.city.toLowerCase()))]
  );

  readonly cityParam = toSignal(
    this.route.paramMap.pipe(
      map(p => p.get('city') ?? '')
    ),
    { initialValue: '' }
  );

  readonly ads = computed(() => {
    const city = this.cityParam();
    if (!city) return this._ads();
    return this._ads().filter(a =>
      a.city.toLowerCase() === city.toLowerCase()
    );
  });

  goToCity(city: string) {
    if (!city) {
      this.router.navigate(['/tuition-centers'], {
        replaceUrl: true
      });
      return;
    }

    this.router.navigate(
      ['/tuition-centers', city],
      { replaceUrl: true }
    );
  }
}