import { CommonModule } from '@angular/common';
import { Component, Input, signal } from '@angular/core';

@Component({
  selector: 'loading-component',
  imports: [CommonModule],
  templateUrl: './loading.html',
  styleUrl: './loading.scss',
})
export class Loading {
  @Input() text = 'Loading...';
  isLoading = signal(false);
show() { this.isLoading.set(true); }
hide() { this.isLoading.set(false); }
}
