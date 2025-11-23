import { Injectable } from '@angular/core';
import { Roadmap } from '../models/roadmap.model';

@Injectable({ providedIn: 'root' })
export class RoadmapService {
  private list: Roadmap[] = [
    {
      id: 'r-c9-math',
      className: 'Class 9 - Maths',
      nodes: [
        { id: 'n1', title: 'Number Systems', order: 1, completed: true, hoursEstimate: 2 },
        { id: 'n2', title: 'Polynomials', order: 2, completed: false, hoursEstimate: 3 },
        { id: 'n3', title: 'Coordinate Geometry', order: 3, completed: false, hoursEstimate: 4 },
      ]
    }
  ];

  getAll(): Roadmap[] { return this.list; }
  getById(id: string) { return this.list.find(r=>r.id===id); }
}
