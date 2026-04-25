import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  computed,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { shareReplay } from 'rxjs';

import { SessionService } from '../../services/session.service';
import { UserProfileService } from '../../core/services/fire/user-profile.service';
import { UserProfileContentComponent } from '../../components/user-profile-content/user-profile-content/user-profile-content.component';

type TabType = 'overview' | 'profile' | 'photo' | 'bookings' | 'points' | 'security';

@Component({
  selector: 'user-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, UserProfileContentComponent],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserProfile implements OnInit {
  private svc = inject(SessionService);
  private router = inject(Router);
  private profileSvc = inject(UserProfileService);

  /* ---------- STATE ---------- */
  readonly isEdit = signal(false);
  readonly activeTab = signal<TabType>('overview');
  readonly selectedAvatar = signal<string | null>(null);

  editable: { email?: string } = {};

  /* ---------- PROFILE ---------- */
  readonly profile = this.profileSvc.profile; // assumed Signal<User>

  /* ---------- RXJS (initial load optimized) ---------- */
  private bookings$ = this.svc.getBookings().pipe(shareReplay({ bufferSize: 1, refCount: true }));

  readonly bookings = toSignal(this.bookings$, {
    initialValue: [] as {
      id: string;
      sessionId: string;
      status: string;
      sessionTitle: string;
      startAt: string;
    }[],
  });

  /* ---------- DUMMY (replace with API later) ---------- */
  readonly pointsList = signal<{ title: string; value: number }[]>([
    { title: 'Session Attendance', value: 20 },
    { title: 'Assignment', value: 15 },
    { title: 'Quiz', value: 10 },
  ]);

  readonly totalPoints = computed(() => this.pointsList().reduce((a, b) => a + b.value, 0));

  readonly popularity = signal<number>(78);

  ngOnInit(): void {
    const p = this.profile();
    if (p) {
      this.selectedAvatar.set((p as any)?.avatarId ?? null);
      this.editable = { email: (p as any)?.email };
    }
  }

  /* ---------- PROFILE ---------- */
  toggleEdit() {
    this.isEdit.update((v) => !v);
    const p = this.profile();
    this.editable = { email: (p as any)?.email };
  }

  saveProfile() {
    const updated = {
      ...this.profile(),
      ...this.editable,
      avatarId: this.selectedAvatar(),
    };

    // replace → this.profileSvc.updateProfile(updated)
    this.isEdit.set(false);
  }

  /* ---------- NAV ---------- */
  setTab(tab: TabType) {
    this.activeTab.set(tab);
  }

  goToSession(sessionId: string) {
    this.router.navigate(['/class', sessionId]);
  }
}
