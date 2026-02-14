import { Auth2Service } from './auth2.service';
import { effect, Injectable, signal } from '@angular/core';
import { FirestoreDocService } from './firestore-doc.service';
import { UserModel } from '../../models/fire/user.model';

@Injectable({ providedIn: 'root' })
export class UserProfileService {
  profile = signal<UserModel | null>(null);

  constructor(
    private fire: FirestoreDocService,
    private auth: Auth2Service,
  ) {
    effect(() => {
      const user = this.auth.user();

      if (!user) {
        this.profile.set(null);
        return;
      }
      this.fire.getOnce('users', user.uid).subscribe((res) => {
        if (res.ok && res.data) {
          const profile = res.data as UserModel;
          profile.uid = user.uid;
          this.profile.set(profile);
        } else {
          this.profile.set(null);
        }
      });
    });
  }
}
