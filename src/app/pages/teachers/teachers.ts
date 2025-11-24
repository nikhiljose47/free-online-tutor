import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'teachers',
  templateUrl: './teachers.html',
  styleUrl: './teachers.scss',
})
export class TeachersPage {
  images = ['assets/we-team.jpg', 'assets/hand-team.jpg'];

  
  current = 0;

  next() {
    this.current = (this.current + 1) % this.images.length;
  }

  prev() {
    this.current =
      (this.current - 1 + this.images.length) % this.images.length;
  }

  goTo(i: number) {
    this.current = i;
  }
}
