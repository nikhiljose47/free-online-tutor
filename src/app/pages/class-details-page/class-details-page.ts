import {
  Component,
  ChangeDetectionStrategy,
  signal,
  inject,
  OnInit,
  computed,
} from '@angular/core';
import { McqPuzzleCardComponent } from '../../components/mcq-puzzle-card/mcq-puzzle-card';
import { Timetable } from '../../components/timetable/timetable';
import { CommonModule } from '@angular/common';
import { ClassOverviewComponent } from '../../shared/components/class-overview.component/class-overview.component';
import { catchError, forkJoin, of, switchMap, tap } from 'rxjs';
import { SyllabusStore } from '../../domain/syllabus.store';
import { MeetingsService } from '../../services/meetings/meetings.service';
import { SyllabusRepository } from '../../domain/repositories/syllabus.repository';
import { ActivatedRoute } from '@angular/router';
import { Meeting } from '../../models/meeting.model';
import { ClassSyllabus } from '../../models/syllabus/class-syllabus.model';
import { UserCardlist } from '../../shared/components/user-card-list/user-card-list';
import { ExploreCoursesBannerComponent } from '../../components/banners/explore-courses-banner/explore-courses-banner';
import { FaqList } from '../../shared/components/faq-list/faq-list';
import { ClassScheduleListComponent } from '../../shared/components/class-schedule-list/class-schedule-list';
import { Quote } from '../../models/quote.model';
import { QuoteUtil } from '../../shared/utils/quote.utils';

type TabType = 'overview' | 'games' | 'stats';

interface ClassStat {
  value: string;
  label: string;
}

@Component({
  selector: 'class-details-page',
  standalone: true,
  templateUrl: './class-details-page.html',
  styleUrl: './class-details-page.scss',
  imports: [
    McqPuzzleCardComponent,
    Timetable,
    CommonModule,
    UserCardlist,
    FaqList,
    ClassScheduleListComponent,
    ExploreCoursesBannerComponent,
    ClassOverviewComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClassDetailsPage implements OnInit {
  private syllabusStore = inject(SyllabusStore);
  private meetApi = inject(MeetingsService);
  private syllRepo = inject(SyllabusRepository);
  private route = inject(ActivatedRoute);

  readonly classId = this.route.snapshot.paramMap.get('id') ?? 'CL08';

  readonly isLoading = signal(true);
  readonly hasValidData = signal(false);
  private readonly meetings = signal<Meeting[]>([]);

  syllabus = signal<ClassSyllabus | null>(null);
  classTitle = 'Class 6';
  puzzleId = 'puzzle_001';
  classFileId: string = '';
  

  readonly stats = signal<ClassStat[]>([
    { value: '12,500+', label: 'Students learning in this class' },
    { value: '28', label: 'States actively connected' },
    { value: '4,200+', label: 'Hours of guided sessions' },
    { value: '96%', label: 'Concept clarity satisfaction' },
  ]);

  //Tab
  private readonly _activeTab = signal<TabType>('overview');

  readonly activeMainTab = computed(() => this._activeTab());

  readonly quote = signal<Quote>(QuoteUtil.getQuoteOfDay());

  select(tab: TabType): void {
    if (this._activeTab() !== tab) {
      this._activeTab.set(tab);
    }
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.syllabusStore
      .getIdMap$()
      .pipe(
        switchMap((map) => {
          if (!map) return of(null);

          this.classFileId = map[this.classId];

          return forkJoin({
            syllabus: this.syllRepo.loadClass(this.classFileId).pipe(catchError(() => of(null))),
            meetings: this.meetApi.getMeetingsForClass(this.classId).pipe(catchError(() => of(null))),
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

  setMeetings(data: Meeting[]): void {
    this.meetings.set(data);
  }

  onPuzzleCompleted(id: string) {
    console.log('Puzzle completed:', id);

    // example:
    // give XP
    // unlock next lesson
    // call API
  }
}
