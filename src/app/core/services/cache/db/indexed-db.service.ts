import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { INDEXED_DB_NAME } from '../../../constants/app.constants';

export type DBStore =
  | 'syllabus_by_class'
  | 'syllabus_index'
  | 'session_timelines'
  | 'puzzle_sessions'
  | 'user_point_logs'
  | 'app_context_map'
  | 'user_course_map';

export interface DBConfig {
  dbName: string;
  version: number;
}

@Injectable({ providedIn: 'root' })
export class IndexedDbService {
  private readonly config: DBConfig = {
    dbName: INDEXED_DB_NAME,
    version: 2,
  };

  private isBrowser: boolean;
  private db!: IDBDatabase;

  /** 🔥 REAL readiness gate */
  private ready!: Promise<void>;

  /** optional signal (UI/debug only) */
  dbReady = signal<boolean>(false);

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);

    if (this.isBrowser) {
      this.init();
    } else {
      // SSR: resolve immediately (no-op DB)
      this.ready = Promise.resolve();
    }
  }

  private init(): void {
    this.ready = new Promise((resolve, reject) => {
      const req = window.indexedDB.open(this.config.dbName, this.config.version);

      req.onupgradeneeded = () => {
        const db = req.result;

        if (!db.objectStoreNames.contains('syllabus_by_class')) {
          db.createObjectStore('syllabus_by_class', { keyPath: 'id' });
        }

        if (!db.objectStoreNames.contains('user_course_map')) {
          db.createObjectStore('user_course_map', { keyPath: 'id' });
        }

        if (!db.objectStoreNames.contains('syllabus_index')) {
          db.createObjectStore('syllabus_index', { keyPath: 'id' });
        }

        if (!db.objectStoreNames.contains('session_timelines')) {
          db.createObjectStore('session_timelines', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('puzzle_sessions')) {
          db.createObjectStore('puzzle_sessions', { keyPath: 'id' });
        }

        if (!db.objectStoreNames.contains('user_point_logs')) {
          db.createObjectStore('user_point_logs', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('app_context_map')) {
          db.createObjectStore('app_context_map', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('user_course_map')) {
          db.createObjectStore('user_course_map', { keyPath: 'id' });
        }
      };

      req.onsuccess = () => {
        this.db = req.result;
        this.db.onversionchange = () => this.db.close();
        this.dbReady.set(true);
        resolve();
      };

      req.onerror = () => {
        console.error('IndexedDB init failed', req.error);
        reject(req.error);
      };
    });
  }

  /* ---------- CORE TX (THE FIX) ---------- */
  private async tx<T>(
    store: DBStore,
    mode: IDBTransactionMode,
    cb: (s: IDBObjectStore) => IDBRequest<T>,
  ): Promise<T> {
    if (!this.isBrowser) {
      return Promise.resolve(null as T);
    }

    await this.ready; // ✅ WAIT — NO MORE RACE

    return new Promise((resolve, reject) => {
      try {
        const tx = this.db.transaction(store, mode);
        const req = cb(tx.objectStore(store));

        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
        tx.onabort = () => reject(tx.error);
      } catch (e) {
        reject(e);
      }
    });
  }

  set<T extends { id: string }>(store: DBStore, data: T): Promise<void> {
    return this.tx(store, 'readwrite', (s) => s.put(data)).then(() => {});
  }

  bulkSet<T extends { id: string }>(store: DBStore, list: T[]): Promise<void> {
    if (!this.isBrowser) return Promise.resolve();

    return this.ready.then(() => {
      return new Promise((resolve, reject) => {
        const tx = this.db.transaction(store, 'readwrite');
        const os = tx.objectStore(store);

        try {
          list.forEach((item) => os.put(item));
          tx.oncomplete = () => resolve();
          tx.onerror = () => reject(tx.error);
          tx.onabort = () => reject(tx.error);
        } catch (e) {
          reject(e);
        }
      });
    });
  }

  get<T>(store: DBStore, id: string): Promise<T | null> {
    return this.tx(store, 'readonly', (s) => s.get(id)).then((r) => r ?? null);
  }

  getAll<T>(store: DBStore): Promise<T[]> {
    return this.tx(store, 'readonly', (s) => s.getAll());
  }

  delete(store: DBStore, id: string): Promise<void> {
    return this.tx(store, 'readwrite', (s) => s.delete(id)).then(() => {});
  }

  clear(store: DBStore): Promise<void> {
    return this.tx(store, 'readwrite', (s) => s.clear()).then(() => {});
  }

  /* ---------- RECOVERY ---------- */
  async resetDB(): Promise<void> {
    if (!this.isBrowser) return;

    await this.ready;
    this.db.close();
    indexedDB.deleteDatabase(this.config.dbName);
    this.init();
  }
}
