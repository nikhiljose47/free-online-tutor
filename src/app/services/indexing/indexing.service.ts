import { Injectable, inject } from '@angular/core';
import { Observable, of, map, switchMap } from 'rxjs';
import { FirestoreDocService } from '../fire/firestore-doc.service';


@Injectable({ providedIn: 'root' })
export class IndexingService {
  private fire = inject(FirestoreDocService);

  getCurrentChapterCode$(
    batchId: string,
    subjectCode: string
  ): Observable<string | null> {
    if (!batchId || !subjectCode) return of(null);

    return this.fire.getOnce<Record<string, any>>('index', batchId).pipe(
      map((res) => {
        if (!res.ok || !res.data) return null;

        const data = res.data as Record<string, any>;
        const arr = data[subjectCode];

        /* must be array with index 0 */
        if (!Array.isArray(arr) || !arr.length) return null;

        return arr[0] ?? null;
      })
    );
  }
}
