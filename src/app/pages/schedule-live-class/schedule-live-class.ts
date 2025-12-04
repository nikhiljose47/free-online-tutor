import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Firestore, collection, addDoc, Timestamp, updateDoc, doc } from '@angular/fire/firestore';
import { LIVE } from '../../core/constants/app.constants';

@Component({
  selector: 'schedule-live-class',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './schedule-live-class.html',
  styleUrl: './schedule-live-class.scss',
})
export class ScheduleLiveClass {
  // Form as signals
  classId = signal('');
  subjectId = signal('');
  batchId = signal('');
  meetLink = signal('');
  chapterCode = signal('');
  date = signal(''); // datetime-local → string

  submitting = signal(false);
  meetingId = signal<string | null>(null);

  constructor(private db: Firestore) {}

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
