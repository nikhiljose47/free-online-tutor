import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Testimonials } from '../testimonials/testimonials';
import { CommonModule } from '@angular/common';
import { QuoteUtil } from '../../utils/quote.utils';

@Component({
  selector: 'app-about',
  imports: [CommonModule, Testimonials],
  templateUrl: './about.html',
  styleUrl: './about.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class About {
  //B2B
  features: any[] = [
    {
      id: '1',
      title: 'AI Progress Tracking',
      description: 'Automatically tracks student learning and generates weekly reports.',
    },
    {
      id: '2',
      title: 'Smart Class Scheduling',
      description: 'AI predicts best class timings based on attendance patterns.',
    },
    {
      id: '3',
      title: 'Teacher Performance Insights',
      description: 'Monitors teacher delivery quality and engagement signals.',
    },
  ];
  quote = QuoteUtil.getRandom();
}
