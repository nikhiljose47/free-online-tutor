import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ContentPlaceholder } from '../../components/content-placeholder/content-placeholder';
import { Timetable } from '../../components/timetable/timetable';

import { Meeting } from '../../models/meeting.model';
import { SyllabusRepository } from '../../domain/repositories/syllabus.repository';
import { ClassSyllabus } from '../../models/syllabus/class-syllabus.model';
import { DotLoader } from '../../components/dot-loader/dot-loader';
import { SyllabusStore } from '../../shared/state/syllabus.store';
import { catchError, forkJoin, of, switchMap, tap } from 'rxjs';
import { MeetingsService } from '../../services/meetings/meetings.service';
import { QuoteUtil } from '../../shared/utils/quote.utils';
import { Quote } from '../../models/quote.model';
import { ClassSubjectService } from '../../services/class/class-subject/class-subject.service';
import { ClassAssignmentsService } from '../../services/class/class-assignments/class-assignments.service';

@Component({
  selector: 'tution-details',
  standalone: true,
  imports: [CommonModule, Timetable, ContentPlaceholder, DotLoader],
  templateUrl: './tution-details.html',
  styleUrl: './tution-details.scss',
})
export class TutionDetails implements OnInit {
  /* ================= ROUTING ================= */
  private route = inject(ActivatedRoute);
  private meetApi = inject(MeetingsService);
  private syllRepo = inject(SyllabusRepository);
  private syllabusStore = inject(SyllabusStore);
  private classSubService = inject(ClassSubjectService);
  private classAssignmentsService = inject(ClassAssignmentsService);

  readonly type = this.route.snapshot.paramMap.get('type') as 'class' | 'jam';
  readonly id = this.route.snapshot.paramMap.get('id')!;

  /* ================= UI STATE ================= */
  readonly isLoading = signal(true);
  readonly hasValidData = signal(false);
  readonly activeTab = signal<'overview' | 'roadmap' | 'upcoming' | 'exam' | 'teachers' | 'jam'>(
    'overview',
  );

  /* ================= DATA ================= */
  syllabus = signal<ClassSyllabus | null>(null);

  private readonly meetings = signal<Meeting[]>([]);

  /* ================= COMPUTED ================= */
  readonly upcomingClasses = computed(() =>
    this.meetings()
      .filter((m) => m.status === 'upcoming')
      .sort((a, b) => a.date.toDate().getTime() - b.date.toDate().getTime())
      .slice(0, 5)
      .map((m) => ({
        title: `Chapter ${m.chapterCode}`,
        subject: m.subjectId,
        duration: m.duration,
        startsAt: m.date.toDate(),
        interested: m.attendance?.length ?? 0,
        meeting: m,
      })),
  );

  /* ================= OVERVIEW ================= */
  readonly blueBatch = signal({
    started: true,
    percent: 45,
    roadmap: [
      { subject: 'Mathematics', done: 5, total: 12 },
      { subject: 'Science', done: 3, total: 10 },
    ],
  });

  readonly yellowBatch = signal({
    started: false,
    percent: 0,
    roadmap: [] as { subject: string; done: number; total: number }[],
  });

  /* ================= EXAM PREP ================= */
  readonly examPrep = signal([
    { title: 'NCERT-Based Revision', level: 'High Yield' },
    { title: 'Previous Year Analysis', level: 'Important' },
    { title: 'Speed Maths / Logic', level: 'Tricky' },
  ]);

  /* ================= TEACHERS ================= */
  readonly teachers = signal([
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

  /* ================= JAM ================= */
  readonly jamInfo = signal({
    host: 'Rohit Sen',
    topic: 'GATE Quick Problem Solving',
    starts: '5:30 PM',
    participants: 140,
  });

  readonly quote = signal<Quote>({ text: '' });

  classFileId: string = '';

  ngOnInit(): void {
    this.loadData();
    console.log('classid', this.id)
    this.quote.set(QuoteUtil.getRandom());
    this.classAssignmentsService.getAll('CL06').subscribe({
      next: (value) => console.log('Received for subservive:', value),
      error: () => console.log('e'),
    });
  }

  loadData() {
    this.syllabusStore
      .getIdMap$()
      .pipe(
        switchMap((map) => {
          if (!map) return of(null);

          this.classFileId = map[this.id];

          return forkJoin({
            syllabus: this.syllRepo.loadClass(this.classFileId).pipe(catchError(() => of(null))),
            meetings: this.meetApi.getMeetingsForClass(this.id).pipe(catchError(() => of(null))),
          });
        }),
        tap((res) => {
          if (!res) {
            this.isLoading.set(false);
            return;
          }

          const { syllabus, meetings } = res;

          if (syllabus) {
            this.syllabus.set(syllabus);
          }

          if (meetings) {
            this.setMeetings(meetings as any);
          }

          /* BOTH must be valid */
          const valid = !!syllabus && !!meetings;
          this.hasValidData.set(valid);
          this.isLoading.set(false);

          if (valid) console.log('came in');
        }),
        catchError(() => {
          this.isLoading.set(false);
          return of(null);
        }),
      )
      .subscribe();
  }

  /* ================= ACTIONS ================= */
  openClass(item: { meeting: Meeting }): void {
    window.open(item.meeting.meetLink, '_blank');
  }

  markInterested(item: { meeting: Meeting }): void {
    this.meetings.update((list) =>
      list.map((m) =>
        m.id === item.meeting.id && !m.attendance?.includes('me')
          ? { ...m, attendance: [...(m.attendance ?? []), 'me'] }
          : m,
      ),
    );
  }

  setMeetings(data: Meeting[]): void {
    this.meetings.set(data);
  }
}
