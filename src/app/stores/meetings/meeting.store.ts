import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LiveMeetingStore {
  live = signal<any[]>([]);
  changed = signal(false);

  update(arr: any[]) {
    if (!arr) return;
    const prev = this.live().length;
    if (arr.length !== prev) this.changed.set(true);

    this.live.set(arr);
  }

  consumeChange() {
    this.changed.set(false);
  }
}
