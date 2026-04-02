import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Auth2Service } from '../../../core/services/fire/auth2.service';
import { ToastService } from '../../toast.service';
import { FirestoreDocService } from '../../../core/services/fire/firestore-doc.service';
import { UserModel } from '../../../models/fire/user.model';
import { debounceTime, Subject } from 'rxjs';
import { DEF_AVATAR_ID } from '../../../core/constants/app.constants';

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
  confirmPassword = signal('');

  loading = signal(false);

  private login$ = new Subject<void>();
  private register$ = new Subject<void>();

  constructor(
    private auth: Auth2Service,
    private router: Router,
    private toast: ToastService,
    private fire: FirestoreDocService,
  ) {
    this.login$.pipe(debounceTime(500)).subscribe(() => this.doLogin());
    this.register$.pipe(debounceTime(500)).subscribe(() => this.register());
  }

  // ---------- INPUTS ----------
  onInput(e: Event) {
    this.name.set((e.target as HTMLInputElement).value);
  }

  onInputP(e: Event) {
    this.pswd.set((e.target as HTMLInputElement).value);
  }

  onInputEmail(e: Event) {
    this.email.set((e.target as HTMLInputElement).value);
  }

  onInputPassword(e: Event) {
    this.password.set((e.target as HTMLInputElement).value);
  }

  onInputConfirmPassword(e: Event) {
    this.confirmPassword.set((e.target as HTMLInputElement).value);
  }

  // ---------- SUBMIT HANDLERS ----------
  onLoginSubmit() {
    if (this.loading()) return;
    this.login$.next();
  }

  onRegisterSubmit() {
    if (this.loading()) return;
    this.register$.next();
  }

  // ---------- LOGIN ----------
  async doLogin() {
    if (this.loading()) return;

    const userName = this.name().trim();
    if (!userName) return this.toast.show('Enter name');

    this.loading.set(true);

    try {
      const res = await this.auth.login(this.name(), this.pswd());

      if (res.success && res.user) {
        this.toast.show('Success!!');
        this.router.navigate([''], { replaceUrl: true });
      } else {
        this.toast.show('Invalid Login');
      }
    } finally {
      this.loading.set(false);
    }
  }

  // ---------- REGISTER ----------
  async register() {
    if (this.loading()) return;

    const userName = this.name().trim();
    if (!userName) return this.toast.show('Enter name');

    if (this.password() !== this.confirmPassword()) {
      return this.toast.show('Passwords do not match');
    }

    this.loading.set(true);

    try {
      const res = await this.auth.register(this.email(), this.password());

      if (res.success && res.user) {
        const uid = res.user.uid;

        const userDoc: UserModel = {
          uid,
          name: this.name(),
          email: res.user.email ?? '',
          avatarId: DEF_AVATAR_ID,
          joinedAt: Date.now(),
          role: 'student',
          age: 26,
          photoUrl: null,
          phone: '',
          enrolledClassIds: [],
          totalPoints: {
            identifier: 'initial',
            points: 0,
          },
          points: {
            identifier: 'initial',
            points: 0,
          },
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
          this.loading.set(false);

          if (saveRes.ok) {
            this.toast.show('Account created');
            this.router.navigateByUrl('');
          } else {
            this.toast.show(saveRes?.message ?? '');
          }
        });
      } else {
        this.toast.show(res.message);
        this.loading.set(false);
      }
    } catch {
      this.loading.set(false);
      this.toast.show('Something went wrong');
    }
  }
}
