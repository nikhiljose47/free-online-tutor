import { Auth2Service } from './auth2.service';
import { UserProfile } from '../../models/user-profile.model';
import { effect, Injectable, signal } from '@angular/core';
import { FirestoreDocService } from './firestore-doc.service';

@Injectable({ providedIn: 'root' })
export class UserProfileService {
  profile = signal<UserProfile | null>(null);

  constructor(private fire: FirestoreDocService, private auth: Auth2Service) {
    effect(() => {
      const user = this.auth.user();

      if (!user) {
        this.profile.set(null);
        return;
      }
      this.fire.getOnce('users', user.uid).subscribe((res) => {
        let profile = res.data as UserProfile;
        profile.uid = user.uid;
        this.profile.set(profile);
      });
    });
  }
}
