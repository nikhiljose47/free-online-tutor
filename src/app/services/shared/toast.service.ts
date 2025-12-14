import { Injectable, signal } from '@angular/core';

export interface ToastMsg {
  id: string;
  text: string;
  type?: 'success' | 'error' | 'info';
  timeout?: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  toasts = signal<ToastMsg[]>([]);

  show(text: string, type: ToastMsg['type'] = 'info', timeout = 3000) {
    const id = crypto.randomUUID();
    this.toasts.update(v => [...v, { id, text, type, timeout }]);
    setTimeout(() => this.remove(id), timeout);
  }

  remove(id: string) {
    this.toasts.update(v => v.filter(t => t.id !== id));
  }
}
