import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  OnInit,
  effect,
  PLATFORM_ID,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Meeting } from '../../models/meeting.model';
import { UiStateUtil } from '../../shared/state/ui-state.utils';
import { Timestamp } from '@angular/fire/firestore';
import { AttendanceApiService } from '../../services/attendance/attendance-api.service';
import { UserProfileService } from '../../core/services/fire/user-profile.service';
import { catchError, EMPTY, filter, forkJoin, map, Observable, switchMap, tap } from 'rxjs';
import { ContentPlaceholder } from '../../components/content-placeholder/content-placeholder';
import { DotLoader } from '../../components/dot-loader/dot-loader';
import { ToastService } from '../../shared/toast.service';
import { PLACEHOLDER__COVER_IMG } from '../../core/constants/app.constants';
import { toSignal } from '@angular/core/rxjs-interop';
import { MeetingStatusStore } from '../../shared/state/meeting-status.store';
import { CoverPlaceholderComponent } from '../../shared/components/cover-placeholder.component/cover-placeholder.component';
import { UserCourseSyncService } from '../../services/user/user-course-sync/user-course-sync.service';
import { ClassLookupService } from '../../services/syllabus/class-lookup/class-lookup.service';

@Component({
  selector: 'join-tution',
  standalone: true,
  imports: [CommonModule, ContentPlaceholder, DotLoader, CoverPlaceholderComponent],
  templateUrl: './join-tution.html',
  styleUrls: ['./join-tution.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JoinTution {
  private route = inject(ActivatedRoute);
  private user = inject(UserProfileService);
  private uiUtil = inject(UiStateUtil);
  private attendanceApi = inject(AttendanceApiService);
  private toastApi = inject(ToastService);
  private statusStore = inject(MeetingStatusStore);
  private userCourseSyncApi = inject(UserCourseSyncService);
  private classLookup = inject(ClassLookupService); 
  private platformId = inject(PLATFORM_ID);

  hasCoverImgErr = signal<boolean>(false);

  private meetingId$ = this.route.paramMap.pipe(
    map((p) => p.get('meetingId')),
    filter((id): id is string => !!id),
  );

  readonly meetingId = toSignal(this.meetingId$, { initialValue: null });

  isUpcoming = signal(false);

  private syncStatus = effect(() => {
    const id = this.meetingId();
    if (!id) return;

    const state = this.statusStore.getState(id)();
    this.isUpcoming.set(state === 'upcoming');
  });
  /* ---------------- derived (simple values) ---------------- */

  readonly profile = this.user.profile();
  isLoading = signal<boolean>(true);
  hasErr = signal<boolean>(true);
  errMsg = signal<string>('We are facing some issue..');
  hasmarkedInterest = signal<boolean>(false);
  meeting!: Meeting;
  banner: string = '/assets/book-covers/hi-text.webp';
  students: number = 1;
  rating: number = 4.7;
  title = '';
  teacher = '';
  joinLink = '';
  duration = '30m - 40 min';
  description = 'desc';
  users: Array<string> = [];

  constructor() {
    this.meetingId$.pipe(switchMap((id) => this.init$(id))).subscribe();
  }

  init$(meetingId: string): Observable<any> {
    this.isLoading.set(true);
    this.hasErr.set(false);

    const meetData = this.uiUtil.get<Meeting>(meetingId);

    if (!meetData) {
      this.errMsg.set('No data found');
      this.isLoading.set(false);
      this.hasErr.set(true);
      return EMPTY;
    }

    if (!this.profile) {
      this.errMsg.set('No user found!');
      this.isLoading.set(false);
      this.hasErr.set(true);
      return EMPTY;
    }

    this.meeting = meetData;

    return this.loadAttendanceAndUsers(meetData).pipe(
      tap((res) => {
        this.hasmarkedInterest.set(res.attended.attended);
        this.users = res.users.users;
        this.setData();
        this.isLoading.set(false);
        this.hasErr.set(false);
      }),
      catchError(() => {
        this.errMsg.set('Server error while fetching data..');
        this.isLoading.set(false);
        this.hasErr.set(true);
        return EMPTY;
      }),
    );
  }

  setData() {
    let meeting = this.meeting;
    /* hydrate UI fields once */
    this.teacher = meeting.teacherName;
    this.joinLink = meeting.meetLink;
    this.students = this.users.length + 2;
    this.banner = meeting.imageSrc;

    if (meeting.date > Timestamp.fromDate(new Date())) {
      //  this.isUpcoming = true;
    }
    
    const chapter = this.classLookup.getChapterByCode(meeting.classId, meeting.subjectId, meeting.chapterCode);
    this.title = chapter.name;
  }

  loadAttendanceAndUsers(meeting: Meeting) {
    return forkJoin({
      attended: this.attendanceApi.hasAttendedToday(this.profile!.uid, meeting.classId),
      users: this.attendanceApi.getUsersBySubjectCode(meeting.classId, 1, 50),
    });
  }

  onClickInterestBtn(): void {
    if (this.isUpcoming() && !this.hasmarkedInterest()) {
      this.attendanceApi
        .markAttendanceOnce(this.profile!.uid, this.meeting.classId ?? '')
        .subscribe({
          next: (s) => {
            this.hasmarkedInterest.set(true);
          },
          error: (err) => {
            let text = 'Err:' + err + '.Please try again.';
            this.toastApi.show(text);
          },
        });
      this.syncCourse();
    } else if (this.joinLink) {
      if (isPlatformBrowser(this.platformId)) {
        window.open(this.joinLink, '_blank');
      }
      this.syncCourse();
    }
  }

  syncCourse() {
    if (this.profile) {
      this.userCourseSyncApi.enroll(this.profile!.uid, this.meeting.classId);
    }
  }

  async shareClass(): Promise<void> {
    const shareData = {
      title: this.title,
      text: `Join ${this.title} by ${this.teacher}`,
      url: this.joinLink,
    };

    const joinInfo = `Hey! You can join the online class ${this.title} by ${this.teacher} at ${this.joinLink}`;

    if (navigator.share) {
      await navigator.share(shareData);
    } else {
      await navigator.clipboard.writeText(joinInfo);
      alert('Link copied to clipboard!');
    }
  }

  getBannerSrc(src?: string | null): string {
    return src || PLACEHOLDER__COVER_IMG;
  }

  onImgError(event: Event) {
    this.hasCoverImgErr.set(true);
    (event.target as HTMLImageElement).src = PLACEHOLDER__COVER_IMG;
  }

  getBannerAlt(item: any): string {
    return item?.label ? `${item.label} banner` : 'Class banner';
  }
}
