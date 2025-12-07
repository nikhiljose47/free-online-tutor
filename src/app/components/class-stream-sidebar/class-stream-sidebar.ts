import { Component, OnDestroy, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import {
  Firestore,
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  limit,
} from '@angular/fire/firestore';
import { FirestoreDocService } from '../../services/fire/firestore-doc.service';
import { LIVE, UPCOMING } from '../../core/constants/app.constants';
import { Meeting } from '../../models/meeting.model';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { SelectedMeetingService } from '../../services/shared/selected-meeting.service';

@Component({
  selector: 'class-stream-sidebar',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './class-stream-sidebar.html',
  styleUrl: './class-stream-sidebar.scss',
  host: {
    '[class.collapsed]': 'collapsed()', // ← THIS ENABLES THE LAYOUT
  },
})
export class ClassStreamSidebar implements OnDestroy {
  live = signal<any[]>([]);
  upcoming = signal<any[]>([]);

  private sub = new Subscription();
  collapsed = signal(false);

  toggleSidebar() {
    this.collapsed.update((v) => !v);
  }
  constructor(
    private firestore: Firestore,
    private fire: FirestoreDocService,
    private router: Router,
      private selectedMeeting: SelectedMeetingService

  ) {
    const nowPlus35Min = new Date(Date.now() + 35 * 60 * 1000);

    this.fire
      .where<any>('global_meetings', 'date', '>=', nowPlus35Min, 5)
      .subscribe((res) => res && this.upcoming.set(res.data));

    const now = new Date();
    const thirtyFiveMinAgo = new Date(Date.now() - 35 * 60 * 1000);

    this.fire
      .multiWhere<any>('global_meetings', [
        { field: 'date', op: '<=', value: now },
        { field: 'date', op: '>=', value: thirtyFiveMinAgo },
      ])
      .subscribe((res) => {
        this.live.set(res.data);
      });
  }

  onClick(item: any) {
    this.selectedMeeting.setSelected(item);
    this.router.navigate(['/join-tution']);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
