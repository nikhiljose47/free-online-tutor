import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Auth2Service } from '../../../core/services/fire/auth2.service';
import { ToastService } from '../../toast.service';

@Component({
  selector: 'change-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChangePasswordComponent {

  private auth = inject(Auth2Service);
  private toast = inject(ToastService);

  readonly loading = signal(false);

  form = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  changePassword() {

    if (!this.form.currentPassword || !this.form.newPassword) {
      this.toast.show('Fill all fields');
      return;
    }

    if (this.form.newPassword !== this.form.confirmPassword) {
      this.toast.show('Passwords do not match');
      return;
    }

    if (this.form.newPassword.length < 6) {
      this.toast.show('Password must be at least 6 characters');
      return;
    }

     this.loading.set(true);
   //todo: implement change password logic in auth service and uncomment below code
    // this.auth.changePassword(
    //   this.form.currentPassword,
    //   this.form.newPassword
    // ).subscribe({
    //   next: () => {
    //     this.toast.show('Password updated');
    //     this.loading.set(false);

    //     this.form = {
    //       currentPassword: '',
    //       newPassword: '',
    //       confirmPassword: ''
    //     };
    //   },
    //   error: () => {
    //     this.toast.show('Failed to update password');
    //     this.loading.set(false);
    //   }
    // });

  }

}