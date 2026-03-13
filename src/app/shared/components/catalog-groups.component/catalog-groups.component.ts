import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Output,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CatalogLookupService } from '../../../domain/syllabus-index/catalog-lookup.service';
import { CatalogItem } from '../../../models/syllabus/syllabus-index.model';
import { PLACEHOLDER__COVER_IMG } from '../../../core/constants/app.constants';
import { StringUtil } from '../../utils/string.util';

@Component({
  selector: 'catalog-groups',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './catalog-groups.component.html',
  styleUrls: ['./catalog-groups.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CatalogGroupsComponent {
  @Output() routeTrigger = new EventEmitter<string>();

  private catalog = inject(CatalogLookupService);

  groups = signal<Map<string, CatalogItem[]>>(new Map());
  openGroups = signal<Set<string>>(new Set());
  slugToText = StringUtil.slugToTitle;

  constructor() {
    this.load();
  }

  load() {
    this.catalog.primaryGroupMap$.subscribe((res) => {
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
    this.routeTrigger.emit(item.id);
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
