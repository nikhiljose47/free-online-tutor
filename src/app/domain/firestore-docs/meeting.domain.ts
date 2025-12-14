import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { FireResponse, FirestoreDocService } from '../../services/fire/firestore-doc.service';
import { GLOBAL_MEETINGS } from '../../core/constants/app.constants';

@Injectable({ providedIn: 'root' })
export class MeetingDomainService {
  private fire = inject(FirestoreDocService);

  listenActiveMeetings(): Observable<FireResponse<any[]>> {
    return this.fire.realtimeNotEnded<any>(GLOBAL_MEETINGS);
  }
}
