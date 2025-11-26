import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Auth2Service } from '../../services/auth2.service';

@Component({
  selector: 'login',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mt-4" style="max-width:480px;">
      <div class="card p-4">
        <h5 class="mb-3">Login / Register</h5>

        <!-- Input using signal (SAFE & PARSER-ERROR FREE) -->
        <input
          class="form-control mb-2"
          placeholder="Your name"
          [value]="name()"
          (input)="onInput($event)"
        />
        <input
          class="form-control mb-2"
          placeholder="Your psws"
          [value]="pswd()"
          (input)="onInputP($event)"
        />
        <div class="d-flex gap-2 mt-2">
          <button class="btn btn-primary" (click)="doLogin()">Login</button>
          <button class="btn btn-outline-secondary" (click)="doRegister()">Register</button>
        </div>
      </div>
    </div>
  `,
})
export class LoginComponent {
  name = signal('');
  pswd = signal('');
  constructor(private auth: AuthService, private auth2: Auth2Service, private router: Router) {}

  // safe handler → avoids parser errors
  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.name.set(input.value);
  }

  onInputP(event: Event) {
    const input = event.target as HTMLInputElement;
    this.pswd.set(input.value);
  }

  doLogin() {
    const userName = this.name().trim();
    if (!userName) return alert('Enter name');

    const x = this.auth2.login(this.name(), this.pswd());
    console.log(x);
    // this.auth.login(userName).subscribe(() => {
    //   this.router.navigate(['/dashboard']);
    // });
  }

  doRegister() {
    const userName = this.name().trim();
    if (!userName) return alert('Enter name');

    this.auth.register(userName).subscribe(() => {
      this.router.navigate(['/dashboard']);
    });
  }
}
