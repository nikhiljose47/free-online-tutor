import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
export interface StudentCreation {
  id: string;
  imageUrl: string;
  author: string;
  likes: number;
  createdAt: number;
}

const DUMMY_CREATIONS: StudentCreation[] = [
  {
    id: '1',
    imageUrl: 'assets/student-creations/st1.jpg',
    author: 'Ananya • Class 6',
    likes: 42,
    createdAt: Date.now(),
  },
  {
    id: '2',
    imageUrl: 'assets/student-creations/st2.jpg',
    author: 'Rohit • Class 7',
    likes: 58,
    createdAt: Date.now(),
  },
];

@Component({
  selector: 'student-creations',
  imports: [CommonModule],
  templateUrl: './student-creations.html',
  styleUrl: './student-creations.scss',
})
export class StudentCreations {
  creations = signal(DUMMY_CREATIONS);
  zoomed = signal<StudentCreation | null>(null);

  openZoom(c: StudentCreation) {
    this.zoomed.set(c);
  }

  closeZoom() {
    this.zoomed.set(null);
  }
}
