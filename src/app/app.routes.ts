import { Routes } from '@angular/router';
import { BookingDrawerComponent } from './components/booking-drawer/booking-drawer';
import { UpcomingClassesComponent } from './components/upcoming-classes/upcoming-classes';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { RoadmapComponent } from './pages/roadmap/roadmap';
import { LoginComponent } from './pages/login/login';
import { TeachersPage } from './pages/teachers/teachers';
import { About } from './pages/about/about';
import { BookSlotComponent } from './components/book-slot/book-slot';
import { Timetable } from './components/timetable/timetable';
import { ScheduleLiveClass } from './pages/schedule-live-class/schedule-live-class';
import { Register } from './pages/register/register';
import { StudentCreations } from './pages/student-creations/student-creations';
import { ReportCard } from './components/report-card/report-card';
import { PricingPlans } from './pages/pricing-plans/pricing-plans';
import { TeacherWorkspace } from './pages/teacher-workspace/teacher-workspace';
import { ChapterBrowser } from './pages/chapter-browser/chapter-browser';
import { seoResolver } from './resolvers/seo-resolver';
import { FreeOnlineTuition } from './pages/free-online-tuition/free-online-tuition';
import { AiTutorChatComponent } from './shared/components/ai-tutor-chat.component/ai-tutor-chat.component';
import { OnlineTeacherJobs } from './pages/online-teacher-jobs/online-teacher-jobs';
import { CourseViewPage } from './pages/course-view-page/course-view-page';

