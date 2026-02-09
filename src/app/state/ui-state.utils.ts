import { Injectable, signal } from '@angular/core';

type UiStateRecord<T> = {
  value: T;
  timestamp: number;
  ttl?: number;
};

@Injectable({ providedIn: 'root' })
export class UiStateUtil {
  private store = signal<Record<string, UiStateRecord<any>>>({});

  set<T>(key: string, value: T, ttlMs?: number): void {
    this.store.update((s) => ({
      ...s,
      [key]: {
        value,
        timestamp: Date.now(),
        ttl: ttlMs,
      },
    }));
  }

  get<T>(key: string): T | null {
    const entry = this.store()[key] as UiStateRecord<T> | undefined;
    if (!entry) return null;

    if (entry.ttl && Date.now() - entry.timestamp > entry.ttl) {
      this.clear(key);
      return null;
    }

    return entry.value;
  }

  has(key: string): boolean {
    const entry = this.store()[key];
    if (!entry) return false;

    if (entry.ttl && Date.now() - entry.timestamp > entry.ttl) {
      this.clear(key);
      return false;
    }

    return true;
  }

  clear(key: string): void {
    this.store.update((s) => {
      const { [key]: _, ...rest } = s;
      return rest;
    });
  }

  reset(): void {
    this.store.set({});
  }
}
