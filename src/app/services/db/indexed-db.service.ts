import { Injectable, signal } from '@angular/core';

export type DBStore =
  | 'syllabus_by_class'   // class-wise syllabus JSON
  | 'syllabus_index'            // Index
  | 'session_timelines';         // Timelines

export interface DBConfig {
  dbName: string;
  version: number;
}

@Injectable({ providedIn: 'root' })
export class IndexedDbService {
  private readonly config: DBConfig = {
    dbName: 'tuition_app_db',
    version: 1,
  };

  private dbReady = signal<boolean>(false);
  private db!: IDBDatabase;

  constructor() {
    this.init();
  }

  /* ---------- INIT (safe upgrade & recovery) ---------- */
  private init(): void {
    const req = indexedDB.open(this.config.dbName, this.config.version);

    req.onupgradeneeded = () => {
      const db = req.result;

      if (!db.objectStoreNames.contains('syllabus_by_class')) {
        db.createObjectStore('syllabus_by_class', { keyPath: 'id' });
      }

      if (!db.objectStoreNames.contains('syllabus_index')) {
        db.createObjectStore('syllabus_index', { keyPath: 'id' });
      }

      if (!db.objectStoreNames.contains('session_timelines')) {
        db.createObjectStore('session_timelines', { keyPath: 'id' });
      }
    };

    req.onsuccess = () => {
      this.db = req.result;
      this.db.onversionchange = () => this.db.close();
      this.dbReady.set(true);
    };

    req.onerror = () => {
      console.error('IndexedDB init failed', req.error);
    };
  }

  /* ---------- CORE HELPERS ---------- */
  private tx<T>(
    store: DBStore,
    mode: IDBTransactionMode,
    cb: (s: IDBObjectStore) => IDBRequest<T>
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      if (!this.dbReady()) return reject('DB not ready');

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

  /* ---------- CRUD (typed & safe) ---------- */

  /** UPSERT */
  set<T extends { id: string }>(store: DBStore, data: T): Promise<void> {
    return this.tx(store, 'readwrite', s => s.put(data)).then(() => {});
  }

  /** BULK UPSERT (atomic per store) */
  bulkSet<T extends { id: string }>(store: DBStore, list: T[]): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.dbReady()) return reject('DB not ready');

      const tx = this.db.transaction(store, 'readwrite');
      const os = tx.objectStore(store);

      try {
        list.forEach(item => os.put(item));
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
        tx.onabort = () => reject(tx.error);
      } catch (e) {
        reject(e);
      }
    });
  }

  /** GET by id */
  get<T>(store: DBStore, id: string): Promise<T | null> {
    return this.tx(store, 'readonly', s => s.get(id))
      .then(r => r ?? null);
  }

  /** GET ALL (pagination-friendly) */
  getAll<T>(store: DBStore): Promise<T[]> {
    return this.tx(store, 'readonly', s => s.getAll());
  }

  /** DELETE */
  delete(store: DBStore, id: string): Promise<void> {
    return this.tx(store, 'readwrite', s => s.delete(id)).then(() => {});
  }

  /** CLEAR store */
  clear(store: DBStore): Promise<void> {
    return this.tx(store, 'readwrite', s => s.clear()).then(() => {});
  }

  /* ---------- HARD FAIL SAFETY ---------- */

  /** Nukes DB if corrupted (last-resort recovery) */
  async resetDB(): Promise<void> {
    this.db?.close();
    indexedDB.deleteDatabase(this.config.dbName);
    this.init();
  }
}
