import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { RoadmapCacheService } from '../../services/cache/roadmap-cache.service';
import { ToastService } from '../../services/shared/toast.service';
import { SvgCardConfig } from '../../utils/svg-loader.utils';
import { HomeIntroStrip } from '../../components/home-intro-strip/home-intro-strip';
import { UiStateUtil } from '../../utils/ui-state.utils';
import { SyllabusIndex } from '../../resolvers/index-resolver';

/* ===============================
   COMPONENT
================================ */
@Component({
  selector: 'free-online-tutor',
  standalone: true,
  imports: [CommonModule, HomeIntroStrip],
  templateUrl: './free-online-tutor.html',
  styleUrl: './free-online-tutor.scss',
})
export class FreeOnlineTutor implements OnInit {
  /* ===============================
     INJECTIONS
  =============================== */
  private router = inject(Router);
  private toast = inject(ToastService);
  private cache = inject(RoadmapCacheService);
  private sanitizer = inject(DomSanitizer);
  private uiState = inject(UiStateUtil);

  /* ===============================
     UI STATE
  =============================== */
  classLoading = signal(true);
  jamLoading = signal(true);
  svg = signal<SafeHtml>('');
  skeletonCount = Array(5);

  /* ===============================
     DATA STATE (NO HARDCODE)
  =============================== */
  classCategories = signal<any[]>([]);
  jamSessions = signal<any[]>([]);
  actSessions = signal<any[]>([]);

  /* ===============================
     INIT
  =============================== */
  ngOnInit() {
    const index = this.uiState.get<SyllabusIndex>('syllabusIndex');

    if (!index) {
      this.toast.show('Homepage data unavailable');
      this.classLoading.set(false);
      this.jamLoading.set(false);
      return;
    }

    this.processClasses(index.classes);
    this.processJams(index.jamSessions);
    this.processActivities(index.activities);

    this.classLoading.set(false);
    this.jamLoading.set(false);
  }

  /* ===============================
     PROCESSORS
  =============================== */
  private processClasses(classes: SyllabusIndex['classes']) {
    const now = Date.now();

    const result = (classes ?? [])
      .filter(
        (c) =>
          c?.enabled === true &&
          c?.ready === true &&
          !!c.availableFrom &&
          new Date(c.availableFrom).getTime() <= now
      )
      .sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0))
      .map((c) => ({
        id: c.id,
        name: c.label ?? '',
        students: c.meta?.students ?? 0,
        teachers: c.meta?.teachers ?? 0,
        medium: Array.isArray(c.meta?.medium) ? c.meta.medium : [],
        image: c.meta?.image ?? '',
      }));
    this.classCategories.set(result);
  }

  private processJams(jams: SyllabusIndex['jamSessions']) {
    const result = jams
      .filter((j) => j.enabled)
      .sort((a, b) => a.priority - b.priority)
      .map((j) => ({
        id: j.id,
        title: j.title,
        teacher: j.meta.teacher,
        lang: j.meta.language,
        time: j.isLive ? 'Live' : 'Soon',
        isLive: j.isLive,
        image: j.meta.image,
      }));

    this.jamSessions.set(result);
  }

  private processActivities(acts: SyllabusIndex['activities']) {
    const result = acts
      .filter((a) => a.enabled)
      .sort((a, b) => a.priority - b.priority)
      .map((a) => ({
        id: a.id,
        title: a.title,
        teacher: a.meta.teacher,
        time: 'Soon',
        image: a.meta.image,
      }));

    this.actSessions.set(result);
  }

  /* ===============================
     SVG (UNCHANGED)
  =============================== */
  load(cfg: SvgCardConfig) {
    // intentionally unchanged
  }

  /* ===============================
     NAVIGATION
  =============================== */
  openCategory(cls: any) {
    this.router.navigate(['/details', 'class', cls.id]);
  }

  joinJam(jam: any) {
    this.router.navigate(['/details', 'jam', jam.id]);
  }

  /* ===============================
     CLASS SECTIONS (UNCHANGED)
  =============================== */
  classSections = signal(
    Array.from({ length: 12 }, (_, i) => ({
      class: `Class ${i + 1}`,
      cards: this.cache.cards(),
    }))
  );
}

