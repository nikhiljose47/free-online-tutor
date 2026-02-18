import { Injectable, inject, signal, computed } from '@angular/core';
import { map, shareReplay } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  CatalogGroup,
  CatalogItem,
  SyllabusIndex,
} from '../../models/syllabus/syllabus-index.model';
import { SyllabusRepository } from '../repositories/syllabus.repository';

@Injectable({ providedIn: 'root' })
export class CatalogLookupService {
  private store = inject(SyllabusRepository);

  /* ================= SOURCE ================= */

  private readonly index$ = this.store
    .loadIndex()
    .pipe(shareReplay({ bufferSize: 1, refCount: true }));

  private readonly index = toSignal(this.index$, {
    initialValue: { version: '', generatedAt: '', groups: [], catalog: [] } as SyllabusIndex,
  });

  /* ================= BASE SIGNALS ================= */

  readonly catalog = computed(() => this.index()?.catalog ?? []);
  readonly groups = computed(() => this.index()?.groups ?? []);

  /* ================= READY & AVAILABLE ================= */

  private isAvailable(item: CatalogItem) {
    if (!item.availableFrom) return true;
    return new Date(item.availableFrom) <= new Date();
  }

  readonly readyCatalog = computed(() =>
    this.catalog().filter((i) => i.enabled && i.ready && this.isAvailable(i)),
  );

  /* ================= GROUP MAP ================= */

  readonly groupMap = computed(() => {
    const mapData = new Map<CatalogGroup, CatalogItem[]>();

    for (const item of this.readyCatalog()) {
      if (!mapData.has(item.group)) mapData.set(item.group, []);
      mapData.get(item.group)!.push(item);
    }

    return mapData;
  });

  /* ================= RXJS VERSION (heavy consumers) ================= */

  readonly groupMap$ = this.index$.pipe(
    map((idx) => {
      const now = new Date();
      const mapData = new Map<CatalogGroup, CatalogItem[]>();

      for (const item of idx?.catalog ?? []) {
        const available = !item.availableFrom || new Date(item.availableFrom) <= now;

        if (item.enabled && item.ready && available) {
          if (!mapData.has(item.group)) mapData.set(item.group, []);
          mapData.get(item.group)!.push(item);
        }
      }

      return mapData;
    }),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  /* ================= SIMPLE GETTERS ================= */

  getReadyGroupedMap(): Map<CatalogGroup, CatalogItem[]> {
    return this.groupMap();
  }

  getAllGroupLabels(): CatalogGroup[] {
    return this.groups();
  }

  getAllReady(): CatalogItem[] {
    return this.readyCatalog();
  }

  getAllReady$() {
  return this.groupMap$.pipe(
    map(mapData => Array.from(mapData.values()).flat())
  );
}

  getByGroup(group: CatalogGroup): CatalogItem[] {
    return this.groupMap().get(group) ?? [];
  }

  hasGroup(group: CatalogGroup): boolean {
    return this.groupMap().has(group);
  }

  getFirstOfGroup(group: CatalogGroup): CatalogItem | null {
    return this.getByGroup(group)[0] ?? null;
  }

  getLiveItems(): CatalogItem[] {
    return this.readyCatalog().filter((i) => i.isLive);
  }

  getByType(type: CatalogItem['type']): CatalogItem[] {
    return this.readyCatalog().filter((i) => i.type === type);
  }

  getSorted(group: CatalogGroup): CatalogItem[] {
    return [...this.getByGroup(group)].sort((a, b) => a.priority - b.priority);
  }

  getById(id: string): CatalogItem | null {
    return this.catalog().find((i) => i.id === id) ?? null;
  }

  /* ================= SEARCH ================= */

  search(term: string): CatalogItem[] {
    const t = term.toLowerCase();
    return this.readyCatalog().filter((i) => i.title.toLowerCase().includes(t));
  }
}
