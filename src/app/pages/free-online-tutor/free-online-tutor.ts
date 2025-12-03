import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RoadmapCacheService } from '../../services/cache/roadmap-cache.service';
import { ToastService } from '../../services/toast.service';
import { Router } from '@angular/router';
import { Auth2Service } from '../../services/fire/auth2.service';
import { FirestoreDocService } from '../../services/fire/firestore-doc.service';
import { Jam } from '../../models/jam.model';

export interface RoadmapCard {
  title: string;
  subtitle: string;
  image: string;
}

export interface LiveClassModel {
  id: string;
  title: string;
  teacher: string;
  time: string;
  isLive: boolean; // show green dot
}

@Component({
  selector: 'free-online-tutor',
  imports: [CommonModule],
  templateUrl: './free-online-tutor.html',
  styleUrl: './free-online-tutor.scss',
})
export class FreeOnlineTutor {
  private cache = inject(RoadmapCacheService);
  
  constructor(
    private toast: ToastService,
    private route: Router,
    private auth: Auth2Service,
    private fire: FirestoreDocService
  ) {
    let user = this.auth.user;
    if (user()) {
      console.log('Logged in found! ', user()?.uid);
    } else {
      console.log('No logged in data!');
    }

    let x = fire.getOnce('jam', 'fiEd16NQAKZAJM0qsqaD');
    console.log(x);
    this.fire.getOnce<Jam>('jam', 'fiEd16NQAKZAJM0qsqaD').subscribe((res) => {
      if (res) {
        console.log('DATA:', res);
      } else {
        console.log('ERROR:', res);
      }
    });
  }

  upcomingClasses = signal([
    {
      id: '1',
      title: 'English – Grammar',
      teacher: 'Priya',
      time: '5:00 PM',
      subject: 'Maths',
      viewers: 3,
      isLive: false,
      image: './assets/abbu.jpg',
    },
    {
      id: '2',
      title: 'Chemistry – Bonds',
      teacher: 'Vishal',
      time: '1:30 PM',
      subject: 'Maths',
      viewers: 3,
      isLive: false,
      image: './assets/abbu.jpg',
    },
    {
      id: '3',
      title: 'Biology – Cells',
      teacher: 'Nisha',
      time: '3:00 PM',
      subject: 'Maths',
      viewers: 3,
      isLive: false,
      image: './assets/abbu.jpg',
    },
  ]);
  liveClasses = signal([
    {
      id: '1',
      title: 'Maths – Algebra',
      teacher: 'Anjali',
      time: 'Live Now',
      isLive: true,
      subject: 'Maths',
      viewers: 3,
      image: './assets/abbu.jpg',
    },
    {
      id: '2',
      title: 'Physics – Motion',
      teacher: 'Rahul',
      time: 'Starting in 10m',
      subject: 'Maths',
      viewers: 3,
      isLive: false,
      image: './assets/abbu.jpg',
    },
  ]);

  // 12 sections for classes 1–12
  classSections = signal(
    Array.from({ length: 12 }, (_, i) => ({
      class: `Class ${i + 1}`,
      cards: this.cache.cards(),
    }))
  );

  onUpcomingClick(live: LiveClassModel): void {
    // Example: open modal, navigate, play video, etc.
    // this.toast.show(`Opening ${live.title}`);
    this.route.navigate(['/timetable']);
  }

  onLiveClick(live: LiveClassModel): void {
    // Example: open modal, navigate, play video, etc.
    // this.toast.show(`Opening ${live.title}`);
    this.route.navigate(['/join-tution']);
  }
}
