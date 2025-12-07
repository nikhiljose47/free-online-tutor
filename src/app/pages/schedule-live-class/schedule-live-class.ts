import { Component, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Firestore, collection, addDoc, Timestamp, updateDoc, doc } from '@angular/fire/firestore';
import { LIVE } from '../../core/constants/app.constants';
import { SyllabusLookupService } from '../../services/syllabus/syllabus-lookup.service';
import { Validator } from '../../utils/validator.util';
import { Auth2Service } from '../../services/fire/auth2.service';
import { UserProfileService } from '../../services/fire/user-profile.service';

@Component({
  selector: 'schedule-live-class',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './schedule-live-class.html',
  styleUrl: './schedule-live-class.scss',
})
export class ScheduleLiveClass {
  profile = inject(UserProfileService).profile;
  
  // Form as signals
  classId = signal('');
  subjectId = signal('');
  batchId = signal('');
  meetLink = signal('');
  chapterCode = signal('');
  date = signal(''); // datetime-local → string

  submitting = signal(false);
  meetingId = signal<string | null>(null);
  syllabus = inject(SyllabusLookupService);

  classList = computed(() => this.syllabus.getClassNames());

  subjectList = computed(() => (this.classId() ? this.syllabus.getSubjects(this.classId()) : []));

  chapterList = computed(() =>
    this.classId() && this.subjectId()
      ? this.syllabus.getChapters(this.classId(), this.subjectId())
      : []
  );

  isMeetLinkValid = computed(() => Validator.isMeetingLink(this.meetLink()));

  constructor(private db: Firestore) {
    effect(() => {
      console.log('🔥 Profile updated:', this.profile());
    });
  }

  async scheduleClass() {
    this.submitting.set(true);

    const payload = {
      classId: this.classId(),
      subjectId: this.subjectId(),
      batchId: this.batchId(),
      meetLink: this.meetLink(),
      chapterCode: this.chapterCode(),
      status: LIVE,
      date: Timestamp.fromDate(new Date(this.date())),
    };

    const ref = await addDoc(collection(this.db, 'global_meetings'), payload);
    this.meetingId.set(ref.id);

    this.submitting.set(false);
  }

  onMeetLinkInput(event: any) {
    this.meetLink.set(event.target.value);
  }

  async endClass() {
    if (!this.meetingId()) return;

    const ref = doc(this.db, 'global_meetings', this.meetingId()!);

    await updateDoc(ref, {
      status: 'completed',
      endedAt: Timestamp.now(),
    });

    alert('Class ended & attendance recorded.');
  }
}
