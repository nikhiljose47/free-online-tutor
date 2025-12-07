import { Component, Input, computed, inject, signal } from '@angular/core';
import { ClassSyllabus } from '../../core/constants/syllabus/syllabus.model';
import { CLASS5_SYLLABUS } from '../../core/constants/syllabus/cl5-syllabus';
import { CommonModule } from '@angular/common';
import { MeetingStore } from '../../services/store/meeting-store';

@Component({
  selector: 'timetable',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './timetable.html',
  styleUrls: ['./timetable.scss'],
})
export class Timetable {
  syllabus: ClassSyllabus = CLASS5_SYLLABUS;

  private store = inject(MeetingStore);

  // Load CL5 meetings once
  constructor() {
    this.store.loadClassMeetings('CL5');
  }

  // ------- EXISTING SIGNALS ----------
  current = signal<Record<string, string>>({
    Mathematics: 'CL5-MATH-04',
    English: 'CL5-ENG-03',
    Hindi: 'CL5-HIN-07',
    EVS: 'CL5-EVS-05',
  });

  notes = signal<Record<string, string>>({
    'CL5-MATH-04': 'Important chapter',
    'CL5-ENG-03': 'Fun and easy to learn',
    'CL5-HIN-07': 'Pivot chapter for exams',
    'CL5-EVS-05': 'Good to attend this',
  });

  live = signal<Record<string, any[]>>({
    English: [{ time: '2:00 PM', batch: 'A', status: 'Upcoming' }],
    Hindi: [],
    EVS: [],
  });

  // -------------------------------------------------------------------
  // 🔥 REPLACEMENT: Get upcoming meetings for Class 5 — MATH only
  // -------------------------------------------------------------------

  mathUpcoming = computed(() => {
    const groups = this.store.groupedFor('CL5')(); // { live, upcoming, completed }
    return groups.upcoming.filter((m) => m.subjectId === 'Mathematics');
  });

  // 🔥 REPLACEMENT: Auto-detect current mathematics chapter from latest completed meeting
  mathCurrentChapter = computed(() => {
    const completed = this.store.groupedFor('CL5')().completed;

    // find latest completed meeting of Maths
    const math = completed
      .filter((m) => m.subjectId === 'Mathematics')
      .sort((a, b) => b.date.toDate().getTime() - a.date.toDate().getTime());

    return math[0]?.chapterCode ?? this.current()['Mathematics'];
  });

  // Utility: Get chapter name from syllabus
  getChapterName(subjectKey: string, chapterCode: string): string {
    const subject = this.syllabus.subjects[subjectKey];
    return subject?.chapters?.find((ch) => ch.code === chapterCode)?.name ?? '';
  }
}
