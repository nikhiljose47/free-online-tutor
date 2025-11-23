import { Routes } from '@angular/router';
import { BookingDrawerComponent } from './components/booking-drawer/booking-drawer';
import { UpcomingClassesComponent } from './components/upcoming-classes/upcoming-classes';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { RoadmapComponent } from './pages/roadmap/roadmap';
import { LoginComponent } from './pages/login/login';
import { ClassDetailsComponent } from './pages/class-details/class-details';
import { SyllabusComponent } from './components/syllabus/syllabus';
import { TestimonialsComponent } from './components/testimonials/testimonials';
import { HomeComponent } from './pages/home/home';

export const routes: Routes = [
  { path: 'book/:id', component: BookingDrawerComponent },
  { path: 'class/:id', component: ClassDetailsComponent },
  { path: 'roadmap', component: RoadmapComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'login', component: LoginComponent },
  { path: '', component: HomeComponent },
  { path: 'upcoming', component: UpcomingClassesComponent },
  { path: 'syllabus', component: SyllabusComponent },
  { path: 'roadmap', component: RoadmapComponent },
  { path: 'testimonials', component: TestimonialsComponent },

  { path: '**', redirectTo: '' },
];
