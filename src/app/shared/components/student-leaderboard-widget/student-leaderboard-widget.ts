// student-leaderboard-widget.component.ts

import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnnouncementsService } from '../../../services/announcements/announcements.service';
import { Announcement } from '../../../models/announcement.model';

type LeaderboardStudent = {
  rank: number;
  name: string;
  avatar: string;
  level: string;
  points: number;
};

@Component({
  selector: 'student-leaderboard-widget',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './student-leaderboard-widget.html',
  styleUrls: ['./student-leaderboard-widget.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentLeaderboardWidget {
  private announceApi = inject(AnnouncementsService);

  leaderboard = signal<LeaderboardStudent[]>([
    {
      rank: 1,
      name: 'Aarav Sharma',
      avatar: 'https://i.pravatar.cc/80?img=12',
      level: 'Typing Master',
      points: 9820,
    },
    {
      rank: 2,
      name: 'Meera Nair',
      avatar: 'https://i.pravatar.cc/80?img=32',
      level: 'Speed Pro',
      points: 8740,
    },
  ]);

  announcements = signal<Announcement[]>([]);

  //Replace dummy data later:

  ngOnInit() {
    this.leaderboard.set([]);
    // this.leaderboard.set(this.leaderboardService.students());
    this.announceApi.getAll().subscribe((data) => {
      this.announcements.set(data);
    });
  }
}
