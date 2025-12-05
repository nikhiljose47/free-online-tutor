import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Auth2Service } from '../../services/fire/auth2.service';
import { ToastService } from '../../services/toast.service';
import { Register } from '../../pages/register/register';

@Component({
  selector: 'topbar',
  standalone: true,
  imports: [RouterLink, CommonModule, Register],
  templateUrl: './topbar.html',
  styleUrls: ['./topbar.scss'],
})
export class TopbarComponent {
  openProfile = signal(false);
  user = computed(() => this.auth.user());

  constructor(private auth: Auth2Service, private toast: ToastService) {
  }

  toggleProfile() {
    this.openProfile.update((v) => !v);
  }

  logout() {
    this.auth.logout();
    this.toast.show('Logged Out.')
    // your logout logic
  }

  onSearch(value: string) {
    // Firestore search / index search / Algolia / local filter
  }
}
