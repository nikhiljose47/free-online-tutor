import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'b2b',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './b2b.html',
})
export class B2BComponent {
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
}
