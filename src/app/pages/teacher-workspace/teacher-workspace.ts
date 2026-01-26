import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  signal,
  computed,
} from '@angular/core';

interface TeacherStats {
  total: number;
  completed: number;
  upcoming: number;
  missed: number;
}

interface UpcomingClass {
  name: string;
  time: string;
  topic: string;
}

interface CompletedClass {
  date: string;
  topic: string;
  attended: number;
  total: number;
  agendaMet: boolean;
}

@Component({
  selector: 'teacher-workspace',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './teacher-workspace.html',
  styleUrls: ['./teacher-workspace.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeacherWorkspace {
  /* ===============================
     STATS
  =============================== */
  readonly stats = signal<TeacherStats>({
    total: 42,
    completed: 30,
    upcoming: 8,
    missed: 4,
  });

  /* ===============================
     UPCOMING CLASSES
  =============================== */
  readonly upcomingClasses = signal<UpcomingClass[]>([
    {
      name: 'Class 6 - Maths',
      time: 'Tomorrow 10:00 AM',
      topic: 'Algebra Basics',
    },
    {
      name: 'Class 8 - Science',
      time: 'Today 4:00 PM',
      topic: 'Force & Motion',
    },
  ]);

  /* ===============================
     COMPLETED CLASSES
  =============================== */
  readonly completedClasses = signal<CompletedClass[]>([
    {
      date: '12 Jan',
      topic: 'Linear Equations',
      attended: 28,
      total: 32,
      agendaMet: true,
    },
    {
      date: '10 Jan',
      topic: 'Polynomials',
      attended: 24,
      total: 30,
      agendaMet: false,
    },
  ]);

  /* ===============================
     FEEDBACK
  =============================== */
  readonly feedback = signal<string[]>([
    'Explained concepts very clearly.',
    'Good pace and interaction.',
    'More examples would help.',
  ]);

  /* ===============================
     ADMIN MESSAGES
  =============================== */
  readonly messages = signal<string[]>([
    'Please upload attendance reports on time.',
    'New teaching guidelines available.',
  ]);

  /* ===============================
     DERIVED: STREAK %
  =============================== */
  readonly streakPercent = computed(() => {
    const s = this.stats();
    if (!s.total) return 0;
    return Math.round((s.completed / s.total) * 100);
  });

  /* ===============================
     ACTION PLACEHOLDERS
  =============================== */
  openNotifications() {
    // open notification drawer later
  }

  takeWeeklyCheck() {
    // route to weekly self-check
  }

  viewClassDetails(cls: CompletedClass) {
    // open modal / route
  }
}
