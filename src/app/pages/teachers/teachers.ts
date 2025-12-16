import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
export interface Teacher {
  id: string;
  name: string;
  qualification: string;
  domains: string[];
  note: string;
  contact: string;
  imageUrl: string;
}

@Component({
  standalone: true,
  selector: 'teachers',
  imports: [CommonModule],
  templateUrl: './teachers.html',
  styleUrl: './teachers.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeachersPage {
  teachers = signal<Teacher[]>([
    {
      id: 't1',
      name: 'Nikhil Jose',
      qualification: 'M.Sc Mathematics',
      domains: ['Algebra', 'Trigonometry', 'Olympiad'],
      note: '10+ years experience in CBSE coaching',
      contact: 'nikhiljose47@freetutor.in',
      imageUrl: 'assets/abbu.jpg',
    },
    {
      id: 't2',
      name: 'Arjun Kumar VS',
      qualification: 'B.Tech, IIT',
      domains: ['Physics', 'Problem Solving'],
      note: 'Concept-first teaching style',
      contact: 'arjun@freetutor.in',
      imageUrl: 'assets/placeholder.webp',
    },
    {
      id: 't3',
      name: 'Sneha Iyer',
      qualification: 'M.A English',
      domains: ['Grammar', 'Literature'],
      note: 'Focus on communication & confidence',
      contact: 'sneha@freetutor.in',
      imageUrl: 'assets/placeholder.webp',
    },
  ]);
}
