import {
  Component,
  ChangeDetectionStrategy,
  signal,
  computed,
  Input,
} from '@angular/core';
import { CommonModule } from '@angular/common';

interface ClassCard {
  id: string;
  title: string;
  teacher: string;
  image: string;
  joined: number;
  isLive: boolean;
  date: Date;
}

@Component({
  selector: 'class-schedule-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './class-schedule-list.html',
  styleUrl: './class-schedule-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClassScheduleListComponent {
    @Input({ required: true }) classId!: string;

 // private readonly classes = signal<ClassCard[]>([]);

  selectedTab = signal<'today' | 'upcoming'>('today');

  /* ===============================
     DUMMY DATA (API will replace)
  =============================== */

  private readonly classes = signal<ClassCard[]>([
    {
      id: '1',
      title: 'Algebra Mastery Session',
      teacher: 'Dr. Sharma',
      image: 'https://picsum.photos/400/200?1',
      joined: 124,
      isLive: true,
      date: new Date(),
    },
    {
      id: '2',
      title: 'Geometry Crash Course',
      teacher: 'Ms. Nandini',
      image: 'https://picsum.photos/400/200?2',
      joined: 89,
      isLive: false,
      date: new Date(),
    },
    {
      id: '3',
      title: 'Physics Motion Live',
      teacher: 'Mr. Arvind',
      image: 'https://picsum.photos/400/200?3',
      joined: 201,
      isLive: false,
      date: new Date(Date.now() + 86400000),
    },
  ]);


  readonly visibleList = computed(() => {
    const tab = this.selectedTab();
    const list = this.classes();

    if (tab === 'today') {
      return list.filter((c) => c.isLive);
    }

    return list.filter((c) => !c.isLive);
  });
}