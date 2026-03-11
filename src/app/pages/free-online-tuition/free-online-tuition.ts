import { Component, inject } from '@angular/core';
import { AuthPanelComponent } from '../../shared/components/auth-panel.component/auth-panel.component';
import { CatalogGroupsComponent } from '../../shared/components/catalog-groups.component/catalog-groups.component';

@Component({
  selector: 'free-online-tuition',
  imports: [AuthPanelComponent, CatalogGroupsComponent],

  templateUrl: './free-online-tuition.html',
  styleUrl: './free-online-tuition.scss',
})
export class FreeOnlineTuition {
openFeedback(): void {
  const email = 'feedback@yourdomain.com';
  const subject = encodeURIComponent('Platform Feedback');

  window.location.href = `mailto:${email}?subject=${subject}`;
}

}
