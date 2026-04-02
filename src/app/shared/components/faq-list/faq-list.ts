import { Component, computed, Input, signal } from '@angular/core';
import { FaqUtil } from '../../utils/faq.utils';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'faq-list',
  imports: [CommonModule],
  templateUrl: './faq-list.html',
  styleUrl: './faq-list.scss',
})
export class FaqList {
  @Input()
  set groupNameInput(value: string) {
    this.groupName.set(value || 'school');
  }
  private groupName = signal('school');
  readonly faqs = computed(() => FaqUtil.getFaqDataByGroup(this.groupName()));
  readonly openIndex = signal<number | null>(0);

  toggle(i: number) {
    this.openIndex.update((v) => (v === i ? null : i));
  }
}
