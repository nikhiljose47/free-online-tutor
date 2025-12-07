import { Injectable, effect, inject, signal } from '@angular/core';
import { Firestore, doc, docData } from '@angular/fire/firestore';
import { Auth2Service } from './auth2.service';
import { UserProfile } from '../../models/user-profile.model';

@Injectable({ providedIn: 'root' })
export class UserProfileService {
  private db = inject(Firestore);
  private auth = inject(Auth2Service);

  profile = signal<UserProfile | null>(null);

  constructor() {
    effect(() => {
      const firebaseUser = this.auth.user();

      if (!firebaseUser) {
        this.profile.set(null);
        return;
      }

      const ref = doc(this.db, 'users', firebaseUser.uid);
      docData(ref).subscribe((data) => {
        this.profile.set(data as UserProfile);
      });
    });
  }
}
