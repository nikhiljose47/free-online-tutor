import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
  effect,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { Auth2Service } from '../../core/services/fire/auth2.service';
import { ToastService } from '../../shared/toast.service';
import { SearchService } from '../../services/search.service';
import { UserProfileService } from '../../core/services/fire/user-profile.service';
import { ConfirmService } from '../../services/common/confirm.service';
import { CommonUtil } from '../../shared/utils/common.util';
import { UserPointsService } from '../../services/user/user-points/user-points.service';

@Component({
  selector: 'topbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './topbar.html',
  styleUrls: ['./topbar.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Topbar {
  private readonly auth = inject(Auth2Service);
  private readonly toast = inject(ToastService);
  private readonly router = inject(Router);
  private readonly profileApi = inject(UserProfileService);
  private readonly confirm = inject(ConfirmService);
  private readonly pointsService = inject(UserPointsService);

  CommonUtil = CommonUtil;
  readonly ss = inject(SearchService);

  readonly profile = computed(() => this.profileApi.profile());
  readonly points = signal<number>(0);

  constructor() {
    this.router.events
      .pipe(takeUntilDestroyed())
      .subscribe(() => {
        this.ss.open.set(false);
        this.ss.query.set('');
      });

    effect(() => {
      const p = this.profile();
      this.points.set(p?.seasonPoints ?? 0);
    });

    this.pointsService.points$
      ?.pipe(takeUntilDestroyed())
      .subscribe((delta: number) => {
        this.points.update((v) => v + delta);
      });
  }

  onSearchInput(value: string) {
    this.ss.query.set(value);
    this.ss.open.set(!!value.trim());
  }

  async logout() {
    const ok = await this.confirm.open({
      title: 'Are you sure you want to logout?',
      message: '',
      confirmText: 'Logout',
      cancelText: 'Cancel',
    });

    if (!ok) return;

    this.auth.logout();
    this.toast.show('Logged out');
    this.router.navigateByUrl('/');
  }
}