import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

import { ContentPlaceholder } from '../../components/content-placeholder/content-placeholder';
import { MeetingsService } from '../../domain/meetings/meetings.service';
import { Loading } from '../../components/loading/loading';
import { ClassSyllabus } from '../../models/syllabus.model';
import { UiStateUtil } from '../../utils/ui-state.utils';
import { Timetable } from '../../components/timetable/timetable';
import { Meeting } from '../../models/meeting.model';
import { Timestamp } from '@angular/fire/firestore';

  export const DUMMY_MEETING: Meeting = {
  id: 'meet_001',
  classId: 'CL06',
  subjectId: 'Mathematics',
  batchId: 'BLUE',
  meetLink: 'https://meet.google.com/abc-defg-hij',
  chapterCode: 'CL06-MATH-04',
  status: 'upcoming',
  date: Timestamp.fromDate(new Date(Date.now() + 24 * 60 * 60 * 1000)), // tomorrow
  teacherId: 'TCH_101',
  teacherName: 'Mr. Arun Kumar',
  duration: 60,
  attendance: ['u1', 'u2', 'u3', 'u4'],
  createdAt: Timestamp.now(),
  endAt: Timestamp.fromDate(new Date(Date.now() + 25 * 60 * 60 * 1000)),
};



@Component({
  selector: 'tution-details',
  standalone: true,
  imports: [CommonModule, Timetable, ContentPlaceholder, Loading],
  templateUrl: './tution-details.html',
  styleUrl: './tution-details.scss',
})
export class TutionDetails implements OnInit {
  /* ------------------ services ------------------ */
  private route = inject(ActivatedRoute);
  private meetApi = inject(MeetingsService);
  private uiState = inject(UiStateUtil);
  /* ------------------ routing ------------------ */
  type = this.route.snapshot.paramMap.get('type')!; // class | jam
  id = this.route.snapshot.paramMap.get('id')!;
  syllabus = this.uiState.get<ClassSyllabus>('syllabus');

  /* ------------------ state ------------------ */
  isLoading = signal(true);
  hasValidData = signal(false);


  private readonly meetings = signal<Meeting[]>([DUMMY_MEETING]);

  /** UPCOMING CLASSES (max 5, no scroll) */
  readonly upcomingClasses = computed(() =>
    this.meetings()
      .filter(m => m.status === 'upcoming')
      .sort(
        (a, b) =>
          a.date.toDate().getTime() - b.date.toDate().getTime()
      )
      .slice(0, 5)
      .map(m => ({
        id: m.id,
        title: `Chapter ${m.chapterCode}`,
        subject: m.subjectId,
        duration: m.duration,
        startsAt: m.date.toDate(),
        interested: m.attendance?.length ?? 0,
        meeting: m, // keep original reference
      }))
  );

  /* ------------------ quote ------------------ */
  quote = signal('Learning never exhausts the mind. — Leonardo da Vinci');

  /* ------------------ overview / batches ------------------ */
  blueBatch = signal({
    started: true,
    percent: 45,
    roadmap: [
      { subject: 'Mathematics', done: 5, total: 12 },
      { subject: 'Science', done: 3, total: 10 },
    ],
  });

  yellowBatch = signal({
    started: false,
    percent: 0,
    roadmap: [] as { subject: string; done: number; total: number }[],
  });

  /* ------------------ exam prep ------------------ */
  examPrep = signal([
    { title: 'NCERT-Based Revision', level: 'High Yield' },
    { title: 'Previous Year Analysis', level: 'Important' },
    { title: 'Speed Maths / Logic', level: 'Tricky' },
  ]);

  /* ------------------ teachers ------------------ */
  teachers = signal([
    {
      name: 'Aditi Sharma',
      subject: 'Mathematics',
      avatar: './assets/teacher1.jpg',
    },
    {
      name: 'Karan Patel',
      subject: 'Science',
      avatar: './assets/teacher2.jpg',
    },
  ]);

  /* ------------------ JAM info ------------------ */
  jamInfo = signal({
    host: 'Rohit Sen',
    topic: 'GATE Quick Problem Solving',
    starts: '5:30 PM',
    participants: 140,
  });

  /* ------------------ lifecycle ------------------ */
  ngOnInit(): void {
    this.loadClassDetails();
    console.log(this.syllabus);
  }

  /* ------------------ helpers ------------------ */
  private loadClassDetails(): void {
    this.meetApi.getMeetingsForClass(this.id).subscribe({
      next: (res) => {
        // Later: use this data to compute batch % dynamically
        this.hasValidData.set(true);
      },
      error: () => {
        this.isLoading.set(false);
      },
      complete: () => {
        this.isLoading.set(false);
      },
    });
  }

    openClass(item: { meeting: Meeting }): void {
    window.open(item.meeting.meetLink, '_blank');
  }

  markInterested(item: { meeting: Meeting }): void {
    // Optimistic UI update only (no backend write here)
    this.meetings.update(list =>
      list.map(m =>
        m.id === item.meeting.id &&
        !m.attendance?.includes('me')
          ? {
              ...m,
              attendance: [...(m.attendance ?? []), 'me'],
            }
          : m
      )
    );
  }

  /* ------------------------------------ */
  /* TEMP: setter until service wired     */
  /* ------------------------------------ */

  setMeetings(data: Meeting[]): void {
    this.meetings.set(data);
  }

}
