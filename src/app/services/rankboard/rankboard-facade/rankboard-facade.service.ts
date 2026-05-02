import { Injectable, inject, computed } from '@angular/core';
import { Observable } from 'rxjs';
import { RankboardCacheService } from '../rankboard-cache/rankboard-cache.service';

@Injectable({ providedIn: 'root' })
export class RankboardFacadeService {
  private cache = inject(RankboardCacheService);

  data = this.cache.data;
  loading = this.cache.loading;
  syncing = this.cache.syncing;
  error = this.cache.error;

  hasData = computed(() => this.data().length > 0);

  top3 = computed(() => this.data().slice(0, 3));
  rest = computed(() => this.data().slice(3));

  vm = computed(() => ({
    data: this.data(),
    loading: this.loading(),
    syncing: this.syncing(),
    error: this.error(),
    hasData: this.hasData(),
    top3: this.top3(),
    rest: this.rest(),
  }));

  init$(): Observable<any> {
    return this.cache.load$();
  }

  refresh$(): Observable<any> {
    return this.cache.refresh$();
  }
}
