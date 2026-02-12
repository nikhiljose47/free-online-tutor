import {
  Component,
  OnDestroy,
  OnInit,
  inject,
  signal,
  ChangeDetectionStrategy,
  EventEmitter,
  Output,
  effect,
} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

import { MeetingsService } from '../../domain/meetings/meetings.service';
import { UiStateUtil } from '../../state/ui-state.utils';
import { SyllabusStore } from '../../state/syllabus.store';
import { Meeting } from '../../models/meeting.model';

import { combineLatest, map, timer } from 'rxjs';
import { PLACEHOLDER__COVER_IMG } from '../../core/constants/app.constants';

@Component({
  selector: 'class-stream-sidebar',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './class-stream-sidebar.html',
  styleUrl: './class-stream-sidebar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClassStreamSidebar implements OnInit, OnDestroy {
  /* ================= OUTPUT ================= */
  @Output() collapsedChange = new EventEmitter<boolean>();

  /* ================= SERVICES ================= */
  private meetApi = inject(MeetingsService);
  private router = inject(Router);
  private uiUtil = inject(UiStateUtil);
  private syllabusStore = inject(SyllabusStore);

  /* ================= UI SIGNALS (FINAL ONLY) ================= */
  readonly live = signal<any[]>([]);
  readonly upcoming = signal<any[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly collapsed = signal(false);

  /* ================= CLOCK ================= */
  private clockId!: any;

  /* ============================================================
     🔹 PURE RXJS DATA PIPELINE
     ============================================================ */

  private readonly merged$ = combineLatest([
    this.meetApi.getLiveMeetings(),
    this.syllabusStore.getUnifiedDataFromIndex$(),
    timer(0, 30_000), // clock refresh
  ]).pipe(
    map(([meetRes, feed, _]) => {
      if (!meetRes.ok) {
        throw new Error(meetRes.message ?? 'Meetings load failed');
      }

      const meetings: Meeting[] = Array.isArray(meetRes.data) ? (meetRes.data as Meeting[]) : [];

      const mapById = new Map<string, any>();
      feed.forEach((f: any) => mapById.set(f.id, f));

      const now = new Date();

      const attachMeta = (m: Meeting) => {
        const meta = mapById.get(String(m.classId));
        return {
          ...m,
          image: meta?.meta?.image ?? '',
          title: meta?.label ?? meta?.title ?? '',
        };
      };

      const live = meetings
        .filter((m) => {
          const start = m.date?.toDate?.();
          const end = m.endAt?.toDate?.();
          return start && end && start <= now && end >= now;
        })
        .map(attachMeta);

      const upcoming = meetings
        .filter((m) => {
          const start = m.date?.toDate?.();
          return start && start > now;
        })
        .sort((a, b) => a.date.toDate().getTime() - b.date.toDate().getTime())
        .map(attachMeta);

      const finalResult = { live, upcoming };

      return finalResult;
    }),
  );

  /* ============================================================
     🔹 SIGNAL BRIDGE (ONLY UI STATE)
     ============================================================ */

  private readonly mergedSignal = toSignal(this.merged$, {
    initialValue: { live: [], upcoming: [] },
  });

  private readonly mergedEffect = effect(() => {
    const data = this.mergedSignal();

    this.live.set(data.live);
    this.upcoming.set(data.upcoming);
    this.loading.set(false);
  });

  constructor() {}

  /* ================= LIFECYCLE ================= */

  ngOnInit(): void {
    this.clockId = setInterval(() => {}, 30_000); // keep lifecycle parity
  }

  getBannerSrc(src?: string | null): string {
    return src || PLACEHOLDER__COVER_IMG;
  }

  onImgError(event: Event) {
    (event.target as HTMLImageElement).src = PLACEHOLDER__COVER_IMG;
  }

  getBannerAlt(cls: any): string {
    return cls?.className ? `${cls.className} cover` : 'Class cover';
  }

  ngOnDestroy(): void {
    clearInterval(this.clockId);
  }

  /* ================= UI ACTIONS ================= */

  open(item: any) {
    this.uiUtil.set(item.id, item);
    this.router.navigate(['/join-tution', item.id]);
  }

  toggleSidebar() {
    this.collapsed.update((v) => !v);
    this.collapsedChange.emit(this.collapsed());
  }
}
