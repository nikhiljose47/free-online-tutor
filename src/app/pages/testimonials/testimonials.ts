import { Component } from '@angular/core';
import { Testimonial } from '../../models/testimonial.model';
import { TestimonialService } from '../../services/testimonial.service';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'testimonials',
  templateUrl: './testimonials.html',
})
export class Testimonials {
  testimonials: Testimonial[] = [];

  constructor(private service: TestimonialService) {
    this.testimonials = this.service.getAll();
  }
}
