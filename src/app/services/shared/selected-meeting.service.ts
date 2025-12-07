import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SelectedMeetingService {
  private readonly _selected = signal<any | null>(null);

  selected = this._selected.asReadonly();

  setSelected(item: any) {
    this._selected.set(item);
  }

  clear() {
    this._selected.set(null);
  }
}
