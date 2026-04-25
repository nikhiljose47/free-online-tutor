import { Component, signal } from '@angular/core';
import { Auth2Service } from '../../core/services/fire/auth2.service';
import { ToastService } from '../../shared/toast.service';
import { Router } from '@angular/router';
import { FirestoreDocService } from '../../core/services/fire/firestore-doc.service';
import { UserModel } from '../../models/fire/user.model';
import { DEF_AVATAR_ID } from '../../core/constants/app.constants';

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
    private fire: FirestoreDocService,
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

      const userDoc: UserModel = {
        uid,
        name: this.name(),
        email: res.user.email ?? '',
        joinedAt: Date.now(),
        role: 'student',
        age: 26,
        avatarId: DEF_AVATAR_ID,
        photoUrl: null,
        phone: '9876543210',
        enrolledClassIds: [],
           totalPoints: 0,
          seasonPoints: 0,
          seasonId: '',
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
