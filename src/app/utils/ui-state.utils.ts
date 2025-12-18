import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UiStateUtil {
  private store = signal<Record<string, unknown>>({});

  /* -------- set value -------- */
  set<T>(key: string, value: T): void {
    this.store.update((s) => ({ ...s, [key]: value }));
  }

  /* -------- get value -------- */
  get<T>(key: string): T | null {
    return (this.store()[key] as T) ?? null;
  }

  /* -------- remove value -------- */
  clear(key: string): void {
    this.store.update((s) => {
      const { [key]: _, ...rest } = s;
      return rest;
    });
  }

  /* -------- clear all -------- */
  reset(): void {
    this.store.set({});
  }
}
