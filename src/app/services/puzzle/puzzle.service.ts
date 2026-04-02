import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of, from, Observable } from 'rxjs';
import { map, switchMap, tap, catchError, shareReplay } from 'rxjs/operators';
import { PuzzleIndex, PuzzleIndexFile } from '../../models/puzzle/puzzle-index.model';
import { IndexedDbService } from '../../core/services/cache/db/indexed-db.service';
import { PuzzleCollection } from '../../models/puzzle/puzzle.model';


type PuzzleIndexDB = PuzzleIndex & { id: string };
type PuzzleCollectionDB = PuzzleCollection & { id: string };

@Injectable({ providedIn: 'root' })
export class PuzzleService {
  private http = inject(HttpClient);
  private idb = inject(IndexedDbService);

  private indexSig = signal<PuzzleIndex | null>(null);

  private INDEX_ID = 'puzzle_index';

  // -------- INDEX --------
  getIndex(): Observable<PuzzleIndex> {
    if (this.indexSig()) return of(this.indexSig()!);

    return from(this.idb.get<PuzzleIndexDB>('syllabus_index', this.INDEX_ID)).pipe(
      switchMap(cached => {
        if (cached) {
          this.indexSig.set(cached);
          return of(cached);
        }

        return this.http.get<PuzzleIndex>('/assets/puzzles/puzzles.index.json').pipe(
          tap(res => {
            this.indexSig.set(res);
            this.idb.set<PuzzleIndexDB>('syllabus_index', {
              ...res,
              id: this.INDEX_ID
            });
          })
        );
      }),
      shareReplay(1)
    );
  }

  // -------- PUZZLE FILE --------
  getPuzzleCollection(classId: string, subjectCode: string): Observable<PuzzleCollection> {
    const cacheId = this.getCacheId(classId, subjectCode);

    return from(this.idb.get<PuzzleCollectionDB>('puzzle_sessions', cacheId)).pipe(
      switchMap(cached => {
        if (cached) return of(cached);

        return this.getIndex().pipe(
          map(index => this.findFile(index.files, classId, subjectCode)),
          switchMap(file => {
            if (!file) return of(this.empty(classId, subjectCode));

            return this.http.get<PuzzleCollection>(`/assets/${file}`).pipe(
              tap(res => {
                this.idb.set<PuzzleCollectionDB>('puzzle_sessions', {
                  ...res,
                  id: cacheId
                });
              })
            );
          })
        );
      }),
      catchError(() => of(this.empty(classId, subjectCode))),
      shareReplay(1)
    );
  }

  // -------- HELPERS --------
  private findFile(files: PuzzleIndexFile[], classId: string, subjectCode: string): string {
    return files.find(f => f.classId === classId && f.subjectCode === subjectCode)?.file ?? '';
  }

  private getCacheId(classId: string, subjectCode: string): string {
    return `pz_${classId}_${subjectCode}`;
  }

  private empty(classId: string, subjectCode: string): PuzzleCollection {
    return { classId, subjectCode, puzzles: [] };
  }
}