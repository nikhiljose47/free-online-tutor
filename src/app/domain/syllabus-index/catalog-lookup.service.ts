import { Injectable, inject, computed } from '@angular/core';
import { map, shareReplay } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

import {
  CatalogItem,
  PrimaryGroup,
  SyllabusIndex
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
    initialValue: {
      version: '',
      generatedAt: '',
      primaryGroups: [],
      groups: [],
      catalog: []
    } as unknown as SyllabusIndex
  });

  /* ================= BASE SIGNALS ================= */

  readonly catalog = computed(() => this.index()?.catalog ?? []);

  readonly primaryGroups = computed(
    () => this.index()?.primaryGroups ?? []
  );

  readonly groups = computed(
    () => this.index()?.groups ?? []
  );

  /* ================= READY FILTER ================= */

  private isAvailable(item: CatalogItem) {
    if (!item.availableFrom) return true;
    return new Date(item.availableFrom) <= new Date();
  }

  readonly readyCatalog = computed(() =>
    this.catalog().filter(
      i => i.enabled && i.ready && this.isAvailable(i)
    )
  );

  /* ================= PRIMARY GROUP MAP ================= */

readonly primaryGroupMap = computed(() => {
  const mapData = new Map<PrimaryGroup, CatalogItem[]>();

  for (const item of this.readyCatalog()) {
    const group = item.primaryGroup;

    if (!mapData.has(group)) {
      mapData.set(group, []);
    }

    mapData.get(group)!.push(item);
  }

  return mapData;
});


/* ================= SUB GROUP MAP ================= */

readonly subGroupMap = computed(() => {
  const mapData = new Map<string, CatalogItem[]>();

  for (const item of this.readyCatalog()) {

    for (const group of item.groups ?? []) {

      if (!mapData.has(group)) {
        mapData.set(group, []);
      }

      mapData.get(group)!.push(item);

    }
  }

  return mapData;
});


/* ================= RXJS VERSION (FOR HEAVY STREAM USE) ================= */

readonly primaryGroupMap$ = this.index$.pipe(
  map(idx => {

    const now = new Date();
    const mapData = new Map<PrimaryGroup, CatalogItem[]>();

    for (const item of idx?.catalog ?? []) {

      const available =
        !item.availableFrom ||
        new Date(item.availableFrom) <= now;

      if (item.enabled && item.ready && available) {

        const group = item.primaryGroup;

        if (!mapData.has(group)) {
          mapData.set(group, []);
        }

        mapData.get(group)!.push(item);

      }
    }

    return mapData;

  }),
  shareReplay({ bufferSize: 1, refCount: true })
);

/* ================= SIMPLE GETTERS ================= */

getAllReady(): CatalogItem[] {
  return this.readyCatalog();
}

getById(id: string): CatalogItem | null {
  return this.catalog().find(i => i.id === id) ?? null;
}

getLiveItems(): CatalogItem[] {
  return this.readyCatalog().filter(i => i.isLive);
}

getByType(type: CatalogItem['type']): CatalogItem[] {
  return this.readyCatalog().filter(i => i.type === type);
}


/* ================= PRIMARY GROUP LOOKUPS ================= */

getByPrimaryGroup(primary: PrimaryGroup): CatalogItem[] {
  return this.primaryGroupMap().get(primary) ?? [];
}

getPrimaryGroupEntries() {
  return Array.from(this.primaryGroupMap().entries())
    .map(([key, value]) => ({
      key,
      value
    }));
}


/* ================= SUB GROUP LOOKUPS ================= */

getByGroup(group: string): CatalogItem[] {
  return this.subGroupMap().get(group) ?? [];
}

hasGroup(group: string): boolean {
  return this.subGroupMap().has(group);
}

getFirstOfGroup(group: string): CatalogItem | null {
  return this.getByGroup(group)[0] ?? null;
}

getSubGroupEntries() {
  return Array.from(this.subGroupMap().entries())
    .map(([key, value]) => ({
      key,
      value
    }));
}


/* ================= SORTED ================= */

getSorted(group: string): CatalogItem[] {
  return [...this.getByGroup(group)]
    .sort((a, b) => a.priority - b.priority);
}


/* ================= SEARCH ================= */

search(term: string): CatalogItem[] {

  const t = term.toLowerCase();

  return this.readyCatalog().filter(
    i => i.title.toLowerCase().includes(t)
  );

}
}