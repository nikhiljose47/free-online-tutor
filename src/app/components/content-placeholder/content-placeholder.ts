import { Component, Input } from '@angular/core';

@Component({
  selector: 'content-placeholder',
  imports: [],
  templateUrl: './content-placeholder.html',
  styleUrl: './content-placeholder.scss',
})
export class ContentPlaceholder {
  @Input({ required: true }) message!: string;
  @Input() image: string = 'bi-hourglass-split';
}
