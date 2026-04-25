import { Injectable, Injector, inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { map, shareReplay, interval, startWith, combineLatest } from 'rxjs';
import { Timestamp } from '@angular/fire/firestore';
import { GlobalMeetingsStoreService } from '../global-meetings-store/global-meetings-store.service';

@Injectable({ providedIn: 'root' })
export class GlobalMeetingsViewModel {
  private facade = inject(GlobalMeetingsStoreService);

  private toTs = (t: any): Timestamp => (t?.toDate ? t : new Timestamp(t.seconds, t.nanoseconds));

  private meetings$ = toObservable(this.facade.meetings, {
    injector: inject(Injector),
  }).pipe(startWith(this.facade.meetings()));

  private clock$ = interval(60 * 1000).pipe(startWith(0));

  readonly vm$ = combineLatest([this.meetings$, this.clock$]).pipe(
    map(([meetings]) => {
      const now = Date.now();

      const live: any[] = [];
      const upcoming: any[] = [];

      for (const m of meetings || []) {
        if (!m?.date || !m?.endAt) continue;

        const start = this.toTs(m.date).toDate().getTime();
        const end = this.toTs(m.endAt).toDate().getTime();

        if (start <= now && end >= now) {
          live.push(m);
        } else if (start > now) {
          upcoming.push(m);
        }
      }

      upcoming.sort(
        (a, b) => this.toTs(a.date).toDate().getTime() - this.toTs(b.date).toDate().getTime(),
      );

      return { live, upcoming };
    }),
    shareReplay({ bufferSize: 1, refCount: true }),
  );
}
