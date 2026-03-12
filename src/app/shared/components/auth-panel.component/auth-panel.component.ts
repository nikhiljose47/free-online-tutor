import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Auth2Service } from '../../../core/services/fire/auth2.service';
import { ToastService } from '../../toast.service';
import { FirestoreDocService } from '../../../core/services/fire/firestore-doc.service';
import { UserModel } from '../../../models/fire/user.model';

@Component({
  selector: 'auth-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './auth-panel.component.html',
  styleUrls: ['./auth-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthPanelComponent {


  mode = signal<'login' | 'signup'>('login');

  name = signal('');
  pswd = signal('');
  email = signal('');
  password = signal('');

  constructor(
    private auth: Auth2Service,
    private router: Router,
    private toast: ToastService,
    private fire: FirestoreDocService,
  ) {}

  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.name.set(input.value);
  }

  onInputP(event: Event) {
    const input = event.target as HTMLInputElement;
    this.pswd.set(input.value);
  }

  async doLogin() {
    const userName = this.name().trim();
    if (!userName) return alert('Enter name');

    const res = await this.auth.login(this.name(), this.pswd());

    if (res.success && res.user) {
      this.toast.show('Success!!');
      this.router.navigate([''], { replaceUrl: true });
    } else {
      this.toast.show('Invalid Login');
    }
  }
  onInputEmail(event: Event) {
    const input = event.target as HTMLInputElement;
    this.email.set(input.value);
  }

  onInputPassword(event: Event) {
    const input = event.target as HTMLInputElement;
    this.password.set(input.value);
  }
  async register() {
    const userName = this.name().trim();
    if (!userName) return alert('Enter name');

    const res = await this.auth.register(this.email(), this.password());

    if (res.success && res.user) {
      const uid = res.user.uid;

      const userDoc: UserModel = {
        uid,
        name: this.name(),
        email: res.user.email ?? '',
        joinedAt: Date.now(),
        role: 'student',
        age: 26,
        photoUrl: null,
        phone: '',
        abilities: [],
        skills: [],
        expList: [],
        expYrs: 0,
        subjects: [],
        bio: '',
        rating: 0,
        weekPerformance: 'good',
        specialization: [],
        meta: {},
        lastSession: null,
        updatedAt: null,
      };

      this.fire.set<UserModel>('users', uid, userDoc).subscribe((saveRes) => {
        if (saveRes.ok) {
          this.toast.show('Account created');
          this.router.navigateByUrl('');
        } else {
          this.toast.show(saveRes?.message ?? '');
        }
      });
    } else {
      this.toast.show(res.message);
    }
  }

  async guestLogin() {
    // const res = await this.auth.loginGuest();
    // if (res.success) {
    //   this.toast.show('Guest session started');
    //   this.router.navigate([''], { replaceUrl: true });
    // } else {
    //   this.toast.show('Unable to start guest session');
    // }
  }
}
