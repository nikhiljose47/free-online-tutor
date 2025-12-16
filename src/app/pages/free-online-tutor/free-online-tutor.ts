import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { RoadmapCacheService } from '../../services/cache/roadmap-cache.service';
import { ToastService } from '../../services/shared/toast.service';
import { Router } from '@angular/router';
import { Auth2Service } from '../../services/fire/auth2.service';
import { Jam } from '../../models/jam.model';
import { LearningSkeleton } from '../../components/learning-skeleton/learning-skeleton';

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
  imports: [CommonModule, LearningSkeleton],
  templateUrl: './free-online-tutor.html',
  styleUrl: './free-online-tutor.scss',
})
export class FreeOnlineTutor implements OnInit {
  private cache = inject(RoadmapCacheService);
  classLoading = signal(true);
  jamLoading = signal(true);

  skeletonCount = Array(5); // 6 placeholders
  constructor(private toast: ToastService, private router: Router, private auth: Auth2Service) {
    let user = this.auth.user;
    if (user()) {
      // console.log('Logged in found! ', user()?.uid);
    } else {
      console.log('No logged in data!');
    }
  }

  classCategories = signal([
    {
      id: 'CL1',
      name: 'Class 1',
      students: 120,
      teachers: 4,
      medium: ['EN', 'HI'],
      image: '/assets/fam-problem.jpg',
    },
    {
      id: 'CL2',
      name: 'Class 2',
      students: 160,
      teachers: 5,
      medium: ['EN'],
      image: '/assets/fam-problem.jpg',
    },
    {
      id: 'CL3',
      name: 'Class 3',
      students: 210,
      teachers: 6,
      medium: ['HI'],
      image: '/assets/fam-problem.jpg',
    },
    {
      id: 'CL4',
      name: 'Class 4',
      students: 10,
      teachers: 3,
      medium: ['HI'],
      image: '/assets/fam-problem.jpg',
    },
    {
      id: 'CL5',
      name: 'Class 5',
      students: 10,
      teachers: 3,
      medium: ['HI'],
      image: '/assets/fam-problem.jpg',
    },
    {
      id: 'CL06',
      name: 'Class 6',
      students: 10,
      teachers: 3,
      medium: ['HI'],
      image: '/assets/fam-problem.jpg',
    },
    {
      id: 'CL7',
      name: 'Class 7',
      students: 10,
      teachers: 3,
      medium: ['HI'],
      image: '/assets/fam-problem.jpg',
    },
  ]);

  jamSessions = signal([
    {
      id: 'jam101',
      title: 'GATE Rapid JAM',
      students: 180,
      teacher: 'Prof. Rao',
      lang: ['EN'],
      time: 'Live',
      image: '/assets/fam-problem.jpg',
    },
    {
      id: 'jam202',
      title: 'CAT Quant JAM',
      students: 140,
      teacher: 'Ananya',
      lang: ['HI'],
      time: 'Soon',
      image: '/assets/fam-problem.jpg',
    },
  ]);

  actSessions = signal([
    {
      id: 'jam101',
      title: 'Yoga Activity',
      students: 180,
      teacher: 'Prof. Rao',
      lang: ['EN'],
      time: 'Live',
      image: '/assets/fam-problem.jpg',
    },
    {
      id: 'jam202',
      title: 'Violin Activity',
      students: 140,
      teacher: 'Ananya',
      lang: ['HI'],
      time: 'Soon',
      image: '/assets/fam-problem.jpg',
    },
  ]);

  ngOnInit() {
    // Simulate Firestore load
    // setTimeout(() => {
    //   this.classLoading.set(false);
    //   this.jamLoading.set(false);
    // }, 1200);
     this.classLoading.set(false);
    this.jamLoading.set(false);
  }
  openCategory(cls: any) {
    this.router.navigate(['/details', 'class', cls.id]);
  }

  joinJam(jam: any) {
    this.router.navigate(['/details', 'jam', jam.id]);
  }

  // 12 sections for classes 1–12
  classSections = signal(
    Array.from({ length: 12 }, (_, i) => ({
      class: `Class ${i + 1}`,
      cards: this.cache.cards(),
    }))
  );
}
