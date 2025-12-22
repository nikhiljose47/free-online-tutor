import {
  Component,
  OnDestroy,
  inject,
  signal,
  computed,
  ChangeDetectionStrategy,
  EventEmitter,
  Output,
} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { MeetingsService } from '../../domain/meetings/meetings.service';
import { UiStateUtil } from '../../utils/ui-state.utils';

@Component({
  selector: 'class-stream-sidebar',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './class-stream-sidebar.html',
  styleUrl: './class-stream-sidebar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClassStreamSidebar implements OnDestroy {
  @Output() collapsedChange = new EventEmitter<boolean>();

  private meetApi = inject(MeetingsService);
  private router = inject(Router);
  private uiUtil = inject(UiStateUtil);

  allMeetings = signal<any[]>([]);
  now = signal(new Date());
  error = signal<string | null>(null);
  loading = signal(true);
  collapsed = signal(false);

  private clockId!: any;
  
  constructor() {
    this.meetApi.getLiveMeetings().subscribe((res) => {
      this.loading.set(false);

      if (!res.ok) {
        this.error.set(res.message ?? 'Unable to load meetings');
        this.allMeetings.set([]);
        return;
      }

      this.error.set(null);
      this.allMeetings.set(res.data ?? []);
    });

    this.clockId = setInterval(() => {
      this.now.set(new Date());
    }, 30_000);
  }

  live = computed(() => {
    const n = this.now();

    return this.allMeetings().filter((m) => {
      const start = m.date?.toDate?.();
      const end = m.endAt?.toDate?.();

      if (!start || !end) return false;

      return start <= n && end >= n;
    });
  });

  upcoming = computed(() => {
    const n = this.now();

    return this.allMeetings()
      .filter((m) => {
        const start = m.date?.toDate?.();
        return start && start > n;
      })
      .sort((a, b) => a.date.toDate().getTime() - b.date.toDate().getTime());
  });

  open(item: any) {
    this.uiUtil.set(item.id, item);
    this.router.navigate(['/join-tution', item.id]);
  }

  toggleSidebar() {
    this.collapsed.update((v) => !v);
    this.collapsedChange.emit(this.collapsed());
  }

  ngOnDestroy() {
    clearInterval(this.clockId);
  }
}
