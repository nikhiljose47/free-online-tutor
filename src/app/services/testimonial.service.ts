import { Injectable } from '@angular/core';
import { Testimonial } from '../models/testimonial.model';

@Injectable({ providedIn: 'root' })
export class TestimonialService {
  private testimonials: Testimonial[] = [
    { id: '1', name: 'Ravi Kumar', message: 'Great tutoring for my son!', rating: 5 },
    { id: '2', name: 'Anjali Singh', message: 'Very clear explanation of math topics.', rating: 4 },
  ];

  getAll(): Testimonial[] {
    return this.testimonials;
  }
}
