import { Component, Input, signal } from '@angular/core';
import { ClassSyllabus } from '../../core/constants/syllabus/syllabus.model';
import { CLASS5_SYLLABUS } from '../../core/constants/syllabus/cl5-syllabus';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'timetable',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './timetable.html',
  styleUrl: './timetable.scss'
})
export class Timetable{
  syllabus: ClassSyllabus = CLASS5_SYLLABUS;

  // Mock current chapter per subject
current = signal<Record<string, string>>({
  Mathematics: 'CL5-MATH-04',
  English: 'CL5-ENG-03',
  Hindi: 'CL5-HIN-07',
  EVS: 'CL5-EVS-05'
});

  // Mock live classes (supports 2 batches)
live = signal<Record<string, { time: string; batch: string; link: string; status: string; }[]>>({
  Mathematics: [
    { time: '10:00 AM', batch: 'A', link: '#', status: 'Live' },
    { time: '11:30 AM', batch: 'B', link: '#', status: 'Upcoming' }
  ],
  English: [
    { time: '2:00 PM', batch: 'A', link: '#', status: 'Upcoming' }
  ]
});


  // Ratings / notes
notes = signal<Record<string, string>>({
  'CL5-MATH-04': 'Important chapter',
  'CL5-ENG-03': 'Fun and easy to learn',
  'CL5-HIN-07': 'Pivot chapter for exams',
  'CL5-EVS-05': 'Good to attend this'
});

getChapterName(subjectKey: string, chapterCode: string): string {
  const subject = this.syllabus.subjects[subjectKey];
  return subject?.chapters?.find(ch => ch.code === chapterCode)?.name ?? '';
}


}
