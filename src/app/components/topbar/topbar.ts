import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'topbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './topbar.html',
  styleUrls: ['./topbar.scss'],
})
export class TopbarComponent {
  openProfile = signal(false);
 // isLoggedIn: boolean = false;

  toggleProfile() {
    this.openProfile.update((v) => !v);
  }

  logout() {
    // your logout logic
  }

  onSearch(value: string) {
    // Firestore search / index search / Algolia / local filter
  }
}
