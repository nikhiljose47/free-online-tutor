import { Injectable, inject } from '@angular/core';
import { IndexedDbService } from '../../core/services/cache/db/indexed-db.service';

export type PuzzleStatus = 'assigned' | 'completed' | 'expired';

export interface PuzzleSession {
  id: string; // `${classId}_${puzzleId}`
  classId: string;
  puzzleId: string;
  assignedAt: number;
  completedAt: number | null;
  status: PuzzleStatus;
  nextEligibleAt: number;
  meta?: Record<string, unknown>;
}

@Injectable({ providedIn: 'root' })
export class PuzzleStore {
  private db = inject(IndexedDbService);
  private storeName: 'puzzle_sessions' = 'puzzle_sessions';

  /* ---------- CREATE / ASSIGN ---------- */
  async assignPuzzle(
    classId: string,
    puzzleId: string,
    frequencyDays: number,
  ): Promise<void> {
    const now = Date.now();

    const session: PuzzleSession = {
      id: `${classId}_${puzzleId}`,
      classId,
      puzzleId,
      assignedAt: now,
      completedAt: null,
      status: 'assigned',
      nextEligibleAt: now + frequencyDays * 24 * 60 * 60 * 1000,
    };

    await this.db.set(this.storeName, session);
  }

  /* ---------- COMPLETE ---------- */
  async markCompleted(classId: string, puzzleId: string): Promise<void> {
    const id = `${classId}_${puzzleId}`;
    const existing = await this.db.get<PuzzleSession>(this.storeName, id);
    if (!existing) return;

    existing.status = 'completed';
    existing.completedAt = Date.now();

    await this.db.set(this.storeName, existing);
  }

  /* ---------- GET LAST SESSION FOR CLASS ---------- */
  async getLastSession(classId: string): Promise<PuzzleSession | null> {
    const all = await this.db.getAll<PuzzleSession>(this.storeName);

    const filtered = all
      .filter((s) => s.classId === classId)
      .sort((a, b) => b.assignedAt - a.assignedAt);

    return filtered[0] ?? null;
  }

  /* ---------- CHECK IF NEW PUZZLE CAN BE GENERATED ---------- */
  async canGenerateNext(classId: string): Promise<boolean> {
    const last = await this.getLastSession(classId);
    if (!last) return true;

    return Date.now() >= last.nextEligibleAt;
  }

  /* ---------- GET ALL COMPLETED FOR CLASS ---------- */
  async getCompletedForClass(classId: string): Promise<PuzzleSession[]> {
    const all = await this.db.getAll<PuzzleSession>(this.storeName);
    return all.filter((s) => s.classId === classId && s.status === 'completed');
  }

  /* ---------- CLEAR CLASS DATA ---------- */
  async clearClass(classId: string): Promise<void> {
    const all = await this.db.getAll<PuzzleSession>(this.storeName);
    const classItems = all.filter((s) => s.classId === classId);

    for (const item of classItems) {
      await this.db.delete(this.storeName, item.id);
    }
  }
}