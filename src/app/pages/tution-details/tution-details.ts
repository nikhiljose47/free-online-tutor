import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

import { Timetable } from '../../components/timetable/timetable';
import { ContentPlaceholder } from '../../components/content-placeholder/content-placeholder';
import { MeetingsService } from '../../domain/meetings/meetings.service';
import { Loading } from '../../components/loading/loading';

@Component({
  selector: 'tution-details',
  standalone: true,
  imports: [CommonModule, Timetable, ContentPlaceholder, Loading],
  templateUrl: './tution-details.html',
  styleUrl: './tution-details.scss',
})
export class TutionDetails implements OnInit {
  /* ------------------ services ------------------ */
  private route = inject(ActivatedRoute);
  private meetApi = inject(MeetingsService);

  /* ------------------ routing ------------------ */
  type = this.route.snapshot.paramMap.get('type')!; // class | jam
  id = this.route.snapshot.paramMap.get('id')!;

  /* ------------------ state ------------------ */
  isLoading = signal(true);
  hasValidData = signal(false);

  /* ------------------ quote ------------------ */
  quote = signal('Learning never exhausts the mind. — Leonardo da Vinci');

  /* ------------------ overview / batches ------------------ */
  blueBatch = signal({
    started: true,
    percent: 45,
    roadmap: [
      { subject: 'Mathematics', done: 5, total: 12 },
      { subject: 'Science', done: 3, total: 10 },
    ],
  });

  yellowBatch = signal({
    started: false,
    percent: 0,
    roadmap: [] as { subject: string; done: number; total: number }[],
  });

  /* ------------------ exam prep ------------------ */
  examPrep = signal([
    { title: 'NCERT-Based Revision', level: 'High Yield' },
    { title: 'Previous Year Analysis', level: 'Important' },
    { title: 'Speed Maths / Logic', level: 'Tricky' },
  ]);

  /* ------------------ teachers ------------------ */
  teachers = signal([
    {
      name: 'Aditi Sharma',
      subject: 'Mathematics',
      avatar: './assets/teacher1.jpg',
    },
    {
      name: 'Karan Patel',
      subject: 'Science',
      avatar: './assets/teacher2.jpg',
    },
  ]);

  /* ------------------ JAM info ------------------ */
  jamInfo = signal({
    host: 'Rohit Sen',
    topic: 'GATE Quick Problem Solving',
    starts: '5:30 PM',
    participants: 140,
  });

  /* ------------------ lifecycle ------------------ */
  ngOnInit(): void {
      this.loadClassDetails();
  }

  /* ------------------ helpers ------------------ */
  private loadClassDetails(): void {
    this.meetApi.getMeetingsForClass(this.id).subscribe({
      next: (res) => {
        // Later: use this data to compute batch % dynamically
        this.hasValidData.set(true);
      },
      error: () => {
         this.isLoading.set(false);
      },
      complete: () => {
        this.isLoading.set(false);
      },
    });
  }
}
