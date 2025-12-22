import { ChangeDetectionStrategy, Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Meeting } from '../../models/meeting.model';
import { UiStateUtil } from '../../utils/ui-state.utils';
import { SyllabusLookupService } from '../../services/syllabus/syllabus-lookup.service';
import { Timestamp } from '@angular/fire/firestore';
import { AttendanceApiService } from '../../services/http/attendance-api.service';
import { UserProfileService } from '../../services/fire/user-profile.service';
import { UserProfile } from '../../models/user-profile.model';
import { forkJoin } from 'rxjs';
import { ContentPlaceholder } from '../../components/content-placeholder/content-placeholder';
import { DotLoader } from '../../components/dot-loader/dot-loader';
import { ToastService } from '../../services/shared/toast.service';
import { user } from '@angular/fire/auth';

@Component({
  selector: 'join-tution',
  standalone: true,
  imports: [CommonModule, ContentPlaceholder, DotLoader],
  templateUrl: './join-tution.html',
  styleUrls: ['./join-tution.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JoinTution implements OnInit {
  private route = inject(ActivatedRoute);
  private profileApi = inject(UserProfileService);
  private uiUtil = inject(UiStateUtil);
  private syllabus = inject(SyllabusLookupService);
  private attendanceApi = inject(AttendanceApiService);
  private toastApi = inject(ToastService);

  /* ---------------- derived (simple values) ---------------- */

  isLoading = signal<boolean>(true);
  hasErr = signal<boolean>(true);
  errMsg = signal<string>('We are facing some issue..');
  hasmarkedInterest = signal<boolean>(false);

  meeting!: Meeting;
  profile!: UserProfile;
  banner: string = '/assets/fam-problem.jpg';
  students: number = 1;
  rating: number = 4.7;
  title = '';
  teacher = '';
  joinLink = '';
  duration = '30m - 40 min';
  description = 'desc';
  users: Array<string> = [];
  isUpcoming: boolean = false;

  ngOnInit(): void {
    const meetingId = this.route.snapshot.paramMap.get('meetingId')!;
    const m = this.uiUtil.get<Meeting>(meetingId);

    if (!m) {
      this.isLoading.set(false);
      this.errMsg.set('No data found');
      return;
    }
    this.meeting = m;
    //Meeting data loaded.

    const profile = this.profileApi.profile();
    if (!profile) {
      this.isLoading.set(false);
      this.errMsg.set('No user found!');
      return;
    }
    this.profile = profile;

    this.loadAttendanceAndUsers(m).subscribe({
      next: (res) => {
        this.hasmarkedInterest.set(res.attended.attended);
        this.users = res.users.users;
        this.isLoading.set(false);
        this.hasErr.set(false);
      },
      error: (err) => {
        //Attendance/User load failed' +
        this.errMsg.set('Server error while fetching data..');
        this.isLoading.set(false);
        this.hasErr.set(true);
      },
    });

    this.setData();
  }

  setData() {
    let meeting = this.meeting;
    /* hydrate UI fields once */
    this.teacher = meeting.teacherName;
    this.joinLink = meeting.meetLink;
    this.students = this.users.length + 2;

    if (meeting.date > Timestamp.fromDate(new Date())) {
      this.isUpcoming = true;
    }

    const chapter = this.syllabus.getChapterByCode(meeting.chapterCode);
    this.title = chapter?.chapter.name ?? '';
  }

  loadAttendanceAndUsers(meeting: Meeting) {
    return forkJoin({
      attended: this.attendanceApi.hasAttendedToday(this.profile.uid, meeting.classId),
      users: this.attendanceApi.getUsersBySubjectCode(meeting.classId, 1, 50),
    });
  }

  onClickInterestBtn(): void {
    if (this.isUpcoming && !this.hasmarkedInterest()) {
      this.attendanceApi
        .markAttendanceOnce(this.profile.uid, this.meeting.classId ?? '')
        .subscribe({
          next: (s) => {
            this.hasmarkedInterest.set(true);
          },
          error: (err) => {
            let text = 'Err:' + err + '.Please try again.';
            this.toastApi.show(text);
          },
        });
    } else if (this.joinLink) {
      window.open(this.joinLink, '_blank');
    }
  }

  async shareClass(): Promise<void> {
    const shareData = {
      title: this.title,
      text: `Join ${this.title} by ${this.teacher}`,
      url: this.joinLink,
    };

    if (navigator.share) {
      await navigator.share(shareData);
    } else {
      await navigator.clipboard.writeText(this.joinLink);
      alert('Link copied to clipboard!');
    }
  }
}
