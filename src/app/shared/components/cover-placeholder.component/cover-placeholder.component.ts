import { Component, input } from '@angular/core';

@Component({
  selector: 'cover-placeholder',
  imports: [],
  templateUrl: './cover-placeholder.component.html',
  styleUrl: './cover-placeholder.component.scss',
})
export class CoverPlaceholderComponent {
  message = input<string>('No cover / image not found');

}
