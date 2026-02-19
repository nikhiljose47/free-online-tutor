import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Timestamp } from '@angular/fire/firestore';

import { SyllabusLookupService } from '../../services/syllabus/syllabus-lookup.service';
import { UserProfileService } from '../../core/services/fire/user-profile.service';
import { FirestoreDocService } from '../../core/services/fire/firestore-doc.service';
import { Meeting } from '../../models/meeting.model';
import { PART1, COMPLETED, GLOBAL_MEETINGS } from '../../core/constants/app.constants';
import { Auth2Service } from '../../core/services/fire/auth2.service';
import { ClassWrapup } from '../../components/class-wrapup/class-wrapup';
import { UiStateUtil } from '../../shared/state/ui-state.utils';
import { MeetingsService } from '../../services/meetings/meetings.service';
import { ScheduleLiveClassForm } from '../../components/schedule-live-class-form/schedule-live-class-form';

@Component({
  selector: 'schedule-live-class',
  standalone: true,
  imports: [CommonModule, ClassWrapup, ScheduleLiveClassForm],
  templateUrl: './schedule-live-class.html',
  styleUrl: './schedule-live-class.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScheduleLiveClass implements OnInit {
  /* ------------------ services ------------------ */
  private meetApi = inject(MeetingsService);
  private syllabus = inject(SyllabusLookupService);
  private fire = inject(FirestoreDocService);
  private authApi = inject(Auth2Service);
  private uiStateUtil = inject(UiStateUtil);
  private user = inject(UserProfileService);

  readonly profile = this.user.profile;

  /* ------------------ UI state ------------------ */
  readonly meetings = signal<Meeting[]>([]);
  readonly selectedMeeting = signal<Meeting | null>(null);
  readonly mode = signal<'view' | 'create'>('view');
  readonly submitting = signal(false);
  private teacherId: string | undefined;

  /* ------------------ lookups (signal-safe) ------------------ */
  readonly classList = this.syllabus.classNames;

  batchList = signal<Array<string>>([]);

  /* ------------------ lifecycle ------------------ */
  ngOnInit(): void {
    this.teacherId = this.authApi.uid;
    if (!this.teacherId) return;

    /* load meetings */
    this.meetApi.getLiveMeetingsByTeacher(this.teacherId).subscribe((res) => {
      if (res.ok && res.data) {
        const list = res.data as Meeting[];
        this.meetings.set(list);

        /* cache in UI state */
        list.forEach((m) => this.uiStateUtil.set(m.id, m));
      }
    });
  }

  isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  onScheduleSuccess() {
    console.log('came on last');
    this.mode.set('view');
  }

  /* ------------------ template helpers ------------------ */
  trackByMeetingId(index: number, m: Meeting) {
    return m.id;
  }

  /* ------------------ UI actions ------------------ */
  selectMeeting(m: Meeting) {
    this.selectedMeeting.set(m);
    this.mode.set('view');
  }

  startCreate() {
    this.selectedMeeting.set(null);
    this.mode.set('create');
  }

  endClass() {
    const m = this.selectedMeeting();
    if (!m) return;

    this.fire.update(GLOBAL_MEETINGS, m.id, {
      status: COMPLETED,
      endAt: Timestamp.now(),
    });
  }
}
