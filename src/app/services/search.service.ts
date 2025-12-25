import { Injectable, signal, computed, effect } from '@angular/core';
import { Router } from '@angular/router';
import { SEARCH_ITEMS } from '../core/constants/search-items';

export interface SearchItem {
  label: string;
  route: string;
  keywords: string[];
}

@Injectable({ providedIn: 'root' })
export class SearchService {
  /* ===============================
     STATE
  =============================== */
  readonly query = signal('');
  readonly open = signal(false);

  /* ===============================
     DERIVED RESULTS
  =============================== */
  readonly results = computed<SearchItem[]>(() => {
    const q = this.query().trim().toLowerCase();
    if (!q) return [];

    return SEARCH_ITEMS.filter((item) =>
      item.keywords.some((k) => k.toLowerCase().includes(q))
    ).slice(0, 5);
  });

  constructor(private router: Router) {
    /** Auto-close dropdown when query clears */
    effect(() => {
      if (!this.query()) {
        this.open.set(false);
      }
    });
  }

  /* ===============================
     ACTIONS
  =============================== */
  search(q: string) {
    this.query.set(q);
    this.open.set(true);
  }

  triggerSearch() {
    const q = this.query().trim();
    if (!q) return;
    this.open.set(true);
  }

  navigate(route: string) {
    this.open.set(false);
    this.router.navigateByUrl(route);
  }

  reset() {
    this.query.set('');
    this.open.set(false);
  }
}
