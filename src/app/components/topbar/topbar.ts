import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
  HostListener,
  ViewChild,
  ElementRef,
  viewChild,
  Renderer2,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Auth2Service } from '../../core/services/fire/auth2.service';
import { ToastService } from '../../shared/toast.service';
import { SearchService } from '../../services/search.service';
import { UserProfileService } from '../../core/services/fire/user-profile.service';
import { ConfirmService } from '../../services/common/confirm.service';
import { CommonUtil } from '../../shared/utils/common.util';

@Component({
  selector: 'topbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './topbar.html',
  styleUrls: ['./topbar.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Topbar {
  @ViewChild('myInput') inputEleRef: ElementRef | null = null;
  private myInput = viewChild<ElementRef<HTMLElement>>('myInput');
  private renderer = inject(Renderer2);
  /* ===============================
     INJECTIONS
  =============================== */
  private readonly auth = inject(Auth2Service);
  private readonly toast = inject(ToastService);
  private readonly router = inject(Router);
  private readonly profileApi = inject(UserProfileService);
  private readonly confirm = inject(ConfirmService);
  /** Public (template access) */
  CommonUtil = CommonUtil;
  readonly ss = inject(SearchService);

  /* ===============================
     STATE
  =============================== */
  readonly profile = computed(() => this.profileApi.profile());
  menuOpen = signal(false);
  learnOpen = signal(false);
  otherOpen = signal(false);
  proffOpen = signal(false);

  constructor() {
    /** Auto-close menus on route change */
    effect(() => {
      this.router.events.subscribe(() => {
        this.menuOpen.set(false);
        this.learnOpen.set(false);
        this.proffOpen.set(false);
        this.otherOpen.set(false);
        this.ss.open.set(false);
        if (this.myInput()) {
          this.renderer.setProperty(this.myInput()?.nativeElement, 'value', '');
        }
        if (this.inputEleRef) {
          this.inputEleRef.nativeElement.input = '';
        }
      });
    });
  }

  /* ===============================
     PROFF MENU
  =============================== */
  toggleProff() {
    this.proffOpen.update((v) => !v);
    this.closeOther();
    this.closeLearn();
    this.closeMenu();
    this.ss.open.set(false);
  }

  closeProff() {
    this.proffOpen.set(false);
  }

  /* ===============================
     PROFILE MENU
  =============================== */
  toggleMenu() {
    this.menuOpen.update((v) => !v);
    this.closeOther();
    this.closeLearn();
    this.closeProff();
    this.ss.open.set(false);
  }

  closeMenu() {
    this.menuOpen.set(false);
  }

  /* ===============================
     OTHER
  =============================== */
  toggleOther() {
    this.otherOpen.update((v) => !v);
    this.closeMenu();
    this.closeLearn();
    this.closeProff();
  }

  closeOther() {
    this.otherOpen.set(false);
  }

  /* ===============================
     LEARN
  =============================== */
  toggleLearn() {
    this.learnOpen.update((v) => !v);
    this.closeMenu();
    this.closeAll;
    this.closeOther();
    this.closeProff();
  }

  closeLearn() {
    this.learnOpen.set(false);
  }

  /* ===============================
     SEARCH
  =============================== */
  triggerSearch() {
    const q = this.ss.query().trim();
    if (!q) return;

    this.ss.search(q);
    this.ss.open.set(true);
  }

  onSearchInput(value: string) {
    this.ss.query.set(value);
    this.ss.open.set(!!value.trim());
  }

  /* ===============================
     GLOBAL OUTSIDE CLICK
  =============================== */
  @HostListener('document:click')
  closeAll() {
    this.menuOpen.set(false);
    this.learnOpen.set(false);
    this.otherOpen.set(false);
    this.proffOpen.set(false);
    this.ss.open.set(false);
  }

  /* ===============================
     AUTH
  =============================== */
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
