import { Component, signal } from '@angular/core';
import { FaqUtil } from '../../utils/faq.utils';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'faq-list',
  imports: [CommonModule],
  templateUrl: './faq-list.html',
  styleUrl: './faq-list.scss',
})
export class FaqList {
  readonly faqs = FaqUtil.getFaqData();
  readonly openIndex = signal<number | null>(0);

  toggle(i: number) {
    this.openIndex.update((v) => (v === i ? null : i));
  }
}
