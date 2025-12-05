import { Component, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
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

@Component({
  selector: 'class-stream-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './class-stream-sidebar.html',
  styleUrl: './class-stream-sidebar.scss',
    host: {
    '[class.collapsed]': 'collapsed()'   // ← THIS ENABLES THE LAYOUT
  }
})
export class ClassStreamSidebar implements OnDestroy {
  live = signal<any[]>([]);
  upcoming = signal<any[]>([]);

  private sub = new Subscription();
collapsed = signal(false);

toggleSidebar() {
  this.collapsed.update(v => !v);
}
  constructor(
    private firestore: Firestore,
    private fire: FirestoreDocService,
    private router: Router
  ) {
    // this.loadLive();
    // this.loadUpcoming();

    this.fire
      .where<any>('global_meetings', 'status', '==', UPCOMING, 5)
      .subscribe((res) => res && this.upcoming.set(res.data));

    this.sub.add(
      this.fire
        .realtimeWhere<any>('global_meetings', 'status', '==', LIVE)
        .subscribe((res) => this.live.set(res.data))
    );
  }

  private loadLive() {
    const q = query(
      collection(this.firestore, 'global_meetings'),
      where('status', '==', 'live'),
      orderBy('date', 'asc')
    );

    onSnapshot(q, (snap) => {
      this.live.set(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
  }

  private loadUpcoming() {
    const q = query(
      collection(this.firestore, 'global_meetings'),
      where('status', '==', 'upcoming'),
      orderBy('date', 'asc'),
      limit(5)
    );

    onSnapshot(q, (snap) => {
      this.upcoming.set(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
  }

  onClick(item: any) {
    console.log('Open stream/class:', item);
    this.router.navigate(['/join-tution']);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
