import { Injectable, signal, computed } from '@angular/core';

export type MeetingState = 'live' | 'upcoming' | 'ended';

@Injectable({ providedIn: 'root' })
export class MeetingStatusStore {

  private _state = signal<Record<string, MeetingState>>({});

  readonly state = this._state.asReadonly();

  setState(id: string, value: MeetingState) {
    this._state.update(s => ({ ...s, [id]: value }));
  }

  getState(id: string) {
    return computed(() => this._state()[id] ?? 'upcoming');
  }
}