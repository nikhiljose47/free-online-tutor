import { Component, ChangeDetectionStrategy, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../shared/toast.service';

@Component({
  selector: 'toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container position-fixed top-0 end-0 p-3" style="z-index:1200;">
      <div
        *ngFor="let t of toasts()"
        class="toast show mb-2 text-white"
        [class.bg-success]="t.type === 'success'"
        [class.bg-danger]="t.type === 'error'"
        [class.bg-primary]="t.type === 'info'"
      >
        <div class="d-flex align-items-center px-3 py-2">
          <div class="me-auto">{{ t.text }}</div>
          <button class="btn-close btn-close-white ms-3" (click)="remove(t.id)"></button>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Toast {
  toasts = computed(() => this.toastService.toasts());
  constructor(private toastService: ToastService) {}
  remove(id: string) {
    this.toastService.remove(id);
  }
}
