import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TopbarComponent } from './components/topbar/topbar';
import { Toast } from './components/toast/toast';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TopbarComponent, Toast],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('free-online-tutor');
}
