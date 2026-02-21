import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface CourseItem {
  id: string;
  title: string;
  route: string;
  theme: string;
}

@Component({
  selector: 'explore-courses-banner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './explore-courses-banner.html',
  styleUrl: './explore-courses-banner.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExploreCoursesBannerComponent {
  private router = inject(Router);

  readonly courses = signal<CourseItem[]>([
    { id: 'neet', title: 'NEET', route: '/courses/neet', theme: 'neet' },
    { id: 'coding', title: 'Coding', route: '/courses/coding', theme: 'coding' },
    { id: 'olympiad', title: 'Olympiad', route: '/courses/olympiad', theme: 'olympiad' },
    { id: 'english', title: 'English', route: '/courses/english', theme: 'english' },
    { id: 'jee', title: 'JEE', route: '/courses/jee', theme: 'jee' },
  ]);

  navigate(course: CourseItem) {
    this.router.navigateByUrl(course.route);
  }
}
