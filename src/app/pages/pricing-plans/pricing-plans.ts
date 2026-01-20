import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

export type PricingPlan = 'free' | 'pro';
interface FeatureItem {
  label: string;
  has: boolean;
}

@Component({
  selector: 'pricing-plans',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pricing-plans.html',
  styleUrls: ['./pricing-plans.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PricingPlans {
  freePlan = {
    learning: ['Access to free classes', ''],
    methodology: ['Solve 3+ in-text problems', '', '', ''],
    curriculam: ['Following textbooks as per state/ncert', '', ''],
    timings: ['25-35 min/session', '~1 session/week'],
    performanceReport: ['', ''],
    classStrength: ['May have 20-50+ students/class', '', ''],
    practice: [
      { label: 'No tests', has: false },
      { label: 'May have 20-50+ students/class', has: false },
      { label: '', has: false },
      { label: '', has: false },
    ] as FeatureItem[],
  };

  /* ===============================
     PRO PLAN DATA
  =============================== */
  proPlan = {
    core: ['Access to both free & paid classes', 'Access to special student evaluation session'],
    methodology: [
      'Learning the subject sections',
      'Solve related questions, related to exam preperations',
      'Tests at the end of chapter',
      'Doubt clearing and revision',
    ],
    curriculam: [
      'Following textbooks as per state/ncert',
      'Tests based on curriculam',
      'Covering problems at the end of chapters',
    ],
    timings: ['1hr-1.5hr/session', '3-5 sessions/week'],
    performanceReport: [
      'Student performance on report page in website',
      'Sending report to gmail/whatsapp (coming soon)',
    ],
    classStrength: [
      'Limited students only, so more attention to one',
      '(On teacher availablity only) 6-10 students/class',
      'We will be working on having good teachers for classes',
    ],
    advanced: [
      'Limited students only, so more attention to one',
      'Live doubt solving',
      'Full recorded sessions',
      'Performance analytics',
      'Priority teacher support',
      'Recorded sessions available',
    ],
  };

  /* ===============================
     CTA ACTIONS (PRESERVED)
  =============================== */
  selectFree() {
    // existing flow preserved
    console.log('Free plan selected');
  }

  selectPro() {
    // existing flow preserved
    console.log('Pro plan selected');
  }
}
