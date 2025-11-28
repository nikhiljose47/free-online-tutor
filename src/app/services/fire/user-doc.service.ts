import { Injectable } from '@angular/core';
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';
import { AppUser } from '../../models/app-user.model';

@Injectable({ providedIn: 'root' })
export class UserDocService {
  constructor(private db: Firestore) {}

  getUser(uid: string) {
    return getDoc(doc(this.db, 'users', uid))
      .then(snap => snap.exists() ? snap.data() as AppUser : null)
      .catch(() => null);
  }

  createUserDoc(user: AppUser) {
    return setDoc(doc(this.db, 'users', user.uid), user)
      .then(() => ({ ok: true }))
      .catch(err => ({ ok: false, message: err.message }));
  }
}
