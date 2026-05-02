import { Component, ChangeDetectionStrategy, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../shared/toast.service';

@Component({
  selector: 'toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Toast {
  toasts = computed(() => this.toastService.toasts());
  constructor(private toastService: ToastService) {}
  
  remove(id: string) {
    this.toastService.remove(id);
  }
}
