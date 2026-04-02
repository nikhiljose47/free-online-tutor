import {
  Component,
  ChangeDetectionStrategy,
  signal,
  computed,
  inject,
  ViewChild,
  ElementRef,
  AfterViewInit,
  DestroyRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { UserProfileService } from '../../core/services/fire/user-profile.service';
import { CatalogLookupService } from '../../domain/syllabus-index/catalog-lookup.service';
import { PLACEHOLDER__COVER_IMG } from '../../core/constants/app.constants';

type Course = {
  classId: string;
  title: string;
  category: string;
  level: string;
  progress: number;
  image?: string;
};

@Component({
  selector: 'my-learning',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-learning.html',
  styleUrls: ['./my-learning.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyLearning implements AfterViewInit {
  @ViewChild('scrollContainer', { static: false })
  scrollContainer!: ElementRef<HTMLDivElement>;

  private router = inject(Router);
  private user = inject(UserProfileService);
  private catalogApi = inject(CatalogLookupService);
  private destroyRef = inject(DestroyRef);

  readonly profile = this.user.profile;

  readonly userName = computed(() => this.profile()?.name ?? 'User');

  readonly isLoading = signal(true);

  private coursesData = signal<Course[]>([]);

  /* SCROLL STATE */
  readonly scrollLeft = signal(0);
  readonly maxScroll = signal(0);

  readonly showLeftArrow = computed(() => this.scrollLeft() > 5);
  readonly showRightArrow = computed(() => this.scrollLeft() < this.maxScroll() - 5);

  constructor() {
    const profile = this.profile();

    if (!profile?.enrolledClassIds?.length) {
      this.isLoading.set(false);
      return;
    }

    const list: Course[] = profile.enrolledClassIds.map((id) => {
      const item = this.catalogApi.getById(id);

      return {
        classId: id,
        title: item?.title ?? 'Untitled',
        category: item?.primaryGroup ?? 'course',
        level: item?.type ?? 'general',
        image: item?.meta?.image,
        progress: Math.floor(Math.random() * 100),
      };
    });

    this.coursesData.set(list);
    this.isLoading.set(false);
  }

  ngAfterViewInit() {
    const el = this.scrollContainer?.nativeElement;
    if (!el) return;

    const update = () => {
      this.scrollLeft.set(el.scrollLeft);
      this.maxScroll.set(el.scrollWidth - el.clientWidth);
    };

    update();

    const onScroll = () => update();
    const onResize = () => update();

    el.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);

    this.destroyRef.onDestroy(() => {
      el.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    });
  }

  readonly courses = computed(() => this.coursesData());

  scrollNext() {
    const el = this.scrollContainer?.nativeElement;
    if (!el) return;

    el.scrollBy({
      left: el.clientWidth * 0.8,
      behavior: 'smooth',
    });
  }

  scrollPrev() {
    const el = this.scrollContainer?.nativeElement;
    if (!el) return;

    el.scrollBy({
      left: -el.clientWidth * 0.8,
      behavior: 'smooth',
    });
  }

  getImgSrc(src?: string | null): string {
    return src || PLACEHOLDER__COVER_IMG;
  }

  onImgError(e: Event) {
    (e.target as HTMLImageElement).src = PLACEHOLDER__COVER_IMG;
  }

  getImgAlt(title: string): string {
    return title ? `${title} course` : 'course';
  }

  onOpenCourse(classId: string) {
    this.router.navigate(['/course-view', classId]);
  }

  trackById = (_: number, item: Course) => item.classId;

  onBrowse() {
    this.router.navigate(['/explore']);
  }

  onJoin() {
    this.router.navigate(['/join']);
  }
}