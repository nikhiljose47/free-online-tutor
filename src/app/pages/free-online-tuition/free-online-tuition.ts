import { Component, computed, inject, signal } from '@angular/core';
import { AuthPanelComponent } from '../../shared/components/auth-panel.component/auth-panel.component';
import { CatalogGroupsComponent } from '../../shared/components/catalog-groups.component/catalog-groups.component';
import { UserProfileService } from '../../core/services/fire/user-profile.service';
import { CommonModule } from '@angular/common';
import { PLACEHOLDER__COVER_IMG } from '../../core/constants/app.constants';
import { SyllabusRepository } from '../../domain/repositories/syllabus.repository';
import { ToastService } from '../../shared/toast.service';
import { Router, RouterModule } from '@angular/router';
import { MyLearning } from '../../components/my-learning/my-learning';
import { HighlightBannerComponent } from '../../shared/components/highlight-banner.component/highlight-banner.component';
import { TopperRankBoardComponent } from '../../components/topper-rank-board/topper-rank-board.component';
import { ClassLookupService } from '../../services/syllabus/class-lookup/class-lookup.service';
import { SyllabusIndex } from '../../models/syllabus/syllabus-index.model';
import { IdMapUtil } from '../../shared/utils/id-map.utils';
import { AnnouncementBannerComponent } from '../../components/announcement-banner.component/announcement-banner.component';

@Component({
  selector: 'free-online-tuition',
  standalone: true,
  imports: [
    AuthPanelComponent,
    TopperRankBoardComponent,
    HighlightBannerComponent,
    MyLearning,
    CatalogGroupsComponent,
    AnnouncementBannerComponent,
    CommonModule,
    RouterModule,
  ],
  templateUrl: './free-online-tuition.html',
  styleUrl: './free-online-tuition.scss',
})
export class FreeOnlineTuition {
  private readonly profileApi = inject(UserProfileService);
  private toast = inject(ToastService);
  private router = inject(Router);
  private classLookup = inject(ClassLookupService);
  private syllRepo = inject(SyllabusRepository);
  readonly profile = computed(() => this.profileApi.profile());

  isoading = signal(true);

  ngOnInit() {
    const start = performance.now();

    this.syllRepo.loadIndex().subscribe((data) => {
      const end = performance.now();

      console.log('Syllabus Index API Time:', (end - start).toFixed(2), 'ms');

      if (!data) {
        this.toast.show('Homepage data unavailable');
        this.isoading.set(false);
        return;
      }

      setTimeout(() => this.loadAllClasses(data), 100);

      this.isoading.set(false);
    });
  }

  private loadAllClasses(index: SyllabusIndex) {
    const classIds = IdMapUtil.getReadyClassIds(index);
    this.syllRepo.loadMultipleClasses(classIds, index);
  }

  navigateById(id: string) {
    // To init before navigating..
    this.classLookup.load(id).subscribe();
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
