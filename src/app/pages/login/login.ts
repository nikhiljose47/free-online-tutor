import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/fire/auth.service';
import { Router } from '@angular/router';
import { Auth2Service } from '../../services/fire/auth2.service';
import { Toast } from '../../components/toast/toast';
import { ToastService } from '../../services/toast.service';

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
      console.log('Logged in:', res.user.uid);
      // navigate
      this.router.navigate(['/home']);
    } else {
      this.toast.show('Invalid Login');
    }
    //console.log(x);
    // this.auth.login(userName).subscribe(() => {
    //   this.router.navigate(['/dashboard']);
    // });
  }

  async doRegister() {
    const userName = this.name().trim();
    if (!userName) return alert('Enter name');

    const res = await this.auth2.register(this.name(), this.pswd());

    if (res.success && res.user) {
      console.log('Logged in:', res.user.uid);
      // navigate
      this.router.navigate(['/home']);
    } else {
      this.toast.show('Invalid Login');
    }
    // this.auth.register(userName).subscribe(() => {
    //   this.router.navigate(['/dashboard']);
    // });
  }
}
