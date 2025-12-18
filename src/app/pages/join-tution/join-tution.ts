import { ChangeDetectionStrategy, Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Meeting } from '../../models/meeting.model';
import { UiStateUtil } from '../../utils/ui-state.utils';
import { SyllabusLookupService } from '../../services/syllabus/syllabus-lookup.service';
import { Timestamp } from '@angular/fire/firestore';

@Component({
  selector: 'join-tution',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './join-tution.html',
  styleUrls: ['./join-tution.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JoinTution implements OnInit {
  private route = inject(ActivatedRoute);
  private uiUtil = inject(UiStateUtil);
  private syllabus = inject(SyllabusLookupService);

  /* ---------------- derived (simple values) ---------------- */
  meeting = signal<Meeting | null>(null);
  banner: string = '/assets/fam-problem.jpg';
  meetingId!: string;
  students: number = 15;
  rating: number = 4.7;
  title = '';
  teacher = '';
  joinLink = '';
  duration = '30m - 40 min';
  description = 'desc';
  isUpcoming: boolean = false;

  ngOnInit(): void {
    this.meetingId = this.route.snapshot.paramMap.get('meetingId')!;

    const m = this.uiUtil.get<Meeting>(this.meetingId);
    if (!m) return;

    this.meeting.set(m);

    /* hydrate UI fields once */
    this.teacher = m.teacherName;
    this.joinLink = m.meetLink;

    if (m.date > Timestamp.fromDate(new Date())) {
      this.isUpcoming = true;
    }

    const chapter = this.syllabus.getChapterByCode(m.chapterCode);
    this.title = chapter?.chapter.name ?? '';
  }

  goToJoin(): void {
    if (this.isUpcoming) {
      return;
    }
    if (this.joinLink) {
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
