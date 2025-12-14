import {
  Injectable,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import {
  Firestore,
  doc,
  docData,
} from '@angular/fire/firestore';
import { Subscription } from 'rxjs';
import { Auth2Service } from './auth2.service';
import { UserProfile } from '../../models/user-profile.model';

@Injectable({ providedIn: 'root' })
export class UserProfileService {
  private db = inject(Firestore);
  private auth = inject(Auth2Service);

  profile = signal<UserProfile | null>(null);

  private sub?: Subscription;

  constructor() {
    effect(() => {
      const uid = this.auth.uid;

      // 🔑 cleanup previous subscription
      this.sub?.unsubscribe();
      this.sub = undefined;

      if (!uid) {
        this.profile.set(null);
        return;
      }

      const ref = doc(this.db, 'users', uid);

      this.sub = docData(ref).subscribe((data) => {
        if (!data) {
          this.profile.set(null);
          return;
        }

        // 🔑 explicitly attach document ID
        this.profile.set({
          ...(data as UserProfile),
        });
      });
    });
  }
}
