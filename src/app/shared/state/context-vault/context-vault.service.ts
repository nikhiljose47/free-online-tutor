import { Injectable, signal } from '@angular/core';
import { IndexedDbService } from '../../../core/services/cache/db/indexed-db.service';

//Usage
//await vault.set('mob-flutter-adv', { domain: 'flutter' });
//const data = await vault.get<{ domain: string }>('mob-flutter-adv');
//{{ vault.select('mob-flutter-adv')()?.domain }}

@Injectable({ providedIn: 'root' })
export class ContextVaultService {
  private readonly STORE = 'app_context_map';

  private memory = signal<Record<string, any>>({});

  constructor(private idb: IndexedDbService) {}

  /* ---------- SET ---------- */
  async set<T>(key: string, value: T): Promise<void> {
    const payload = { id: key, value };

    this.memory.update((m) => ({ ...m, [key]: value }));

    this.idb.set(this.STORE, payload);
  }

  /* ---------- GET ---------- */
  async get<T>(key: string): Promise<T | null> {
    const mem = this.memory()[key];
    if (mem !== undefined) return mem as T;

    const db = await this.idb.get<{ id: string; value: T }>(this.STORE, key);
    if (db) {
      this.memory.update((m) => ({ ...m, [key]: db.value }));
      return db.value;
    }

    return null;
  }

  /* ---------- PRELOAD ---------- */
  async preload<T>(key: string): Promise<void> {
    if (this.memory()[key] !== undefined) return;

    const db = await this.idb.get<{ id: string; value: T }>(this.STORE, key);
    if (db) {
      this.memory.update((m) => ({ ...m, [key]: db.value }));
    }
  }

  /* ---------- SIGNAL ---------- */
  select = <T>(key: string) => {
    return () => this.memory()[key] as T | null;
  };

  /* ---------- CLEAR ---------- */
  clear(key: string): void {
    this.memory.update((m) => {
      const { [key]: _, ...rest } = m;
      return rest;
    });
  }
}
