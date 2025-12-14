import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Auth2Service } from '../../services/fire/auth2.service';
import { ToastService } from '../../services/shared/toast.service';
import { SearchService } from '../../services/search.service';

@Component({
  selector: 'topbar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './topbar.html',
  styleUrls: ['./topbar.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Topbar {
  user = computed(() => this.auth.user());
  menuOpen = signal(false);

  constructor(private auth: Auth2Service, private toast: ToastService, public ss: SearchService) {}

  toggleMenu() {
    this.menuOpen.update((v) => !v);
  }

  closeMenu() {
    this.menuOpen.set(false);
  }

  logout() {
    this.auth.logout();
    this.toast.show('Logged Out.');
  }

  onSearch(value: string) {
    // Firestore search / index search / Algolia / local filter
  }
}