export const routes: Routes = [
  {
    path: '',
    component: FreeOnlineTuition,
    data: {
      title: 'Free Online Tuition for Class 6–12 | CBSE, ICSE & State Boards | Scholo Learning',
      description:
        'Scholo Learning offers free online tuition for Class 6 to 12 students across CBSE, ICSE and State Boards. Learn Maths, Science and more with expert teachers.',
      keywords:
        'free online tuition india, class 6 to 12 online classes, cbse tuition online, icse coaching online, scholo learning, online tutoring india',
    },
    resolve: { seo: seoResolver },
  },

  {
    path: 'free-online-tuition',
    component: AiTutorChatComponent,
    data: {
      title: 'AI Tutor Free Online Classes | Instant Doubt Solving | Scholo Learning',
      description:
        'Get instant help with Scholo AI Tutor. Free online classes and doubt solving for Maths, Science and more for Class 6–12 students.',
      keywords:
        'ai tutor india, free doubt solving, online tutor chatbot, scholo ai tutor, instant homework help',
    },
    resolve: { seo: seoResolver },
  },

  {
    path: 'about',
    component: About,
    data: {
      title: 'About Scholo Learning | Online Education Platform India',
      description:
        'Scholo Learning is an online education platform providing affordable and free tuition for school students across India.',
      keywords:
        'about scholo, online learning india, education platform india, digital tuition india',
    },
    resolve: { seo: seoResolver },
  },

  {
    path: 'teachers',
    component: TeachersPage,
    data: {
      title: 'Expert Online Tutors for CBSE & ICSE | Scholo Learning',
      description:
        'Learn from experienced online tutors for Maths, Science and all subjects. Verified teachers at Scholo Learning.',
      keywords:
        'online tutors india, cbse teachers online, icse tutors, maths science teacher online',
    },
    resolve: { seo: seoResolver },
  },

  {
    path: 'plans',
    component: PricingPlans,
    data: {
      title: 'Affordable Online Tuition Plans | Scholo Learning Pricing',
      description:
        'Explore affordable tuition plans for students. Flexible pricing for online classes across subjects and boards.',
      keywords:
        'online tuition fees india, affordable coaching plans, scholo pricing, tuition subscription india',
    },
    resolve: { seo: seoResolver },
  },

  {
    path: 'career',
    component: OnlineTeacherJobs,
    data: {
      title: 'Online Teaching Jobs India | Become a Tutor | Scholo Learning',
      description:
        'Apply for online teaching jobs at Scholo Learning. Work from home and teach students across India.',
      keywords:
        'online teaching jobs india, tutor jobs work from home, teaching careers india, scholo jobs',
    },
    resolve: { seo: seoResolver },
  },

  {
    path: 'student-creations',
    component: StudentCreations,
    data: {
      title: 'Student Projects & Achievements | Scholo Learning',
      description:
        'Explore creative projects and academic achievements by students learning on Scholo.',
      keywords:
        'student projects india, learning outcomes, student portfolio online, scholo students',
    },
    resolve: { seo: seoResolver },
  },

  {
    path: 'roadmap',
    component: RoadmapComponent,
    data: {
      title: 'Study Roadmap for Class 6–12 | Scholo Learning',
      description:
        'Structured study roadmap to help students achieve academic success with guided learning paths.',
      keywords: 'study roadmap, class 10 study plan, class 12 roadmap, academic planning india',
    },
    resolve: { seo: seoResolver },
  },

  {
    path: 'details/:id',
    loadComponent: () =>
      import('./pages/class-details-page/class-details-page').then((m) => m.ClassDetailsPage),
    data: {
      title: 'Course Details | Online Tuition Program | Scholo Learning',
      description: 'Explore detailed information about courses, syllabus and learning outcomes.',
      keywords: 'online course details, tuition course info, scholo courses',
    },
    resolve: { seo: seoResolver },
  },

  {
    path: 'tuition-centers',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/tuition-marketplace/tuition-marketplace').then(
            (m) => m.TuitionMarketplace,
          ),
        data: {
          title: 'Tuition Centers Near Me | Coaching Institutes India | Scholo',
          description:
            'Find top-rated tuition centers and coaching institutes near you. Compare and enroll بسهولة.',
          keywords:
            'tuition centers near me, coaching institutes india, offline tuition, best tuition centers',
        },
        resolve: { seo: seoResolver },
      },
      {
        path: ':city',
        loadComponent: () =>
          import('./pages/tuition-marketplace/tuition-marketplace').then(
            (m) => m.TuitionMarketplace,
          ),
        resolve: { seo: seoResolver },
      },
    ],
  },

  /* NO INDEX */

  {
    path: 'login',
    component: LoginComponent,
    data: { noIndex: true },
    resolve: { seo: seoResolver },
  },
  { path: 'register', component: Register, data: { noIndex: true }, resolve: { seo: seoResolver } },
  {
    path: 'dashboard',
    component: DashboardComponent,
    data: { noIndex: true },
    resolve: { seo: seoResolver },
  },
  {
    path: 'profile',
    component: DashboardComponent,
    data: { noIndex: true },
    resolve: { seo: seoResolver },
  },
  {
    path: 'teacher-workspace',
    component: TeacherWorkspace,
    data: { noIndex: true },
    resolve: { seo: seoResolver },
  },
  {
    path: 'book-slot',
    component: BookSlotComponent,
    data: { noIndex: true },
    resolve: { seo: seoResolver },
  },
  {
    path: 'book/:id',
    component: BookingDrawerComponent,
    data: { noIndex: true },
    resolve: { seo: seoResolver },
  },
  {
    path: 'upcoming',
    component: UpcomingClassesComponent,
    data: { noIndex: true },
    resolve: { seo: seoResolver },
  },
  {
    path: 'timetable',
    component: Timetable,
    data: { noIndex: true },
    resolve: { seo: seoResolver },
  },
  {
    path: 'report-card',
    component: ReportCard,
    data: { noIndex: true },
    resolve: { seo: seoResolver },
  },
  {
    path: 'chapter-browser',
    component: ChapterBrowser,
    data: { noIndex: true },
    resolve: { seo: seoResolver },
  },
  {
    path: 'schedule',
    component: ScheduleLiveClass,
    data: { noIndex: true },
    resolve: { seo: seoResolver },
  },
  {
    path: 'course-view/:classId',
    component: CourseViewPage,
    data: { noIndex: true },
    resolve: { seo: seoResolver },
  },

  {
    path: 'join-tution/:meetingId',
    loadComponent: () => import('./pages/join-tution/join-tution').then((m) => m.JoinTution),
    data: { noIndex: true },
    resolve: { seo: seoResolver },
  },

  {
    path: 'admin-dashboard',
    loadComponent: () =>
      import('./pages/admin-dashboard/admin-dashboard').then((m) => m.AdminDashboard),
    data: { noIndex: true },
    resolve: { seo: seoResolver },
  },

  { path: '**', redirectTo: '' },
];
