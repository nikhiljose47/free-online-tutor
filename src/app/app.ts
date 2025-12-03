import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TopbarComponent } from './components/topbar/topbar';
import { Toast } from './components/toast/toast';
import { Loading } from './components/loading/loading';
import { CommonModule } from '@angular/common';
import { AnnouncementBar } from './components/announcement-bar/announcement-bar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TopbarComponent, Toast, Loading, CommonModule, AnnouncementBar],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('free-online-tutor');
}
