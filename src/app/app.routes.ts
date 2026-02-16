import { Routes } from '@angular/router';
import { BookingDrawerComponent } from './components/booking-drawer/booking-drawer';
import { UpcomingClassesComponent } from './components/upcoming-classes/upcoming-classes';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { RoadmapComponent } from './pages/roadmap/roadmap';
import { LoginComponent } from './pages/login/login';
import { ClassDetailsComponent } from './pages/class-details/class-details';
import { TeachersPage } from './pages/teachers/teachers';
import { About } from './pages/about/about';
import { FreeOnlineTutor } from './pages/free-online-tutor/free-online-tutor';
import { Career } from './pages/career/career';
import { BookSlotComponent } from './components/book-slot/book-slot';
import { Timetable } from './components/timetable/timetable';
import { ScheduleLiveClass } from './pages/schedule-live-class/schedule-live-class';
import { Register } from './pages/register/register';
import { StudentCreations } from './pages/student-creations/student-creations';
import { ReportCard } from './components/report-card/report-card';
import { syllabusResolver } from './resolvers/syllabus-resolver';
import { PricingPlans } from './pages/pricing-plans/pricing-plans';
import { syllabusIndexResolver } from './resolvers/index-resolver';
import { TeacherWorkspace} from './pages/teacher-workspace/teacher-workspace';
import { ChapterBrowser } from './pages/chapter-browser/chapter-browser';
import { seoResolver } from './resolvers/seo-resolver';
import { ClassDetailsPage } from './pages/class-details-page/class-details-page';


export const routes: Routes = [

  {
    path: '',
    component: FreeOnlineTutor,
    data: {
      title: 'Free Online Tuition for Classes 6–12 | CBSE & State Boards',
      description: 'Free online tuition for students of classes 6 to 12. Learn maths, science and more from expert teachers.',
      keywords: 'free online tuition, cbse tuition, online classes india'
    },
    resolve: { seo: seoResolver }
  },

  {
    path: 'about',
    component: About,
    data: {
      title: 'About Us | Online Tuition Platform',
      description: 'Learn about our mission to provide quality online tuition for students across India.',
      keywords: 'about online tuition, education platform india'
    },
    resolve: { seo: seoResolver }
  },

  {
    path: 'teachers',
    component: TeachersPage,
    data: {
      title: 'Expert Online Teachers for CBSE Tuition',
      description: 'Meet our experienced online teachers helping students excel in academics.',
      keywords: 'online teachers, cbse tutors, maths science teachers'
    },
    resolve: { seo: seoResolver }
  },

  {
    path: 'plans',
    component: PricingPlans,
    data: {
      title: 'Online Tuition Plans & Pricing',
      description: 'Affordable online tuition plans for students of classes 6–12.',
      keywords: 'online tuition pricing, tuition plans'
    },
    resolve: { seo: seoResolver }
  },

  {
    path: 'career',
    component: Career,
    data: {
      title: 'Careers | Online Teaching Jobs',
      description: 'Join our team of teachers and educators. Explore online teaching careers.',
      keywords: 'online teaching jobs, tutor careers india'
    },
    resolve: { seo: seoResolver }
  },

  {
    path: 'student-creations',
    component: StudentCreations,
    data: {
      title: 'Student Creations & Projects',
      description: 'Explore projects and creations made by our students.',
      keywords: 'student projects, online tuition results'
    },
    resolve: { seo: seoResolver }
  },

  {
    path: 'roadmap',
    component: RoadmapComponent,
    data: {
      title: 'Student Learning Roadmap | Online Tuition',
      description: 'A clear academic roadmap for students to achieve learning goals.',
      keywords: 'learning roadmap, student study plan'
    },
    resolve: { seo: seoResolver }
  },

  /* ---------- Dynamic SEO pages ---------- */

  {
    path: 'class/:id',
    component: ClassDetailsComponent,
    data: {
      title: 'Class Tuition Details | Online Learning',
      description: 'Detailed information about our online tuition classes.',
      keywords: 'class tuition details, online class info'
    },
    resolve: { seo: seoResolver }
  },

  {
    path: 'details/:type/:id',
    loadComponent: () =>
      import('./pages/tution-details/tution-details').then(m => m.TutionDetails),
    data: {
      title: 'Online Tuition Details',
      description: 'Detailed view of online tuition programs and offerings.',
      keywords: 'online tuition details'
    },
    resolve: { seo: seoResolver }
  },

  /* ---------- NO-INDEX (internal / auth / dashboards) ---------- */

  { path: 'login', component: LoginComponent, data: { noIndex: true }, resolve: { seo: seoResolver } },
  { path: 'register', component: Register, data: { noIndex: true }, resolve: { seo: seoResolver } },
  { path: 'dashboard', component: DashboardComponent, data: { noIndex: true }, resolve: { seo: seoResolver } },
  { path: 'profile', component: DashboardComponent, data: { noIndex: true }, resolve: { seo: seoResolver } },
  { path: 'teacher-workspace', component: TeacherWorkspace, data: { noIndex: true }, resolve: { seo: seoResolver } },
  { path: 'book-slot', component: BookSlotComponent, data: { noIndex: true }, resolve: { seo: seoResolver } },
  { path: 'book/:id', component: BookingDrawerComponent, data: { noIndex: true }, resolve: { seo: seoResolver } },
  { path: 'upcoming', component: UpcomingClassesComponent, data: { noIndex: true }, resolve: { seo: seoResolver } },
  { path: 'timetable', component: Timetable, data: { noIndex: true }, resolve: { seo: seoResolver } },
  { path: 'report-card', component: ReportCard, data: { noIndex: true }, resolve: { seo: seoResolver } },
  { path: 'chapter-browser', component: ChapterBrowser, data: { noIndex: true }, resolve: { seo: seoResolver } },
  { path: 'schedule', component: ScheduleLiveClass, data: { noIndex: true }, resolve: { seo: seoResolver } },
  { path: 'test', component: ClassDetailsPage , data: { noIndex: true }, resolve: { seo: seoResolver } },

  {
    path: 'join-tution/:meetingId',
    loadComponent: () =>
      import('./pages/join-tution/join-tution').then(m => m.JoinTution),
    data: { noIndex: true },
    resolve: { seo: seoResolver }
  },

  { path: '**', redirectTo: '' }
];
