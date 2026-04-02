import { Component, ChangeDetectionStrategy, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserProfileService } from '../../core/services/fire/user-profile.service';
import { ToastService } from '../../shared/toast.service';
import { AVATARS } from '../../core/constants/app.constants';

@Component({
  selector: 'avatar-picker',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './avatar-picker.html',
  styleUrl: './avatar-picker.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvatarPickerComponent implements OnInit {
  private profileSvc = inject(UserProfileService);
  private toast = inject(ToastService);

  readonly profile = this.profileSvc.profile;
  readonly selectedAvatar = signal<string | null>(null);
  readonly saving = signal(false);
  readonly avatars = AVATARS;

  ngOnInit(): void {
    const p = this.profile();
    if (p) {
      this.selectedAvatar.set((p as any)?.avatarId ?? null);
    }
  }

  selectAvatar(id: string) {
    this.selectedAvatar.set(id);
  }

  saveProfile() {
    const avatarId = this.selectedAvatar();

    if (!avatarId || this.saving()) return;

    this.saving.set(true);

    // this.profileSvc.updateProfile({
    //   avatarId
    // }).subscribe({
    //   next: () => {
    //     this.toast.show('Profile updated');
    //     this.saving.set(false);
    //   },
    //   error: () => {
    //     this.toast.show('Update failed');
    //     this.saving.set(false);
    //   }
    // });
  }

  getAvatarUrl(id: string) {
    return `assets/avatars/${id}.svg`;
  }
}
