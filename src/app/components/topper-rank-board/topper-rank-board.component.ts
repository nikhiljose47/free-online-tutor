import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserModel } from '../../models/fire/user.model';
import { RankboardFacadeService } from '../../services/rankboard/rankboard-facade/rankboard-facade.service';
import { Subscription } from 'rxjs';
import { PLACEHOLDER__COVER_IMG } from '../../core/constants/app.constants';
import { RankboardUser } from '../../services/user/user-points/user-points.service';

@Component({
  selector: 'topper-rank-board',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './topper-rank-board.component.html',
  styleUrls: ['./topper-rank-board.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopperRankBoardComponent implements OnDestroy {
  private facade = inject(RankboardFacadeService);
  private sub = new Subscription();

  /* ------------------ INIT (FIXED) ------------------ */
  constructor() {
    this.sub.add(this.facade.init$().subscribe());
  }

  /* ------------------ STATE ------------------ */
  users = computed(() => this.facade.data() as RankboardUser[]);
  isLoading = computed(() => this.facade.loading());
  isSyncing = computed(() => this.facade.syncing());
  hasError = computed(() => this.facade.error());

  topUsers = computed(() => this.users().slice(0, 10));

  trackByUid = (_: number, u: RankboardUser) => u.id;

  refresh() {
    this.sub.add(this.facade.refresh$().subscribe());
  }

  getImgSrc(src?: string | null): string {
    return src || PLACEHOLDER__COVER_IMG;
  }

  onImgError(event: Event) {
    (event.target as HTMLImageElement).src = PLACEHOLDER__COVER_IMG;
  }

  getImgAlt(item: any): string {
    return item?.label ? `${item.label} photo` : 'User avatar';
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
