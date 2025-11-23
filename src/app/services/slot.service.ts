import { Injectable } from '@angular/core';
import { Slot } from '../models/slot.model';

@Injectable({ providedIn: 'root' })
export class SlotService {
  private slots: Slot[] = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    isBooked: false
  }));

  getSlots(): Slot[] {
    return this.slots;
  }

  bookSlot(id: number): void {
    const slot = this.slots.find(s => s.id === id);
    if (slot && !slot.isBooked) slot.isBooked = true;
  }
}
