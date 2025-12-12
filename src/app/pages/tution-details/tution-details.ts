import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Timetable } from '../timetable/timetable';
import { ContentPlaceholder } from '../../components/content-placeholder/content-placeholder';
import { MeetingStore } from '../../services/store/meeting-store';

@Component({
  selector: 'tution-details',
  standalone: true,
  imports: [CommonModule, Timetable, ContentPlaceholder],
  templateUrl: './tution-details.html',
  styleUrl: './tution-details.scss',
})
export class TutionDetails implements OnInit {
  private route = inject(ActivatedRoute);

  hasValidData = signal(true);

  type = this.route.snapshot.paramMap.get('type')!; // class | jam
  id = this.route.snapshot.paramMap.get('id')!;

  // Mocked — replace with Firestore queries later
  quote = signal('Learning never exhausts the mind. — Leonardo da Vinci');

  examPrep = signal([
    { title: 'NCERT-Based Revision', level: 'High Yield' },
    { title: 'Previous Year Analysis', level: 'Important' },
    { title: 'Speed Maths / Logic', level: 'Tricky' },
  ]);

  teachers = signal([
    { name: 'Aditi Sharma', subject: 'Maths', avatar: './assets/teacher1.jpg' },
    { name: 'Karan Patel', subject: 'Science', avatar: './assets/teacher2.jpg' },
  ]);

  jamInfo = signal({
    host: 'Rohit Sen',
    topic: 'GATE Quick Problem Solving',
    starts: '5:30 PM',
    participants: 140,
  });

  constructor(private meetingStore: MeetingStore) {}

  ngOnInit(): void {
          console.log('came onINit');

    this.meetingStore.loadClassMeetings(this.id).subscribe((res) => {
      console.log('came onINit in', res.ok, res.data);
      if (res.data?.length == 0) {
              console.log('came onINit not ok');

        this.hasValidData.set(false);
      }
    });
  }
}