// classCategories = signal([
//   {
//     id: 'CL1',
//     name: 'Class 1',
//     students: 120,
//     teachers: 4,
//     medium: ['EN', 'HI'],
//     image: '/assets/card-covers/class1.webp',
//   },
//   {
//     id: 'CL2',
//     name: 'Class 2',
//     students: 160,
//     teachers: 5,
//     medium: ['EN'],
//     image: '/assets/card-covers/class2.webp',
//   },
//   {
//     id: 'CL3',
//     name: 'Class 3',
//     students: 210,
//     teachers: 6,
//     medium: ['HI'],
//     image: '/assets/card-covers/class3.webp',
//   },
//   {
//     id: 'CL4',
//     name: 'Class 4',
//     students: 10,
//     teachers: 3,
//     medium: ['HI'],
//     image: '/assets/card-covers/class4.webp',
//   },
//   {
//     id: 'CL5',
//     name: 'Class 5',
//     students: 10,
//     teachers: 3,
//     medium: ['HI'],
//     image: '/assets/card-covers/class5.webp',
//   },
//   {
//     id: 'CL06',
//     name: 'Class 6',
//     students: 10,
//     teachers: 3,
//     medium: ['HI'],
//     image: '/assets/card-covers/class6.webp',
//   },
//   {
//     id: 'CL7',
//     name: 'Class 7',
//     students: 10,
//     teachers: 3,
//     medium: ['HI'],
//     image: '/assets/fam-problem.jpg',
//   },
// ]);

// jamSessions = signal([
//   {
//     id: 'jam101',
//     title: 'GATE Rapid JAM',
//     students: 180,
//     teacher: 'Prof. Rao',
//     lang: ['EN'],
//     time: 'Live',
//     image: '/assets/fam-problem.jpg',
//   },
//   {
//     id: 'jam202',
//     title: 'CAT Quant JAM',
//     students: 140,
//     teacher: 'Ananya',
//     lang: ['HI'],
//     time: 'Soon',
//     image: '/assets/fam-problem.jpg',
//   },
// ]);

// actSessions = signal([
//   {
//     id: 'jam101',
//     title: 'Yoga Activity',
//     students: 180,
//     teacher: 'Prof. Rao',
//     lang: ['EN'],
//     time: 'Live',
//     image: '/assets/fam-problem.jpg',
//   },
//   {
//     id: 'jam202',
//     title: 'Violin Activity',
//     students: 140,
//     teacher: 'Ananya',
//     lang: ['HI'],
//     time: 'Soon',
//     image: '/assets/fam-problem.jpg',
//   },
//   {
//     id: 'jam222',
//     title: 'General Aptitude',
//     students: 140,
//     teacher: 'Ananya',
//     lang: ['HI'],
//     time: 'Soon',
//     image: '/assets/card-covers/general-aptitude.webp',
//   },
//      {
//     id: 'jam222',
//     title: 'Mental Support',
//     students: 140,
//     teacher: 'Ananya',
//     lang: ['HI'],
//     time: 'Soon',
//     image: '/assets/card-covers/general-aptitude.webp',
//   },
//        {
//     id: 'jam224',
//     title: 'Coding tips & talk',
//     students: 140,
//     teacher: 'Nikhil',
//     lang: ['HI'],
//     time: 'Soon',
//     image: '/assets/card-covers/general-aptitude.webp',
//   },
//       {
//     id: 'jam224',
//     title: 'Share Market Ideas',
//     students: 140,
//     teacher: 'Anandhu D',
//     lang: ['HI'],
//     time: 'Soon',
//     image: '/assets/card-covers/general-aptitude.webp',
//   },
// ]);
