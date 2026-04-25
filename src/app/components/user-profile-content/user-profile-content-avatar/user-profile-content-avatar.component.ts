import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Signal,
  WritableSignal,
  computed,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AVATARS } from '../../../core/constants/app.constants';

type TabType = 'overview' | 'profile' | 'photo' | 'bookings' | 'points' | 'security';

@Component({
  selector: 'user-profile-content-avatar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-profile-content-avatar.component.html',
  styleUrl: './user-profile-content-avatar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserProfileContentAvatarComponent {
  @Input({ required: true }) selectedAvatar!: WritableSignal<string | null>;
  @Input({ required: true }) profile!: Signal<any>;
  @Input({ required: true }) activeTab!: WritableSignal<TabType>;

  readonly avatars = AVATARS;

  readonly showGrid = signal(false);

  readonly avatarSrc = computed(() => {
    const id = this.selectedAvatar();
    return id ? `assets/avatars/${id}.svg` : null;
  });

  readonly displayName = computed(() => this.profile()?.name || 'Student');
  readonly displayEmail = computed(() => this.profile()?.email || 'student@email.com');

  toggleGrid() {
    this.showGrid.update(v => !v);
  }

  selectAvatar(id: string) {
    this.selectedAvatar.set(id);
    this.showGrid.set(false);
  }
}