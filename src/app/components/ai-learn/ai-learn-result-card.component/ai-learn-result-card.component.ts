import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ai-learn-result-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ai-learn-result-card.component.html',
  styleUrls: ['./ai-learn-result-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AiLearnResultCardComponent {
  @Input({ required: true }) isCorrect!: boolean;
  @Input() feedback: string = '';
  @Input() points: number = 0;

  @Output() next = new EventEmitter<void>();

  readonly title = () => (this.isCorrect ? 'Yes, correct' : 'Not quite right');

  readonly pointsText = () =>
    this.isCorrect ? `+${this.points} points added` : '';

  onNext() {
    this.next.emit();
  }
}