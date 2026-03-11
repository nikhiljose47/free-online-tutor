import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CatalogLookupService } from '../../../domain/syllabus-index/catalog-lookup.service';
import { CatalogItem } from '../../../models/syllabus/syllabus-index.model';
import { PLACEHOLDER__COVER_IMG } from '../../../core/constants/app.constants';

@Component({
  selector: 'catalog-groups',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './catalog-groups.component.html',
  styleUrls: ['./catalog-groups.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CatalogGroupsComponent {
  private catalog = inject(CatalogLookupService);
  private router = inject(Router);

  groups = signal<Map<string, CatalogItem[]>>(new Map());

  openGroups = signal<Set<string>>(new Set());

  constructor() {
    this.load();
  }

  load() {
    this.catalog.groupMap$.subscribe((res) => {
      this.groups.set(res);
      const first = res.keys().next().value;

      if (first) {
        this.openGroups.update((s) => new Set([...s, first]));
      }
    });
  }

  groupsArray() {
    return Array.from(this.groups().entries()).map(([key, value]) => ({
      key,
      value,
    }));
  }

  isOpen(key: string) {
    return this.openGroups().has(key);
  }

  toggle(key: string) {
    this.openGroups.update((set) => {
      const next = new Set(set);

      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }

      return next;
    });
  }

  openItem(item: CatalogItem) {
    this.router.navigate(['/details', 'class', item.id]);
   // this.router.navigate(['/catalog', item.id]);
  }

  getBannerSrc(g?: any | null): string {
    return PLACEHOLDER__COVER_IMG;
    // return g ? `assets/catalog-icons/${g}.svg` : PLACEHOLDER__COVER_IMG;
  }
  onImgError(event: Event) {
    (event.target as HTMLImageElement).src = PLACEHOLDER__COVER_IMG;
  }

  getBannerAlt(item: any): string {
    return item?.key;
  }
}
