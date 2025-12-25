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
import { JoinTution } from './pages/join-tution/join-tution';
import { Timetable } from './components/timetable/timetable';
import { ScheduleLiveClass } from './pages/schedule-live-class/schedule-live-class';
import { Register } from './pages/register/register';
import { StudentCreations } from './pages/student-creations/student-creations';
import { ReportCard } from './components/report-card/report-card';
import { syllabusResolver } from './resolvers/syllabus-resolver';
import { PricingPlans } from './pages/pricing-plans/pricing-plans';

export const routes: Routes = [
  { path: '', component: FreeOnlineTutor },
  { path: 'book/:id', component: BookingDrawerComponent },
  { path: 'class/:id', component: ClassDetailsComponent },
  { path: 'book-slot', component: BookSlotComponent },
  { path: 'roadmap', component: RoadmapComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: Register },
  { path: 'upcoming', component: UpcomingClassesComponent },
  { path: 'student-creations', component: StudentCreations },
  { path: 'about', component: About },
  { path: 'teachers', component: TeachersPage },
  { path: 'career', component: Career },
  { path: 'plans', component: PricingPlans },
  {
    path: 'join-tution/:meetingId',
    loadComponent: () => import('./pages/join-tution/join-tution').then((m) => m.JoinTution),
  },
  { path: 'profile', component: DashboardComponent },
  { path: 'timetable', component: Timetable },
  { path: 'report-card', component: ReportCard },

  { path: 'schedule', component: ScheduleLiveClass },

  {
    path: 'details/:type/:id',
    loadComponent: () =>
      import('./pages/tution-details/tution-details').then((m) => m.TutionDetails),
    resolve: { preload: syllabusResolver },
  },
  { path: '**', redirectTo: '' },
];
