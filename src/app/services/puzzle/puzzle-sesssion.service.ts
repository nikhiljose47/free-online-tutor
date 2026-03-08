import { Injectable, signal } from '@angular/core';
import { IndexedDbService } from '../../core/services/cache/db/indexed-db.service';
import { CACHE_TTL } from '../../core/constants/app.constants';

export type PuzzleStatus = 'pending' | 'done';

export interface PuzzleSession {
  id: string;
  puzzleId: string;
  status: PuzzleStatus;
  startedAt: number;
  doneAt?: number;
  durationSec?: number;
}

@Injectable({ providedIn: 'root' })
export class PuzzleSessionService {
  private readonly STORE = 'puzzle_sessions';
  private readonly KEY = 'daily-puzzle';

  private cache: PuzzleSession | null = null;
  private cacheExpiry = 0;

  session = signal<PuzzleSession | null>(null);

  constructor(private db: IndexedDbService) {}

  /* ---------- LOAD SESSION ---------- */

  async load(todayPuzzleId: string): Promise<PuzzleSession | null> {
    const now = Date.now();

    if (this.cache && now < this.cacheExpiry) {
      this.session.set(this.cache);
      return this.cache;
    }

    const stored = await this.db.get<PuzzleSession>(this.STORE, this.KEY);

    if (!stored) {
      this.session.set(null);
      return null;
    }

    const isExpired = now - stored.startedAt > CACHE_TTL.PUZZLE_SESS;
    const isSamePuzzle = stored.puzzleId === todayPuzzleId;

    if (isExpired || !isSamePuzzle) {
      await this.db.delete(this.STORE, this.KEY);
      this.session.set(null);
      this.cache = null;
      return null;
    }

    this.cache = stored;
    this.cacheExpiry = now + CACHE_TTL.PUZZLE_SESS;
    this.session.set(stored);

    return stored;
  }

  /* ---------- START PUZZLE ---------- */

  async start(puzzleId: string): Promise<PuzzleSession> {
    const session: PuzzleSession = {
      id: this.KEY,
      puzzleId,
      status: 'pending',
      startedAt: Date.now(),
    };

    await this.db.set(this.STORE, session);

    this.cache = session;
    this.cacheExpiry = Date.now() + CACHE_TTL.PUZZLE_SESS;
    this.session.set(session);

    return session;
  }

  /* ---------- COMPLETE PUZZLE ---------- */

  async complete(): Promise<void> {
    const current = this.session();

    if (!current || current.status === 'done') return;

    const doneAt = Date.now();

    const updated: PuzzleSession = {
      ...current,
      status: 'done',
      doneAt,
      durationSec: Math.floor((doneAt - current.startedAt) / 1000),
    };

    await this.db.set(this.STORE, updated);

    this.cache = updated;
    this.session.set(updated);
  }

  /* ---------- RESET ---------- */

  async reset(): Promise<void> {
    await this.db.delete(this.STORE, this.KEY);
    this.cache = null;
    this.session.set(null);
  }

  /* ---------- UTIL ---------- */

  get isDone(): boolean {
    return this.session()?.status === 'done';
  }

  get elapsedSec(): number {
    const s = this.session();
    if (!s) return 0;
    const end = s.doneAt ?? Date.now();
    return Math.floor((end - s.startedAt) / 1000);
  }
}
