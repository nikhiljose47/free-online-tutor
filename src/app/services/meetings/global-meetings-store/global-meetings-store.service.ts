import { Injectable, signal, inject, PLATFORM_ID } from '@angular/core';
import { interval, fromEvent, merge } from 'rxjs';
import { IndexedDbService } from '../../../core/services/cache/db/indexed-db.service';
import { Timestamp } from '@angular/fire/firestore';
import { isPlatformBrowser } from '@angular/common';
import { GLOBAL_MEETINGS } from '../../../core/constants/app.constants';
import { MeetingsService } from '../meetings.service';

type Meeting = {
  id: string;
  createdAt: Timestamp;
  date: Timestamp;
  endAt: Timestamp;
};

@Injectable({ providedIn: 'root' })
export class GlobalMeetingsStoreService {
  private idb = inject(IndexedDbService);
  private query = inject(MeetingsService);
  private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  meetings = signal<Meeting[]>([]);
  loading = signal<boolean>(false);

  private lastSync = signal<Timestamp | null>(null);

  private readonly STORE = 'session_timelines';
  private readonly META_STORE = 'app_context_map';
  private readonly SYNC_KEY = 'global_meetings_last_sync';

  constructor() {
    this.init();
  }

  init() {
    this.loadCache();

    if (!this.isBrowser) return;

    merge(interval(5 * 60 * 1000), fromEvent(window, 'focus')).subscribe(() => this.sync());
  }

  private async loadCache() {
    const cached = await this.idb.getAll<Meeting>(this.STORE);
    const clean = (cached || []).filter((m: any) => m?.createdAt && m?.date);

    const syncMeta = await this.idb.get<any>(this.META_STORE, this.SYNC_KEY);

    if (clean.length) this.meetings.set(clean);

    if (syncMeta?.ts) {
      const ts = syncMeta.ts;
      const fixed = ts?.toDate ? ts : new Timestamp(ts.seconds, ts.nanoseconds);
      this.lastSync.set(fixed);
    }

    this.sync();
  }

  private toTs(t: any): Timestamp {
    return t?.toDate ? t : new Timestamp(t.seconds, t.nanoseconds);
  }

  private shouldSync(): boolean {
    const last = this.lastSync();
    if (!last) return true;

    const lastMs = this.toTs(last).toDate().getTime();
    return Date.now() - lastMs > 5 * 60 * 1000;
  }

  private sync() {
    if (!this.shouldSync()) return;

    this.loading.set(true);

    this.query.getActiveMeetingsOnce<Meeting>(GLOBAL_MEETINGS, this.lastSync()).subscribe((res) => {
      if (!res.ok || !res.data) {
        this.loading.set(false);
        return;
      }

      const incoming = res.data as Meeting[];

      if (!incoming.length) {
        this.updateSyncTime();
        this.loading.set(false);
        return;
      }

      const merged = this.mergeUnique(this.meetings(), incoming);

      this.meetings.set(merged);
      this.persist(merged);

      this.updateSyncTime();
      this.loading.set(false);
    });
  }

  private updateSyncTime() {
    const now = Timestamp.fromDate(new Date());
    this.lastSync.set(now);

    this.idb.set(this.META_STORE, {
      id: this.SYNC_KEY,
      ts: now,
    });
  }

  private async persist(list: Meeting[]) {
    await this.idb.bulkSet(this.STORE, list);
  }

  private mergeUnique(oldList: Meeting[], newList: Meeting[]) {
    const map = new Map(oldList.map((m) => [m.id, m]));
    newList.forEach((m) => map.set(m.id, m));

    return Array.from(map.values()).sort(
      (a, b) =>
        this.toTs(b.createdAt).toDate().getTime() - this.toTs(a.createdAt).toDate().getTime(),
    );
  }

  addLocal(meeting: Meeting) {
    this.meetings.update((m) => [meeting, ...m]);
    this.persist(this.meetings());
  }
}
