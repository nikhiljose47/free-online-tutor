import { inject, Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';

import { GlobalMeetingsViewModel } from '../global-meetings-viewmodel/global-meetings-viewmodel';
import { FireResponse } from '../../../core/services/fire/firestore-doc.service';
import { Meeting } from '../../../models/meeting.model';
import { GlobalMeetingsStoreService } from '../global-meetings-store/global-meetings-store.service';

@Injectable({ providedIn: 'root' })
export class GlobalMeetingsService {
  private vm = inject(GlobalMeetingsViewModel);
  private repo = inject(GlobalMeetingsStoreService);

  // --------------------------------------------------
  // ✅ DEFAULT: FROM VIEWMODEL (CACHED + OPTIMIZED)
  // --------------------------------------------------
  getMeetings$(): Observable<FireResponse<Meeting[]>> {
    return this.vm.vm$.pipe(
      map((vm) => ({
        ok: true,
        data: [...vm.live, ...vm.upcoming],
      })),
    );
  }

  getLiveMeetings$(): Observable<FireResponse<Meeting[]>> {
    return this.vm.vm$.pipe(
      map((vm) => ({
        ok: true,
        data: vm.live,
      })),
    );
  }

  getUpcomingMeetings$(): Observable<FireResponse<Meeting[]>> {
    return this.vm.vm$.pipe(
      map((vm) => ({
        ok: true,
        data: vm.upcoming,
      })),
    );
  }

  getMeetingsByClassId$(classId: string) {
    return this.vm.vm$.pipe(
      map((vm) => ({
        ok: true,
        data: [...vm.live, ...vm.upcoming].filter((m) => m.classId === classId),
      })),
    );
  }
}
