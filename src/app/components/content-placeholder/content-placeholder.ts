import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'content-placeholder',
  imports: [CommonModule],
  templateUrl: './content-placeholder.html',
  styleUrl: './content-placeholder.scss',
})
export class ContentPlaceholder {
  @Input() message: string = 'We are facing some issue.. ';
  @Input() image: string = 'bi-hourglass-split';

  private router = inject(Router);

  retry() {
    window.location.reload();
  }

  goHome() {
    this.router.navigate(['/']);
  }
}
