import {
  Component,
  ChangeDetectionStrategy,
  signal,
  computed,
  Input,
  OnInit,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MeetingsService } from '../../../services/meetings/meetings.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { Meeting } from '../../../models/meeting.model';
import { FireResponse } from '../../../core/services/fire/firestore-doc.service';

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
export class ClassScheduleListComponent implements OnInit {
  @Input({ required: true }) classId!: string;

  private meetApi = inject(MeetingsService);

  // private readonly classes = signal<ClassCard[]>([]);

  selectedTab = signal<'today' | 'upcoming'>('today');

  /* ===============================
     DUMMY DATA (API will replace)
  =============================== */

  // private readonly classes = signal<ClassCard[]>([
  //   {
  //     id: '1',
  //     title: 'Algebra Mastery Session',
  //     teacher: 'Dr. Sharma',
  //     image: 'https://picsum.photos/400/200?1',
  //     joined: 124,
  //     isLive: true,
  //     date: new Date(),
  //   },
  //   {
  //     id: '2',
  //     title: 'Geometry Crash Course',
  //     teacher: 'Ms. Nandini',
  //     image: 'https://picsum.photos/400/200?2',
  //     joined: 89,
  //     isLive: false,
  //     date: new Date(),
  //   },
  //   {
  //     id: '3',
  //     title: 'Physics Motion Live',
  //     teacher: 'Mr. Arvind',
  //     image: 'https://picsum.photos/400/200?3',
  //     joined: 201,
  //     isLive: false,
  //     date: new Date(Date.now() + 86400000),
  //   },
  // ]);

  private readonly classes = signal<ClassCard[]>([]);

  readonly visibleList = computed(() => {
    const tab = this.selectedTab();
    const list = this.classes();

    if (tab === 'today') {
      return list.filter((c) => c.isLive);
    }

    return list.filter((c) => !c.isLive);
  });

  ngOnInit(): void {
    if (!this.classId) return;

    this.meetApi
      .getLiveMeetingsByClassId(this.classId)
      .pipe(
        map((res: FireResponse<Meeting[]>) => {
          if (!res?.ok) return [];

          const meetings = Array.isArray(res.data) ? (res.data as Meeting[]) : [];
          const now = Date.now();

          return meetings.map((m) => {
            const start = m.date?.toDate?.()?.getTime?.() ?? 0;
            const end = m.endAt?.toDate?.()?.getTime?.() ?? 0;

            return {
              id: m.id.substring(m.id.length - 3),
              title: m.chapterCode || 'Class Session',
              teacher: m.teacherName ?? 'Nikhil',
              image: m.imageSrc || 'https://picsum.photos/400/200',
              joined: m.attendance?.length ?? 0,
              isLive: now >= start && now <= end,
              date: m.date?.toDate?.() ?? new Date(),
            } as ClassCard;
          });
        }),
      )
      .subscribe((data) => this.classes.set(data));
  }
}
