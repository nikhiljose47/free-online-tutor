import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Topbar } from './components/topbar/topbar';
import { Toast } from './components/toast/toast';
import { CommonModule } from '@angular/common';
import { ClassStreamSidebar } from './components/class-stream-sidebar/class-stream-sidebar';
import { Footer } from './components/footer/footer';
import { ConfirmDialogComponent } from './shared/components/confirm-dialog.component/confirm-dialog.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ConfirmDialogComponent, Topbar, Footer, Toast, CommonModule, ClassStreamSidebar],
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
