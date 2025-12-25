import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Topbar } from './components/topbar/topbar';
import { Toast } from './components/toast/toast';
import { CommonModule } from '@angular/common';
import { AnnouncementBar } from './components/announcement-bar/announcement-bar';
import { ClassStreamSidebar } from './components/class-stream-sidebar/class-stream-sidebar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Topbar, Toast, CommonModule, AnnouncementBar, ClassStreamSidebar],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('free-online-tutor');
  isSidebarCollapsed = signal(false);

  onSidebarToggle(collapsed: boolean): void {
    this.isSidebarCollapsed.set(collapsed);
  }
}
