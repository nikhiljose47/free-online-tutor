import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class LocalStoreService {

  private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  /* ===== SET ===== */
  set<T>(key: string, value: T): void {
    if (!this.isBrowser) return;

    try {
      const data = JSON.stringify(value);
      localStorage.setItem(key, data);
    } catch (e) {
      console.warn('LocalStore set failed', e);
    }
  }

  /* ===== GET ===== */
  get<T>(key: string, fallback: T | null = null): T | null {
    if (!this.isBrowser) return fallback;

    try {
      const data = localStorage.getItem(key);
      return data ? (JSON.parse(data) as T) : fallback;
    } catch (e) {
      console.warn('LocalStore get failed', e);
      return fallback;
    }
  }

  /* ===== REMOVE ===== */
  remove(key: string): void {
    if (!this.isBrowser) return;

    try {
      localStorage.removeItem(key);
    } catch {}
  }

  /* ===== CLEAR ===== */
  clear(): void {
    if (!this.isBrowser) return;

    try {
      localStorage.clear();
    } catch {}
  }

  /* ===== HAS ===== */
  has(key: string): boolean {
    if (!this.isBrowser) return false;

    return localStorage.getItem(key) !== null;
  }
}