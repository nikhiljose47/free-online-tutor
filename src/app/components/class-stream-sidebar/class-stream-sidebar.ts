import {
  Component,
  OnDestroy,
  OnInit,
  AfterViewInit,
  inject,
  signal,
  ChangeDetectionStrategy,
  EventEmitter,
  Output,
  effect,
  EnvironmentInjector,
  runInInjectionContext,
} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

import { UiStateUtil } from '../../shared/state/ui-state.utils';
import { Meeting } from '../../models/meeting.model';

import { combineLatest, map, merge, shareReplay, switchMap, timer } from 'rxjs';
import { PLACEHOLDER__COVER_IMG } from '../../core/constants/app.constants';
import { MeetingsService } from '../../services/meetings/meetings.service';
import { CatalogLookupService } from '../../domain/syllabus-index/catalog-lookup.service';
import { MeetingStatusStore } from '../../shared/state/meeting-status.store';

@Component({
  selector: 'class-stream-sidebar',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './class-stream-sidebar.html',
  styleUrl: './class-stream-sidebar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClassStreamSidebar implements OnInit, OnDestroy, AfterViewInit {
  /* ================= OUTPUT ================= */
  @Output() collapsedChange = new EventEmitter<boolean>();

  /* ================= SERVICES ================= */
  private meetApi = inject(MeetingsService);
  private router = inject(Router);
  private uiUtil = inject(UiStateUtil);
  private catalogLookupApi = inject(CatalogLookupService);
  private statusStore = inject(MeetingStatusStore);
  private envInjector = inject(EnvironmentInjector);

  /* ================= UI SIGNALS ================= */
  readonly live = signal<any[]>([]);
  readonly upcoming = signal<any[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly collapsed = signal(false);

  private clockId!: any;
  private mergedSignal!: any;

  /* ================= STREAMS ================= */
  private readonly merged$ = this.catalogLookupApi.getAllReady$().pipe(
    switchMap((feed) =>
      merge(this.meetApi.getLiveMeetingsInitial(), this.meetApi.getLiveMeetings()).pipe(
        shareReplay(1),
        map((meetRes) => {
          if (!meetRes.ok) {
            throw new Error(meetRes.message ?? 'Meetings load failed');
          }

          const meetings: Meeting[] = Array.isArray(meetRes.data)
            ? (meetRes.data as Meeting[])
            : [];

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

          meetings.forEach((m) => {
            const start = m.date?.toDate?.();
            const end = m.endAt?.toDate?.();
            if (!start || !end) return;

            if (start <= now && end >= now) this.statusStore.setState(m.id, 'live');
            else if (start > now) this.statusStore.setState(m.id, 'upcoming');
            else this.statusStore.setState(m.id, 'ended');
          });

          return { live, upcoming };
        }),
      ),
    ),
  );
  /* ================= LIFECYCLE ================= */

  ngOnInit(): void {
    this.clockId = setInterval(() => {}, 30_000);
  }

  ngAfterViewInit(): void {
    runInInjectionContext(this.envInjector, () => {
      this.mergedSignal = toSignal(this.merged$, {
        initialValue: { live: [], upcoming: [] },
      });

      effect(() => {
        const data = this.mergedSignal();
        this.live.set(data.live);
        this.upcoming.set(data.upcoming);
        this.loading.set(false);
      });
    });
  }

  ngOnDestroy(): void {
    clearInterval(this.clockId);
  }

  /* ================= UI HELPERS ================= */

  getBannerSrc(src?: string | null): string {
    return src || PLACEHOLDER__COVER_IMG;
  }

  onImgError(event: Event) {
    (event.target as HTMLImageElement).src = PLACEHOLDER__COVER_IMG;
  }

  getBannerAlt(cls: any): string {
    return cls?.className ? `${cls.className} cover` : 'Class cover';
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
