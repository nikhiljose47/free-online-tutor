import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Auth2Service } from '../../../core/services/fire/auth2.service';
import { ToastService } from '../../toast.service';
import { debounceTime, Subject } from 'rxjs';
import { UserRegisterService } from '../../../services/user/user-register/user-register.service';

@Component({
  selector: 'auth-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './auth-panel.component.html',
  styleUrls: ['./auth-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthPanelComponent {
  private registerService = inject(UserRegisterService);

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
  register() {
    if (this.loading()) return;

    this.loading.set(true);

    this.registerService
      .registerUser({
        name: this.name(),
        email: this.email(),
        password: this.password(),
        confirmPassword: this.confirmPassword(),
      })
      .subscribe((res) => {
        this.loading.set(false);

        if (res.ok) {
          this.toast.show(res.message!);
          this.router.navigateByUrl('');
        } else {
          this.toast.show(res.message ?? '');
        }
      });
  }
}
