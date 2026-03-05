import { Component, signal } from '@angular/core';
import { Auth2Service } from '../../core/services/fire/auth2.service';
import { ToastService } from '../../shared/toast.service';
import { Router } from '@angular/router';
import { FirestoreDocService } from '../../core/services/fire/firestore-doc.service';
import { UserModel } from '../../models/fire/user.model';

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
        photoUrl: null,
        phone: '9876543210',
        abilities: ['mentoring', 'problem-solving'],
        skills: ['Angular', 'TypeScript', 'Firebase'],
        expList: ['CBSE Coaching', 'Online Tutoring'],
        expYrs: 4,
        subjects: ['Math', 'Physics'],
        bio: 'Passionate educator with strong fundamentals.',
        rating: 4.5,
        weekPerformance: 'good',
        specialization: ['Algebra', 'Trigonometry'],
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
