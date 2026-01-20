import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class RoadmapCacheService {
  readonly cards = signal<any[]>([
    {
      title: 'Roadmap',
      subtitle: 'Complete study path',
      image: '/assets/roadmap.jpg',
    },
    {
      title: 'Famous Problem',
      subtitle: 'Solve this challenge',
      image: '/assets/fam-problem.jpg',
    },
    {
      title: 'Quote of the Day',
      subtitle: 'Motivation boost',
      image: '/assets/class5-quote.png',
    },
    {
      title: 'Exam Prep',
      subtitle: 'Important tips',
      image: '/assets/exam-time.jpg',
    },
  ]);
}
