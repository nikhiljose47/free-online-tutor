import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestimonialService } from '../../services/testimonial.service';
import { Testimonial } from '../../models/testimonial.model';

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mt-4">
      <h3 class="fw-bold mb-3">Testimonials</h3>

      <div class="card mb-2" *ngFor="let t of testimonials">
        <div class="card-body">
          <h6 class="fw-bold">{{ t.name }}</h6>
          <p class="mb-1">{{ t.message }}</p>
          <span class="text-warning">⭐ {{ t.rating }}</span>
        </div>
      </div>
    </div>
  `,
})
export class TestimonialsComponent {
  testimonials: Testimonial[] = [];

  constructor(private service: TestimonialService) {
    this.testimonials = this.service.getAll();
  }
}
