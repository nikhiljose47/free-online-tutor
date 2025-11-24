import { Component } from '@angular/core';
import { B2BComponent } from '../../components/b2b/b2b';
import { Testimonials } from '../testimonials/testimonials';

@Component({
  selector: 'app-about',
  imports: [B2BComponent, Testimonials],
  templateUrl: './about.html',
  styleUrl: './about.scss',
})
export class About {

}
