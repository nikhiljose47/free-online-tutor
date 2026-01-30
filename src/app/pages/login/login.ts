import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/fire/auth.service';
import { Router } from '@angular/router';
import { Auth2Service } from '../../services/fire/auth2.service';
import { Toast } from '../../components/toast/toast';
import { ToastService } from '../../shared/toast.service';

@Component({
  selector: 'login',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login.html',
})
export class LoginComponent {
  name = signal('');
  pswd = signal('');
  constructor(
    private auth: AuthService,
    private auth2: Auth2Service,
    private router: Router,
    private toast: ToastService
  ) {}

  // safe handler → avoids parser errors
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

    const res = await this.auth2.login(this.name(), this.pswd());

    if (res.success && res.user) {
      this.toast.show('Success!!');
      this.router.navigate([''], { replaceUrl: true });
    } else {
      this.toast.show('Invalid Login');
    }
  }
}
