import { Component, computed, inject, signal } from '@angular/core';
import { AuthPanelComponent } from '../../shared/components/auth-panel.component/auth-panel.component';
import { CatalogGroupsComponent } from '../../shared/components/catalog-groups.component/catalog-groups.component';
import { UserProfileService } from '../../core/services/fire/user-profile.service';
import { CommonModule } from '@angular/common';
import { StudentLeaderboardWidget } from '../../shared/components/student-leaderboard-widget/student-leaderboard-widget';
import { PLACEHOLDER__COVER_IMG } from '../../core/constants/app.constants';
import { SyllabusRepository } from '../../domain/repositories/syllabus.repository';
import { ToastService } from '../../shared/toast.service';
import { UiStateUtil } from '../../shared/state/ui-state.utils';
import { ResourceIndex } from '../../shared/utils/id-map.utils';
import { Router } from '@angular/router';

@Component({
  selector: 'free-online-tuition',
  imports: [AuthPanelComponent, CatalogGroupsComponent, CommonModule, StudentLeaderboardWidget],
  templateUrl: './free-online-tuition.html',
  styleUrl: './free-online-tuition.scss',
})
export class FreeOnlineTuition {
  private readonly profileApi = inject(UserProfileService);
  private toast = inject(ToastService);
  private router = inject(Router);

  private uiState = inject(UiStateUtil);
  private syllRepo = inject(SyllabusRepository);
  readonly profile = computed(() => this.profileApi.profile());

  isoading = signal(true);

  ngOnInit() {
    this.syllRepo.loadIndex().subscribe((data) => {
      if (!data) {
        // this.handleNoDataState();
        this.toast.show('Homepage data unavailable');
        this.isoading.set(false);
        return;
      }
      this.isoading.set(false);
    });
  }
  ngAfterViewInit() {
    // After all home methods happened - start parallel of next data
    setTimeout(() => this.loadAllClasses());
  }

  private loadAllClasses() {
    const map = this.uiState.get<ResourceIndex>('ResourceIndex');

    if (map) {
      let mapToArr = Object.values(map);
      this.syllRepo.loadMultipleClasses(mapToArr);
    }
  }

  navigateById(id: string) {
    this.router.navigate(['/details', id]);
  }

  getBannerSrc(src?: string | null): string {
    return src || PLACEHOLDER__COVER_IMG;
  }

  onImgError(event: Event) {
    (event.target as HTMLImageElement).src = PLACEHOLDER__COVER_IMG;
  }

  getBannerAlt(cls: any): string {
    return cls?.className ? `${cls.className} cover` : 'Class cover';
  }
}
