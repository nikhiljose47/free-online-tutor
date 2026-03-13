import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { ToastService } from '../../shared/toast.service';
import { HomeIntroStrip } from '../../components/home-intro-strip/home-intro-strip';
import { UiStateUtil } from '../../shared/state/ui-state.utils';
import { SyllabusRepository } from '../../domain/repositories/syllabus.repository';
import { PLACEHOLDER__COVER_IMG } from '../../core/constants/app.constants';
import { ResourceIndex } from '../../shared/utils/id-map.utils';
import { SvgCardConfig } from '../../shared/utils/svg-loader.utils';
import { CatalogLookupService } from '../../domain/syllabus-index/catalog-lookup.service';

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
export class FreeOnlineTutor implements OnInit, AfterViewInit {
  /* ===============================
     INJECTIONS
  =============================== */
  private router = inject(Router);
  private toast = inject(ToastService);
  private sanitizer = inject(DomSanitizer);
  private uiState = inject(UiStateUtil);
  private syllRepo = inject(SyllabusRepository);
  private catalogLookupApi = inject(CatalogLookupService);

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
    // this.syllRepo.loadIndex().subscribe((data) => {
    //   if (!data) {
    //     // this.handleNoDataState();
    //     this.toast.show('Homepage data unavailable');
    //     this.classLoading.set(false);
    //     this.jamLoading.set(false);
    //     return;
    //   }

    //   this.setDataByGroups();
    //   // Set loaders to false
    //   this.classLoading.set(false);
    //   this.jamLoading.set(false);
    // });
  }

  ngAfterViewInit() {
    // After all home methods happened - start parallel of next data
    setTimeout(() => this.loadAllClasses());
  }

  private loadAllClasses() {
    const map = this.uiState.get<ResourceIndex>('ResourceIndex');
    if (map) {
      let mapToArr = Object.values(map);
      this.syllRepo.loadMultipleClasses(mapToArr);
    }
  }

  private setDataByGroups() {
    let schoolClass = this.catalogLookupApi.getByGroup('school-class').map((c) => ({
      id: c.id,
      name: c.title ?? '',
      students: c.meta?.students ?? 0,
      teachers: c.meta?.teachers ?? 0,
      medium: Array.isArray(c.meta?.medium) ? c.meta.medium : [],
      image: c.meta?.image ?? '',
      meta: c.meta,
    }));
    this.classCategories.set(schoolClass);

    let examJam = this.catalogLookupApi.getByGroup('exam-jam').map((c) => ({
      id: c.id,
      name: c.title ?? '',
      students: c.meta?.students ?? 0,
      teachers: c.meta?.teachers ?? 0,
      medium: Array.isArray(c.meta?.medium) ? c.meta.medium : [],
      image: c.meta?.image ?? '',
      meta: c.meta,
    }));
    this.jamSessions.set(examJam);

    let coding = this.catalogLookupApi.getByGroup('coding').map((c) => ({
      id: c.id,
      name: c.title ?? '',
      students: c.meta?.students ?? 0,
      teachers: c.meta?.teachers ?? 0,
      medium: Array.isArray(c.meta?.medium) ? c.meta.medium : [],
      image: c.meta?.image ?? '',
      meta: c.meta,
    }));
    this.actSessions.set(coding);
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
