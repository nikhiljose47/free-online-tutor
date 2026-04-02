import { Injectable, signal } from '@angular/core';

export interface ConfirmState {
  open: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

@Injectable({ providedIn: 'root' })
export class ConfirmService {

  private _state = signal<ConfirmState>({
    open: false,
    title: '',
    message: '',
    confirmText: 'Confirm',
    cancelText: 'Cancel'
  });

  private resolver?: (val: boolean) => void;

  // readonly signal for UI
  readonly state = this._state.asReadonly();

  // open dialog
  open(opts: {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
  }): Promise<boolean> {

    this._state.set({
      open: true,
      title: opts.title,
      message: opts.message,
      confirmText: opts.confirmText ?? 'Confirm',
      cancelText: opts.cancelText ?? 'Cancel'
    });

    return new Promise<boolean>((resolve) => {
      this.resolver = resolve;
    });
  }

  confirm() {
    this._state.update(s => ({ ...s, open: false }));
    this.resolver?.(true);
    this.resolver = undefined;
  }

  cancel() {
    this._state.update(s => ({ ...s, open: false }));
    this.resolver?.(false);
    this.resolver = undefined;
  }
}