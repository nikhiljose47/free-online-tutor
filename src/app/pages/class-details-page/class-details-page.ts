import {
  Component,
  signal,
  inject,
  OnInit,
  computed,
  PLATFORM_ID,
  effect,
  DestroyRef,
} from '@angular/core';
import { Timetable } from '../../components/timetable/timetable';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ClassOverviewComponent } from '../../shared/components/class-overview.component/class-overview.component';
import { catchError, forkJoin, of, switchMap, tap } from 'rxjs';
import { SyllabusRepository } from '../../domain/repositories/syllabus.repository';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ClassSyllabus } from '../../models/syllabus/class-syllabus.model';
import { UserCardlist } from '../../shared/components/user-card-list/user-card-list';
import { FaqList } from '../../shared/components/faq-list/faq-list';
import { ClassScheduleListComponent } from '../../shared/components/class-schedule-list/class-schedule-list';
import { Quote } from '../../models/quote.model';
import { QuoteUtil } from '../../shared/utils/quote.utils';
import { AiTutorChatComponent } from '../../shared/components/ai-tutor-chat.component/ai-tutor-chat.component';
import { UiStateUtil } from '../../shared/state/ui-state.utils';
import { SyllabusIndexService } from '../../services/syllabus/syllabus-index/syllabus-index.service';
import { ClassDocService } from '../../services/class/class-doc/class-doc';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ClassDoc } from '../../models/classes/class-doc.model';
import { CurClassInfo } from '../../models/common/common.model';
import { CUR_CLASS_INFO } from '../../core/constants/app.constants';

type TabType = 'overview' | 'live' | 'curriculum' | 'ai';

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
    Timetable,
    CommonModule,
    UserCardlist,
    FaqList,
    ClassScheduleListComponent,
    AiTutorChatComponent,
    ClassOverviewComponent,
  ],
})
export class ClassDetailsPage implements OnInit {
  private platformId = inject(PLATFORM_ID);

  private syllabusIndexApi = inject(SyllabusIndexService);
  private syllRepo = inject(SyllabusRepository);
  private route = inject(ActivatedRoute);
  private uiUtil = inject(UiStateUtil);
  private classDocApi = inject(ClassDocService);

  private destroyRef = inject(DestroyRef);

  readonly classId = this.getValidClassId();
  readonly isLoading = signal(true);
  readonly hasValidData = signal(false);

  syllabus = signal<ClassSyllabus | null>(null);
  className = signal<string>('Class');
  classDoc = signal<ClassDoc | null>(null);

  aiContext = computed(() => `${this.syllabus()?.className ?? ''}`);

  classFileId: string = '';

  readonly stats = signal<ClassStat[]>([
    { value: '12,500+', label: 'Students learning in this class' },
    { value: '28', label: 'States actively connected' },
    { value: '4,200+', label: 'Hours of guided sessions' },
    { value: '96%', label: 'Concept clarity satisfaction' },
  ]);

  private readonly _activeTab = signal<TabType>('overview');
  readonly activeMainTab = computed(() => this._activeTab());

  readonly quote = signal<Quote>(QuoteUtil.getQuoteOfDay());
  trackStat = (_: number, item: any) => item.label;
  
  constructor(private router: Router) {
    if (isPlatformBrowser(this.platformId)) {
      this.router.events.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((e) => {
        if (e instanceof NavigationEnd) {
          document.querySelector('.content')?.scrollTo(0, 0);
        }
      });
    }

    effect(() => {
      if (!this.syllabus()) return;
      this.aiContext();
    });
  }

  ngOnInit(): void {
    forkJoin([this.loadData$(), this.getClassDoc$()])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.uiUtil.set<CurClassInfo>(CUR_CLASS_INFO, {
          curClassId: this.classDoc()?.curClassId ?? '',
          className: this.className(),
        });

        this.isLoading.set(false);
      });
  }

  private getValidClassId(): string {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigate([''], { replaceUrl: true });
      return '';
    }
    return id;
  }

  select(tab: TabType): void {
    if (this._activeTab() !== tab) this._activeTab.set(tab);

    if (tab === 'ai' && isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        document.getElementById('tab-content-view')?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      });
    }
  }

  loadData$() {
    return this.syllabusIndexApi.getIdMap$().pipe(
      switchMap((map) => {
        if (!map) return of(null);

        this.classFileId = map[this.classId];

        return this.syllRepo.loadClass(this.classFileId).pipe(catchError(() => of(null)));
      }),
      tap((syllabus) => {
        if (!syllabus) return;

        this.syllabus.set(syllabus);
        this.className.set(syllabus.className);
        this.hasValidData.set(true);
      }),
    );
  }

  getClassDoc$() {
    return this.classDocApi.getFast(this.classId).pipe(
      tap((doc) => {
        if (doc) this.classDoc.set(doc);
      }),
    );
  }
}
