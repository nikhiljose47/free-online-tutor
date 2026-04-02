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
import { AvatarPickerComponent } from '../../components/avatar-picker/avatar-picker';
import { ChangePasswordComponent } from '../../shared/components/change-password.component/change-password.component';

type TabType = 'overview' | 'profile' | 'photo' | 'bookings' | 'points' | 'security';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, AvatarPickerComponent, ChangePasswordComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {
  private svc = inject(SessionService);
  private router = inject(Router);
  private profileSvc = inject(UserProfileService);

  /* ---------- STATE ---------- */
  readonly isEdit = signal(false);
  readonly activeTab = signal<TabType>('overview');
  readonly selectedAvatar = signal<string | null>(null);

  editable: any = {};

  /* ---------- PROFILE ---------- */
  readonly profile = this.profileSvc.profile;

  /* ---------- RXJS (initial load optimized) ---------- */
  private bookings$ = this.svc.getBookings().pipe(shareReplay(1));

  readonly bookings = toSignal(this.bookings$, { initialValue: [] as any[] });

  /* ---------- DUMMY (replace with API later) ---------- */
  readonly pointsList = signal([
    { title: 'Session Attendance', value: 20 },
    { title: 'Assignment', value: 15 },
    { title: 'Quiz', value: 10 },
  ]);

  readonly totalPoints = computed(() => this.pointsList().reduce((a, b) => a + b.value, 0));

  readonly popularity = signal(78); // replace with API later

  ngOnInit(): void {
    const p = this.profile();
    if (p) {
      this.selectedAvatar.set((p as any)?.avatarId ?? null);
      this.editable = { ...p };
    }
  }

  /* ---------- PROFILE ---------- */
  toggleEdit() {
    this.isEdit.update((v) => !v);
    this.editable = { ...this.profile() };
  }

  saveProfile() {
    const updated = {
      ...this.editable,
      avatarId: this.selectedAvatar(),
    };

    // replace: this.profileSvc.updateProfile(updated)
    this.isEdit.set(false);
  }

  /* ---------- NAV ---------- */
  setTab(tab: TabType) {
    this.activeTab.set(tab);
  }

  goToSession(sessionId: string) {
    this.router.navigate(['/class', sessionId]);
  }

  /* ---------- HELPERS ---------- */
  getAvatarUrl(id: string) {
    return `assets/avatars/avatar-${id}.svg`;
  }
}
