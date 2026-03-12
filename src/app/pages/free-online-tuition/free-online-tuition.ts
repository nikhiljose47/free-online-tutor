import { Component, computed, inject } from '@angular/core';
import { AuthPanelComponent } from '../../shared/components/auth-panel.component/auth-panel.component';
import { CatalogGroupsComponent } from '../../shared/components/catalog-groups.component/catalog-groups.component';
import { UserProfileService } from '../../core/services/fire/user-profile.service';
import { CommonModule } from '@angular/common';
import { StudentLeaderboardWidget } from '../../shared/components/student-leaderboard-widget/student-leaderboard-widget';

@Component({
  selector: 'free-online-tuition',
  imports: [AuthPanelComponent, CatalogGroupsComponent, CommonModule, StudentLeaderboardWidget],
  templateUrl: './free-online-tuition.html',
  styleUrl: './free-online-tuition.scss',
})
export class FreeOnlineTuition {
  private readonly profileApi = inject(UserProfileService);

  readonly profile = computed(() => this.profileApi.profile());
}
