import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { of, delay, shareReplay } from 'rxjs';
import { UserModel } from '../../models/fire/user.model';

@Component({
  selector: 'topper-rank-board',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './topper-rank-board.component.html',
  styleUrls: ['./topper-rank-board.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopperRankBoardComponent {
  private readonly LS_KEY = 'rank_board_cache_v1';

  fallbackAvatar =
    'https://ui-avatars.com/api/?name=User&background=E5E7EB&color=111827';

  /* ------------------ Dummy source ------------------ */
  private dummy$ = of(this.getDummy()).pipe(delay(400), shareReplay(1));

  /* ------------------ Signals ------------------ */
  private initialUsers = toSignal(this.dummy$, {
    initialValue: [] as UserModel[],
  });

  users = signal<UserModel[]>(this.getCache());

  isLoading = signal(true);

  topUsers = computed(() => this.users().slice(0, 10));

  constructor() {
    effect(() => {
      const data = this.initialUsers();
      if (data?.length) {
        this.users.set(data);
        this.persist(data);
        this.isLoading.set(false);
      }
    });
  }

  trackByUid = (_: number, u: UserModel) => u.uid;

  private persist(data: UserModel[]) {
    try {
      localStorage.setItem(this.LS_KEY, JSON.stringify(data));
    } catch {}
  }

  private getCache(): UserModel[] {
    try {
      const raw = localStorage.getItem(this.LS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  private getDummy(): UserModel[] {
    return [
      this.u('1', 'Aarav', 9820),
      this.u('2', 'Diya', 9450),
      this.u('3', 'Rohan', 9100),
      this.u('4', 'Meera', 8700),
      this.u('5', 'Kabir', 8400),
      this.u('6', 'Anaya', 8000),
    ];
  }

  private u(uid: string, name: string, pts: number): UserModel {
    return {
      uid,
      name,
      email: '',
      age: null,
      role: 'student',
      avatarId: '',
      photoUrl: null,
      phone: null,
      enrolledClassIds: [],
      abilities: null,
      skills: null,
      expList: null,
      expYrs: null,
      totalPoints: pts,
      seasonPoints: pts,
      seasonId: 's1',
      subjects: null,
      bio: null,
      weekPerformance: '',
      rating: 0,
      specialization: null,
      lastSession: null,

      /* ✅ RANDOM DELTA FOR UI */
      meta: {
      //  rankDelta: Math.floor(Math.random() * 5) - 2,
      },

      joinedAt: null,
      updatedAt: null,
    };
  }

  /* ------------------ FUTURE SERVICE ------------------
     this.initialUsers = toSignal(this.pointsService.topUsers$)
     (no UI change needed)
  ------------------------------------------------ */
}