import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RoadmapCacheService } from '../../services/cache/roadmap-cache.service';

export interface RoadmapCard {
  title: string;
  subtitle: string;
  image: string;
}

@Component({
  selector: 'free-online-tutor',
  imports: [CommonModule],
  templateUrl: './free-online-tutor.html',
  styleUrl: './free-online-tutor.scss',
})
export class FreeOnlineTutor {
  private cache = inject(RoadmapCacheService);
  liveClasses = signal([
    { title: 'Maths – Algebra', teacher: 'Anjali', time: 'Live Now' },
    { title: 'Physics – Motion', teacher: 'Rahul', time: 'Starting in 10m' },
    { title: 'Chemistry – Bonds', teacher: 'Vishal', time: '1:30 PM' },
    { title: 'Biology – Cells', teacher: 'Nisha', time: '3:00 PM' },
    { title: 'English – Grammar', teacher: 'Priya', time: '5:00 PM' },
  ]);

  // 12 sections for classes 1–12
  classSections = signal(
    Array.from({ length: 12 }, (_, i) => ({
      class: `Class ${i + 1}`,
      cards: this.cache.cards(),
    }))
  );
}
