import { Routes } from '@angular/router';
import { BookingDrawerComponent } from './components/booking-drawer/booking-drawer';
import { UpcomingClassesComponent } from './components/upcoming-classes/upcoming-classes';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { RoadmapComponent } from './pages/roadmap/roadmap';
import { LoginComponent } from './pages/login/login';
import { ClassDetailsComponent } from './pages/class-details/class-details';
import { SyllabusComponent } from './components/syllabus/syllabus';
import { TeachersPage } from './pages/teachers/teachers';
import { About } from './pages/about/about';
import { FreeOnlineTutor } from './pages/free-online-tutor/free-online-tutor';
import { Career } from './pages/career/career';

export const routes: Routes = [
  { path: '', component: FreeOnlineTutor },
  { path: 'book/:id', component: BookingDrawerComponent },
  { path: 'class/:id', component: ClassDetailsComponent },
  { path: 'roadmap', component: RoadmapComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'login', component: LoginComponent },
  { path: 'upcoming', component: UpcomingClassesComponent },
  { path: 'syllabus', component: SyllabusComponent },
  { path: 'about', component: About },
  { path: 'teachers', component: TeachersPage },
  { path: 'career', component: Career },
  { path: 'profile', component: DashboardComponent },
  { path: '**', redirectTo: '' },
];
