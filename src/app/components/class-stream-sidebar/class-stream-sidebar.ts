import {
  Component,
  inject,
  OnDestroy,
  signal,
  computed,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { FirestoreDocService } from '../../services/fire/firestore-doc.service';
import { SelectedMeetingService } from '../../services/shared/selected-meeting.service';
import { LiveMeetingStore } from '../../stores/meetings/meeting.store';

@Component({
  selector: 'class-stream-sidebar',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './class-stream-sidebar.html',
  styleUrl: './class-stream-sidebar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClassStreamSidebar implements OnDestroy {
  private fire = inject(FirestoreDocService);
  private router = inject(Router);
  private selected = inject(SelectedMeetingService);
  private store = inject(LiveMeetingStore);

  collapsed = signal(false);
  allMeetings = signal<any[]>([]);
  now = signal(new Date());
  private ticking: any;

  constructor() {
    // Real-time single query
    const start = new Date(Date.now() - 2 * 60 * 60_000);
    const end = new Date(Date.now() + 12 * 60 * 60_000);

    this.fire
      .realtimeMultiWhere<any>('global_meetings', [
        { field: 'date', op: '>=', value: start },
        { field: 'date', op: '<=', value: end },
      ])
      .subscribe((res) => {
        this.allMeetings.set(res.data);
      });

    // Time ticker for dynamic classification
    this.ticking = setInterval(() => {
      this.now.set(new Date());
    }, 30_000);
  }

  // Computed Buckets
  live = computed(() => {
    const n = this.now();
    return this.allMeetings().filter(m => m.date <= n && m.endAt >= n);
  });

  upcoming = computed(() => {
    const n = this.now();
    return this.allMeetings()
      .filter(m => m.date > n)
      .sort((a, b) => a.date - b.date)
      .slice(0, 5);
  });

  onClick(item: any) {
    this.selected.setSelected(item);
    this.router.navigate(['/join-tution']);
  }

  toggleSidebar() {
    this.collapsed.update(v => !v);
  }

  ngOnDestroy() {
    clearInterval(this.ticking);
  }
}
