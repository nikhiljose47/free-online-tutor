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
    learning: ['Access to free classes', 'Basic notes & materials'],
    methodology: ['Try to solve 2-3 questions/session', '','','',''],
    timings: ['25-35 min/session', '1-2 sessions/week'],
    practice: [
      { label: 'Limited practice tests', has: true },
      { label: 'Live doubt solving', has: false },
      { label: 'Recorded session replays', has: false },
      { label: 'Progress analytics', has: false },
    ] as FeatureItem[],
  };

  /* ===============================
     PRO PLAN DATA
  =============================== */
  proPlan = {
    core: ['Access to all free features', 'Unlimited classes'],
    methodology: [
      'Learning the subject sections',
      'Solve related questions, related to exam preperations',
      'Tests at the end of chapter',
      'Doubt clearing and revision'
    ],
    timings: ['1hr-1.5hr/session', '4-5 sessions/week'],
    advanced: [
      'Live doubt solving',
      'Full recorded sessions',
      'Unlimited practice tests',
      'Performance analytics',
      'Priority teacher support',
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
