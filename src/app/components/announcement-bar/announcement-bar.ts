import { Component, computed } from '@angular/core';
import { Auth2Service } from '../../services/fire/auth2.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'announcement-bar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './announcement-bar.html',
  styleUrl: './announcement-bar.scss',
})
export class AnnouncementBar {
  news = [
    'Admissions open for Class 6–10',
    'New live classes added for Science',
    'Mock Tests start this Sunday',
    'Teacher ratings updated!',
  ];
  user = computed(() => this.auth.user());

  constructor(private auth: Auth2Service) {}
}
