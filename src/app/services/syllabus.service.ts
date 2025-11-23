import { Injectable } from '@angular/core';
import { SyllabusItem } from '../models/syllabus.model';

@Injectable({ providedIn: 'root' })
export class SyllabusService {
  syllabus: SyllabusItem[] = [
    {
      id: 'c9-math',
      class: 'Class 9',
      subject: 'Maths',
      topics: ['Number Systems', 'Polynomials', 'Coordinate Geometry', 'Linear Equations'],
    },
    {
      id: 'c9-sci',
      class: 'Class 9',
      subject: 'Science',
      topics: ['Matter in Our Surroundings', 'Tissues', 'Motion', 'Work & Energy'],
    },
    {
      id: 'c10-math',
      class: 'Class 10',
      subject: 'Maths',
      topics: ['Real Numbers', 'Triangles', 'Trigonometry', 'Statistics'],
    },
  ];

  getAll(): SyllabusItem[] {
    return this.syllabus;
  }

  getSyllabus() {
    return this.syllabus;
  }

  getByClass(className: string): SyllabusItem[] {
    return this.syllabus.filter((s) => s.class === className);
  }
}
