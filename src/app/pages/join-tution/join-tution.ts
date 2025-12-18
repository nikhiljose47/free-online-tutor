import { Component, ChangeDetectionStrategy, Input, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SyllabusLookupService } from '../../services/syllabus/syllabus-lookup.service';
import { ActivatedRoute } from '@angular/router';
import { Meeting } from '../../models/meeting.model';
import { UiStateUtil } from '../../utils/ui-state.utils';

@Component({
  selector: 'join-tution',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './join-tution.html',
  styleUrls: ['./join-tution.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JoinTution {
  private route = inject(ActivatedRoute);
  private uiUtil = inject(UiStateUtil)
  
  meetingId = this.route.snapshot.paramMap.get('meetingId')!;
 
  // Inputs (fallbacks if no meeting selected)
  @Input() banner = '/assets/fam-problem.jpg';
  @Input() students = 15;
  @Input() rating = 4.7;

  //temp
  description = 'desc';

  meeting = computed(() => this.uiUtil.get<Meeting>(this.meetingId));

  private syllabus = inject(SyllabusLookupService);

  /** 🔥 Derived title */
  title = computed(() => {
    const m = this.meeting();
    if (!m) return '';
    const chapter = this.syllabus.getChapterByCode(m.chapterCode);
    return chapter?.chapter.name ?? '';
  });

  /** 🔥 Derived teacher (subjectId → display name expansion can be added later) */
  teacher = computed(() => this.meeting()?.teacherName ?? '');

  /** 🔥 Meeting link */
  joinLink = computed(() => this.meeting()?.meetLink ?? '');

  /** 🔥 Duration placeholder (if you want dynamic later) */
  duration = signal('1h 30m');

  constructor() {
    // Debug — prints whenever selected meeting changes
    // effect(() => console.log("Selected meeting:", this.meeting()));
  }

  goToJoin() {
    if (this.joinLink()) {
      window.open(this.joinLink(), '_blank');
    }
  }

  async shareClass() {
    const shareData = {
      title: this.title(),
      text: `Join ${this.title()} by ${this.teacher()}`,
      url: this.joinLink(),
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error(err);
      }
    } else {
      await navigator.clipboard.writeText(this.joinLink());
      alert('Link copied to clipboard!');
    }
  }
}
