// student-leaderboard-widget.component.ts

import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

type LeaderboardStudent = {
  rank: number;
  name: string;
  avatar: string;
  level: string;
  points: number;
};

type Announcement = {
  message: string;
};

@Component({
  selector: 'student-leaderboard-widget',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './student-leaderboard-widget.html',
  styleUrls: ['./student-leaderboard-widget.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StudentLeaderboardWidget {

  leaderboard = signal<LeaderboardStudent[]>([
    {
      rank: 1,
      name: 'Aarav Sharma',
      avatar: 'https://i.pravatar.cc/80?img=12',
      level: 'Typing Master',
      points: 9820
    },
    {
      rank: 2,
      name: 'Meera Nair',
      avatar: 'https://i.pravatar.cc/80?img=32',
      level: 'Speed Pro',
      points: 8740
    }
  ]);

  announcements = signal<Announcement[]>([
    { message: 'New Typing Challenge starts tomorrow 9 AM' },
    { message: 'Top 10 students will receive achievement badges this week' }
  ]);

  /* 
  Replace dummy data later:

  constructor(private leaderboardService: LeaderboardService){}

  ngOnInit(){
    this.leaderboard.set(this.leaderboardService.students());
    this.announcements.set(this.leaderboardService.announcements());
  }
  */

}