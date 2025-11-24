import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';

interface RoadmapCard {
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
      cards: this.generateCards(),
    }))
  );

  private generateCards(): RoadmapCard[] {
    return [
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
    ];
  }
}
