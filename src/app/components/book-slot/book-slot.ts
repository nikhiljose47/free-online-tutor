import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SlotService } from '../../services/slot.service';
import { Slot } from '../../models/slot.model';

@Component({
  selector: 'book-slot',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './book-slot.html',
})
export class BookSlotComponent {
  private service = inject(SlotService);

  // 🔥 Signal instead of array
  slots = signal<Slot[]>(this.service.getSlots());

  book(id: number) {
    this.service.bookSlot(id);

    // 🔥 Refresh slots after booking (triggers UI update)
    this.slots.set(this.service.getSlots());
  }
}
