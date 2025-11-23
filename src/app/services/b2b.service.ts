import { Injectable } from '@angular/core';
import { B2BFeature } from '../models/b2b-feature.model';

@Injectable({ providedIn: 'root' })
export class B2BService {
  features: B2BFeature[] = [
    {
      id: '1',
      title: 'AI Progress Tracking',
      description: 'Automatically tracks student learning and generates weekly reports.'
    },
    {
      id: '2',
      title: 'Smart Class Scheduling',
      description: 'AI predicts best class timings based on attendance patterns.'
    },
    {
      id: '3',
      title: 'Teacher Performance Insights',
      description: 'Monitors teacher delivery quality and engagement signals.'
    }
  ];

  getAll(): B2BFeature[] {
    return this.features;
  }
}
