import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { RoadmapCacheService } from '../../services/cache/roadmap-cache.service';
import { ToastService } from '../../shared/toast.service';
import { HomeIntroStrip } from '../../components/home-intro-strip/home-intro-strip';
import { UiStateUtil } from '../../state/ui-state.utils';
import { SyllabusIndex } from '../../models/syllabus/syllabus-index.model';
import { SyllabusRepository } from '../../data/repositories/syllabus.repository';
import { PLACEHOLDER__COVER_IMG } from '../../core/constants/app.constants';
import { IdFileMap } from '../../shared/utils/id-map.utils';
import { SvgCardConfig } from '../../shared/utils/svg-loader.utils';

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
  private syllRepo = inject(SyllabusRepository);

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
    this.syllRepo.loadIndex().subscribe((data) => {
      if (!data) {
        // this.handleNoDataState();
        this.toast.show('Homepage data unavailable');
        this.classLoading.set(false);
        this.jamLoading.set(false);
        return;
      }

      this.processIndexData(data);
      // Set loaders to false
      this.classLoading.set(false);
      this.jamLoading.set(false);

      // After all home methods happened - start parallel of next data

      this.loadAllClasses();
    });
  }

  private loadAllClasses() {
    const map = this.uiState.get<IdFileMap>('idFileMap');
    if (map) {
      let mapToArr = Object.values(map);
      this.syllRepo.loadMultipleClasses(mapToArr);
    }
  }

  private processIndexData(data: any) {
    this.processClasses(data.classes);
    this.processJams(data.jamSessions);
    this.processActivities(data.activities);
  }

  private processClasses(classes: SyllabusIndex['classes']) {
    const now = Date.now();

    const result = (classes ?? [])
      .filter(
        (c) =>
          c?.enabled === true &&
          c?.ready === true &&
          !!c.availableFrom &&
          new Date(c.availableFrom).getTime() <= now,
      )
      .sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0))
      .map((c) => ({
        id: c.id,
        name: c.label ?? '',
        students: c.meta?.students ?? 0,
        teachers: c.meta?.teachers ?? 0,
        medium: Array.isArray(c.meta?.medium) ? c.meta.medium : [],
        image: c.meta?.image ?? '',
        meta: c.meta,
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
        image: j.meta.image,
        meta: j.meta,
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
        meta: a.meta,
      }));

    this.actSessions.set(result);
  }

  /* ===============================
     SVG (UNCHANGED)
  =============================== */
  load(cfg: SvgCardConfig) {
    // intentionally unchanged
  }

  getBannerSrc(src?: string | null): string {
    return src || PLACEHOLDER__COVER_IMG;
  }

  onImgError(event: Event) {
    (event.target as HTMLImageElement).src = PLACEHOLDER__COVER_IMG;
  }

  getBannerAlt(cls: any): string {
    return cls?.className ? `${cls.className} cover` : 'Class cover';
  }

  /* ===============================
     NAVIGATION
  =============================== */
  openCategory(cls: any) {
    this.uiState.set('curFile', cls.fileName);
    this.router.navigate(['/details', 'class', cls.id]);
  }

  joinJam(jam: any) {
    this.uiState.set('curFile', jam.fileName);
    this.router.navigate(['/details', 'jam', jam.id]);
  }

  /* ===============================
     CLASS SECTIONS (UNCHANGED)
  =============================== */
  classSections = signal(
    Array.from({ length: 12 }, (_, i) => ({
      class: `Class ${i + 1}`,
      cards: this.cache.cards(),
    })),
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
