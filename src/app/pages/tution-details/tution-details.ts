import {
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { catchError, of, tap } from 'rxjs';

import { ContentPlaceholder } from '../../components/content-placeholder/content-placeholder';
import { Loading } from '../../components/loading/loading';
import { Timetable } from '../../components/timetable/timetable';

import { MeetingsService } from '../../domain/meetings/meetings.service';
import { UiStateUtil } from '../../core/state/ui-state.utils';
import { ClassSyllabus } from '../../models/syllabus.model';
import { Meeting } from '../../models/meeting.model';
import { IdFileMap } from '../../utils/id-map.utils';
import { Timestamp } from '@angular/fire/firestore';

/* ------------------ dummy fallback ------------------ */
const DUMMY_MEETING: Meeting = {
  id: 'meet_001',
  classId: 'CL06',
  subjectId: 'Mathematics',
  batchId: 'BLUE',
  meetLink: 'https://meet.google.com/abc-defg-hij',
  chapterCode: 'CL06-MATH-04',
  status: 'upcoming',
  date: Timestamp.fromDate(new Date(Date.now() + 24 * 60 * 60 * 1000)),
  teacherId: 'TCH_101',
  teacherName: 'Mr. Arun Kumar',
  duration: 60,
  attendance: ['u1', 'u2'],
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
  /* ================= ROUTING ================= */
  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);
  private meetApi = inject(MeetingsService);
  private uiState = inject(UiStateUtil);

  readonly type = this.route.snapshot.paramMap.get('type') as 'class' | 'jam';
  readonly id = this.route.snapshot.paramMap.get('id')!;

  /* ================= UI STATE ================= */
  readonly isLoading = signal(true);
  readonly hasValidData = signal(false);
  readonly activeTab = signal<
    'overview' | 'roadmap' | 'upcoming' | 'exam' | 'teachers' | 'jam'
  >('overview');

  /* ================= DATA ================= */
  syllabus = signal<ClassSyllabus | null>(null);

  private readonly meetings = signal<Meeting[]>([DUMMY_MEETING]);

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

  readonly quote = signal(
    'Learning never exhausts the mind. — Leonardo da Vinci',
  );

  /* ================= INIT ================= */
  ngOnInit(): void {
    this.loadSyllabus();
    this.loadClassDetails();
  }

  /* ================= LOAD SYLLABUS ================= */
  private loadSyllabus(): void {
    const cached = this.uiState.get<ClassSyllabus>(this.id);
    if (cached) {
      this.syllabus.set(cached);
      return;
    }

    const map = this.uiState.get<IdFileMap>('idFileMap');
    const fileId = map?.[this.id];

    if (!fileId) return;

    this.http
      .get<ClassSyllabus>(`data/${fileId}.json`)
      .pipe(
        tap((data) => {
          this.syllabus.set(data);
          this.uiState.set<ClassSyllabus>(this.id, data, 15 * 60 * 1000);
        }),
        catchError(() => of(null)),
      )
      .subscribe();
  }

  /* ================= LOAD DETAILS ================= */
  private loadClassDetails(): void {
    this.meetApi.getMeetingsForClass(this.id).subscribe({
      next: (res) => {
        this.setMeetings(res as any);
        this.hasValidData.set(true);
      },
      error: () => {
        this.hasValidData.set(false);
      },
      complete: () => {
        this.isLoading.set(false);
      },
    });
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

  /* ================= HELPERS ================= */
  setMeetings(data: Meeting[]): void {
    this.meetings.set(data);
  }
}
