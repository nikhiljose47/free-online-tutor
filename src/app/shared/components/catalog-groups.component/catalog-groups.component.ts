import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Output,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CatalogLookupService } from '../../../domain/syllabus-index/catalog-lookup.service';
import { CatalogItem, PrimaryGroup } from '../../../models/syllabus/syllabus-index.model';
import { StringUtil } from '../../utils/string.util';
import { PLACEHOLDER__COVER_IMG } from '../../../core/constants/app.constants';

type GroupMeta = {
  icon: string;
  bg: string;
};

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

  groups = signal<Map<PrimaryGroup, CatalogItem[]>>(new Map());
  openGroups = signal<Set<string>>(new Set());
  slugToText = StringUtil.slugToTitle;

  primaryGroupMeta: Record<PrimaryGroup, GroupMeta> = {
    school: {
      icon: '🏫',
      bg: '#E8F0FE',
    },
    skills: {
      icon: '🔬',
      bg: '#F3E8FF',
    },
    'exam-prep': {
      icon: '✍️',
      bg: '#FFF4E5',
    },
    coding: {
      icon: '👨‍💻',
      bg: '#E6F7FF',
    },
    language: {
      icon: '🗣️',
      bg: '#E6FFFA',
    },
    creative: {
      icon: '🎭',
      bg: '#FFF0F6',
    },
    career: {
      icon: '💼',
      bg: '#F1F3F5',
    },
    wellness: {
      icon: '🧘‍♂️',
      bg: '#E9F7EF',
    },
  };

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
}
