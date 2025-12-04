import { Component, computed } from '@angular/core';
import { Auth2Service } from '../../services/fire/auth2.service';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'announcement-bar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './announcement-bar.html',
  styleUrl: './announcement-bar.scss',
})
export class AnnouncementBar {
  news = [
    'New Batch open for Class 6–10',
    'New live classes added for Science',
    'Mock Tests start this Sunday',
    'Teacher ratings updated!',
    'Welcome new teacher - NIKHIL',
  ];
  user = computed(() => this.auth.user());

  constructor(private auth: Auth2Service) {}
}
