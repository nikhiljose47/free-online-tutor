// services/search.service.ts
import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { SEARCH_ITEMS } from '../core/constants/search-items';

@Injectable({ providedIn: 'root' })
export class SearchService {
  
  // What user types
  query = signal('');

  // Filtered results based ONLY on query
  results = computed(() => {
    const q = this.query().toLowerCase().trim();
    if (!q) return [];

    return SEARCH_ITEMS
      .filter(item =>
        item.keywords.some(k => k.toLowerCase().includes(q))
      )
      .slice(0, 5);  // max 4-5 results
  });

  constructor(private router: Router) {}

  navigate(route: string) {
    this.router.navigateByUrl(route);
  }
}
