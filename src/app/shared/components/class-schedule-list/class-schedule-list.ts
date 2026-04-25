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
import { map } from 'rxjs';
import { Meeting } from '../../../models/meeting.model';
import { FireResponse } from '../../../core/services/fire/firestore-doc.service';
import { PLACEHOLDER__COVER_IMG } from '../../../core/constants/app.constants';
import { GlobalMeetingsService } from '../../../services/meetings/global-meetings/global-meetings.service';

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

  private meetApi = inject(GlobalMeetingsService);

  selectedTab = signal<'today' | 'upcoming'>('today');
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
      .getMeetingsByClassId$(this.classId)
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

  getBannerSrc(src?: string | null): string {
    return src || PLACEHOLDER__COVER_IMG;
  }

  onImgError(event: Event) {
    (event.target as HTMLImageElement).src = PLACEHOLDER__COVER_IMG;
  }

  getBannerAlt(item: any): string {
    return item?.label ? `${item.label} cover` : 'Class cover';
  }
}
