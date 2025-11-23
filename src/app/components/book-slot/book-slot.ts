import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SlotService } from '../../services/slot.service';
import { Slot } from '../../models/slot.model';

@Component({
  selector: 'app-book-slot',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mt-4">
      <h3 class="fw-bold mb-3">Book Your Slot</h3>

      <div class="row">
        <div class="col-3 mb-3" *ngFor="let s of slots()">
          <div
            class="p-3 text-center rounded"
            [class.bg-success]="s.isBooked"
            [class.bg-light]="!s.isBooked"
            style="cursor: pointer; border: 1px solid #ccc;"
            (click)="book(s.id)"
          >
            {{ s.isBooked ? 'Booked' : 'Available' }}
          </div>
        </div>
      </div>
    </div>
  `,
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
