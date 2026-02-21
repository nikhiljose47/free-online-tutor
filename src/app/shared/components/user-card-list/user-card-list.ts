import { ChangeDetectionStrategy, Component, inject, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeachersService } from '../../../services/teachers/teachers.service';
import { PLACEHOLDER__COVER_IMG } from '../../../core/constants/app.constants';
import { UserModel } from '../../../models/fire/user.model';

interface Teacher {
  id: string;
  name: string;
  photo: string;
  bio: string;
  weekPerformance: 'excellent' | 'good' | 'improving';
  skills: string[];
  lastSession: string;
  rating: number;
}

@Component({
  selector: 'user-card-list',
  imports: [CommonModule],
  templateUrl: './user-card-list.html',
  styleUrl: './user-card-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserCardlist {
  @Input({ required: true }) classId!: string;

  private teachersApi = inject(TeachersService);

  readonly users = signal<UserModel[]>([]);

  // readonly teacherSignal = signal<Teacher[]>([
  //   {
  //     id: 't1',
  //     name: 'Dr. Ananya Rao',
  //     photo: 'assets/teachers/t1.jpg',
  //     bio: 'Organic chemistry mentor focused on deep clarity and exam confidence.',
  //     weekPerformance: 'excellent',
  //     skills: ['Creative', 'Informative', 'Helpful'],
  //     lastSession: '2 days ago',
  //     rating: 4.9,
  //   },
  //   {
  //     id: 't2',
  //     name: 'Rahul Menon',
  //     photo: 'assets/teachers/t2.jpg',
  //     bio: 'Mathematics expert simplifying complex problems with visual logic.',
  //     weekPerformance: 'good',
  //     skills: ['Clear', 'Patient', 'Strategic'],
  //     lastSession: 'Yesterday',
  //     rating: 4.7,
  //   },
  //   {
  //     id: 't3',
  //     name: 'Sneha Iyer',
  //     photo: 'assets/teachers/t3.jpg',
  //     bio: 'Physics teacher connecting theory with real-world intuition.',
  //     weekPerformance: 'improving',
  //     skills: ['Supportive', 'Practical', 'Engaging'],
  //     lastSession: '4 days ago',
  //     rating: 4.6,
  //   },
  // ]);

  ngOnInit(): void {
    this.teachersApi.getTeachers$().subscribe({
      next: (list) => {
        this.users.set(list ?? []);
      },
      error: () => {
        this.users.set([]);
      },
    });
  }

  getBannerSrc(src?: string | null): string {
    return src || PLACEHOLDER__COVER_IMG;
  }

  onImgError(event: Event) {
    (event.target as HTMLImageElement).src = PLACEHOLDER__COVER_IMG;
  }

  getBannerAlt(item: any): string {
    return item?.label ? `${item.label} teacher` : 'Class teacher';
  }
}
