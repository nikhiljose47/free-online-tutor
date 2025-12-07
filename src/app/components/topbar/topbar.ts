import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Auth2Service } from '../../services/fire/auth2.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'topbar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './topbar.html',
  styleUrls: ['./topbar.scss'],
})
export class Topbar {
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
