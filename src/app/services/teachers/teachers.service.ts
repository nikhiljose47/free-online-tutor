import { inject, Injectable } from '@angular/core';
import { FireResponse, FirestoreDocService } from '../fire/firestore-doc.service';
import { map, Observable } from 'rxjs';
import { UserModel } from '../../models/fire/user.model';

@Injectable({
  providedIn: 'root',
})
export class TeachersService {
  private fire = inject(FirestoreDocService);

  getTeachers$(): Observable<UserModel[]> {
    return this.fire.where<UserModel>('users', 'role', '==', 'teacher', 100).pipe(
      map((res: FireResponse<UserModel>) => {
        if (!res.ok || !Array.isArray(res.data)) return [];
        return res.data as UserModel[];
      }),
    );
  }

  getTeacherByUid$(uid: string): Observable<UserModel | null> {
    if (!uid) return new Observable((obs) => obs.next(null));  //=== if (!uid) return of(null);

    return this.fire
      .getOnce<UserModel>('users', uid)
      .pipe(map((res) => (res.ok && res.data ? (res.data as UserModel) : null)));
  }
}
