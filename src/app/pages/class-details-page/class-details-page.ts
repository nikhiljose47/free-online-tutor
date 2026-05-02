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
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CurrentClassState } from '../../models/ui-state/current-class-state.model';
import { CUR_CLASS_INFO } from '../../core/constants/app.constants';
import { ClassBatchDocService } from '../../services/class/batch-doc/batch-doc.service';
import { BatchDoc } from '../../models/batch/batch-doc.model';
import { ClassLookupService } from '../../services/syllabus/class-lookup/class-lookup.service';
import { ContentPlaceholder } from '../../components/content-placeholder/content-placeholder';

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
    ContentPlaceholder,
    ClassScheduleListComponent,
    AiTutorChatComponent,
    ClassOverviewComponent,
  ],
})
export class ClassDetailsPage implements OnInit {
  private platformId = inject(PLATFORM_ID);
  private route = inject(ActivatedRoute);
  private uiUtil = inject(UiStateUtil);
  private batchDocApi = inject(ClassBatchDocService);
  private classLookup = inject(ClassLookupService);
  private destroyRef = inject(DestroyRef);

  readonly classId = this.getValidClassId();
  hasDataErr = signal(false);
  hasData = false;
  syllabus = signal<ClassSyllabus | null>(null);
  className = signal<string>('Class');
  batchDoc = signal<BatchDoc | null>(null);

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

  private getValidClassId(): string {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigate([''], { replaceUrl: true });
      return '';
    }
    return id;
  }

  ngOnInit(): void {
    this.loadClass();
    this.getBatchDoc$().subscribe((res) => {
      this.uiUtil.set<CurrentClassState>(CUR_CLASS_INFO, {
        classId: this.batchDoc()?.curClassId ?? '',
        className: this.className(),
      });
    });
  }

  private loadClass() {
    this.classLookup.load(this.classId).subscribe((ready) => {
      console.log('Class data load status for', this.classId, ':', ready);
      if (ready) {
        this.className.set(this.classLookup.getClassName(this.classId));
        this.syllabus.set(this.classLookup.get(this.classId)); // safe to use sync getters
        // safe to use sync getters
        this.hasData = true;
      } else {
        this.hasDataErr.set(true);
      }
    });
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

  getBatchDoc$() {
    return this.batchDocApi.getFast(this.classId, 'blue').pipe(
      tap((doc) => {
        if (doc) this.batchDoc.set(doc);
      }),
    );
  }
}
