import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, PLATFORM_ID, signal } from '@angular/core';
import { TeachersService } from '../../services/teachers/teachers.service';
import { UserModel } from '../../models/fire/user.model';
import { PLACEHOLDER__COVER_IMG } from '../../core/constants/app.constants';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  standalone: true,
  selector: 'teachers',
  imports: [CommonModule],
  templateUrl: './teachers.html',
  styleUrl: './teachers.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeachersPage {
  private teachersApi = inject(TeachersService);
  private platformId = inject(PLATFORM_ID);

  /* ================= UI STATE ================= */
  readonly teachers = signal<UserModel[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  constructor(private router: Router) {
    if (isPlatformBrowser(this.platformId)) {
      this.router.events
        .pipe(filter((e) => e instanceof NavigationEnd))
        .subscribe(() => document.querySelector('.content')?.scrollTo(0, 0));
    }
  }

  /* ================= INIT ================= */
  ngOnInit(): void {
    this.teachersApi.getTeachers$().subscribe({
      next: (list) => {
        this.teachers.set(list ?? []);
        this.loading.set(false);
        this.error.set(null);
      },
      error: () => {
        this.loading.set(false);
        this.error.set('Unable to load teachers');
        this.teachers.set([]);
      },
    });
  }

  getBannerSrc(src?: string | null): string {
    return src || './assets/abbu.jpg';
  }

  onImgError(event: Event) {
    (event.target as HTMLImageElement).src = './assets/abbu.jpg';
  }

  getBannerAlt(data: any): string {
    return data ? `${data} teacher` : 'teacher';
  }

  // teachers = signal<Teacher[]>([
  //   {
  //     id: 't1',
  //     name: 'Nikhil Jose',
  //     qualification: 'M.Tech,',
  //     domains: ['Algebra', 'Trigonometry', 'Olympiad'],
  //     note: '10+ years experience in CBSE coaching',
  //     contact: 'nikhiljose47@freetutor.in',
  //     imageUrl: 'assets/abbu.jpg',
  //   },
  //   {
  //     id: 't2',
  //     name: 'Aravind J Nair',
  //     qualification: 'M.Tech,',
  //     domains: ['Algebra', 'Trigonometry', 'Olympiad'],
  //     note: '10+ years experience in CBSE coaching',
  //     contact: 'nikhiljose47@freetutor.in',
  //     imageUrl: 'assets/abbu.jpg',
  //   },
  //   {
  //     id: 't3',
  //     name: 'Asha Eapen',
  //     qualification: 'M.A English',
  //     domains: ['Grammar', 'Literature'],
  //     note: 'Focus on communication & confidence',
  //     contact: 'sneha@freetutor.in',
  //     imageUrl: 'assets/placeholder.webp',
  //   },
  //   {
  //     id: 't4',
  //     name: 'Akshay Kumar',
  //     qualification: 'M.Tech,',
  //     domains: ['Algebra', 'Trigonometry', 'Olympiad'],
  //     note: '10+ years experience in CBSE coaching',
  //     contact: 'nikhiljose47@freetutor.in',
  //     imageUrl: 'assets/abbu.jpg',
  //   },
  //   {
  //     id: 't5',
  //     name: 'Arjun Kumar VS',
  //     qualification: 'B.Tech, IIT',
  //     domains: ['Physics', 'Problem Solving'],
  //     note: 'Concept-first teaching style',
  //     contact: 'arjun@freetutor.in',
  //     imageUrl: 'assets/placeholder.webp',
  //   },
  //   {
  //     id: 't6',
  //     name: 'Susan Jose',
  //     qualification: 'M.A English',
  //     domains: ['Grammar', 'Literature'],
  //     note: 'Focus on communication & confidence',
  //     contact: 'susan@freetutor.in',
  //     imageUrl: 'assets/placeholder.webp',
  //   },
  // ]);
}
