import { Component, signal } from '@angular/core';
import { Auth2Service } from '../../services/fire/auth2.service';
import { ToastService } from '../../services/toast.service';
import { Router } from '@angular/router';
import { FirestoreDocService } from '../../services/fire/firestore-doc.service';

interface UserProfile {
  uid: string;
  name: string;
  email: string;
  createdAt: number;
  role: 'user' | 'admin';
}

@Component({
  selector: 'register',
  standalone: true,
  templateUrl: './register.html',
  styleUrls: ['./register.scss'],
})
export class Register {
  constructor(
    private auth: Auth2Service,
    private toast: ToastService,
    private router: Router,
    private fire: FirestoreDocService
  ) {}

  name = signal('');
  email = signal('');
  password = signal('');
  role = signal<'student' | 'teacher'>('student');

  async register() {
    const userName = this.name().trim();
    if (!userName) return alert('Enter name');

    const res = await this.auth.register(this.email(), this.password());

    if (res.success && res.user) {
      const uid = res.user.uid;
      this.toast.show('Registed!. Creating setup..');

      const userDoc: UserProfile = {
        uid,
        name: this.name(),
        email: res.user.email ?? '',
        createdAt: Date.now(),
        role: 'user',
      };

      this.fire.set<UserProfile>('users', uid, userDoc).subscribe((saveRes) => {
        if (saveRes.ok) {
          this.router.navigateByUrl('');
        } else {
          this.toast.show(saveRes?.message ?? '');
        }
      });
      this.toast.show('Success');
      this.router.navigate([''], { replaceUrl: true });
    } else {
      this.toast.show(res.message);
    }
  }
}
