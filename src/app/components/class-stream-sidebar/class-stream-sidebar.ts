import {
  Component,
  OnDestroy,
  OnInit,
  inject,
  signal,
  ChangeDetectionStrategy,
  EventEmitter,
  Output,
  effect,
} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router } from '@angular/router';

import { UiStateUtil } from '../../shared/state/ui-state.utils';
import { PLACEHOLDER__COVER_IMG } from '../../core/constants/app.constants';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { GlobalMeetingsViewModel } from '../../services/meetings/global-meetings-viewmodel/global-meetings-viewmodel';
import { GlobalMeetingsStoreService } from '../../services/meetings/global-meetings-store/global-meetings-store.service';

@Component({
  selector: 'class-stream-sidebar',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './class-stream-sidebar.html',
  styleUrl: './class-stream-sidebar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClassStreamSidebar implements OnInit {
  @Output() collapsedChange = new EventEmitter<boolean>();

  private router = inject(Router);
  private uiUtil = inject(UiStateUtil);
  private facade = inject(GlobalMeetingsStoreService);

  readonly live = signal<any[]>([]);
  readonly upcoming = signal<any[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly collapsed = signal(false);

  private vmService = inject(GlobalMeetingsViewModel);

  vm = toSignal(this.vmService.vm$, {
    initialValue: { live: [], upcoming: [] },
  });

  ngOnInit() {
    this.facade.init();
  }

  trackById = (_: number, item: any) => item.id;

  getBannerSrc(src?: string | null): string {
    return src || PLACEHOLDER__COVER_IMG;
  }

  onImgError(event: Event) {
    (event.target as HTMLImageElement).src = PLACEHOLDER__COVER_IMG;
  }

  getBannerAlt(cls: any): string {
    return cls?.className ? `${cls.className} cover` : 'Class cover';
  }

  open(item: any) {
    this.uiUtil.set(item.id, item);
    this.router.navigate(['/join-tution', item.id]);
  }

  toggleSidebar() {
    this.collapsed.update((v) => !v);
    this.collapsedChange.emit(this.collapsed());
  }
}
