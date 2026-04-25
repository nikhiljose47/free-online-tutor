import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Signal,
  WritableSignal,
  inject,
} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserProfileContentAvatarComponent } from '../user-profile-content-avatar/user-profile-content-avatar.component';
import { AvatarPickerComponent } from '../../avatar-picker/avatar-picker';
import { ChangePasswordComponent } from '../../../shared/components/change-password.component/change-password.component';

type TabType = 'overview' | 'profile' | 'photo' | 'bookings' | 'points' | 'security';

@Component({
  selector: 'user-profile-content',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    UserProfileContentAvatarComponent,
    AvatarPickerComponent,
    ChangePasswordComponent,
    DatePipe,
  ],
  templateUrl: './user-profile-content.component.html',
  styleUrl: './user-profile-content.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserProfileContentComponent {
  private router = inject(Router);

  @Input({ required: true }) activeTab!: WritableSignal<TabType>;
  @Input({ required: true }) isEdit!: WritableSignal<boolean>;

  @Input({ required: true }) profile!: Signal<any>;
  @Input({ required: true }) bookings!: Signal<any[]>; // ✅ MUST be Signal

  @Input({ required: true }) selectedAvatar!: WritableSignal<string | null>;
  @Input({ required: true }) pointsList!: Signal<{ title: string; value: number }[]>;
  @Input({ required: true }) totalPoints!: () => number;
  @Input({ required: true }) popularity!: Signal<number>;

  @Input({ required: true }) editable!: any;

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
