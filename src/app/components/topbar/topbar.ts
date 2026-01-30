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
import { Auth2Service } from '../../services/fire/auth2.service';
import { ToastService } from '../../shared/toast.service';
import { SearchService } from '../../services/search.service';
import { UserProfileService } from '../../services/fire/user-profile.service';

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

  /** Public (template access) */
  readonly ss = inject(SearchService);

  /* ===============================
     STATE
  =============================== */
  readonly profile = computed(() => this.profileApi.profile());
  readonly menuOpen = signal(false);

  constructor() {
    /** Auto-close menus on route change */
    effect(() => {
      this.router.events.subscribe(() => {
        this.menuOpen.set(false);
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
     PROFILE MENU
  =============================== */
  toggleMenu() {
    this.menuOpen.update((v) => !v);
    this.ss.open.set(false);
  }

  closeMenu() {
    this.menuOpen.set(false);
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
    this.ss.open.set(false);
  }

  /* ===============================
     AUTH
  =============================== */
  logout() {
    this.auth.logout();
    this.toast.show('Logged out');
    this.router.navigateByUrl('/');
  }
}
