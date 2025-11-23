import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TopbarComponent } from './components/topbar/topbar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TopbarComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('free-online-tutor');
}
