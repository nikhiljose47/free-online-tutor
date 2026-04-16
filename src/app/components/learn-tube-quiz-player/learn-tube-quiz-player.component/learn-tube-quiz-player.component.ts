import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  signal,
  inject,
  Input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocalStoreService } from '../../../core/services/local-store/local-store.service';
import { LearnTubePersistService } from '../../../services/learn-tube-persist/learn-tube-persist.service';
import { LearnTubeStage } from '../../../services/learn-tube/learn-tube.service';

type Q = {
  id: string;
  type?: 'mcq' | 'puzzle';
  question: string;
  options?: string[];
  correctIndex?: number;
  items?: string[];
  correctOrder?: number[];
};

type Quiz = {
  setId: string;
  questions: Q[];
};

type AnswerMap = Record<string, number | number[]>;

@Component({
  selector: 'learn-tube-quiz-player',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './learn-tube-quiz-player.component.html',
  styleUrls: ['./learn-tube-quiz-player.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LearnTubeQuizPlayerComponent {
  // 👉 injected from orchestrator (IMPORTANT)
  @Input({ required: true }) flowNext!: (
    step?: 'slides' | 'game' | 'dashboard' | 'ai-learn',
  ) => void;
  private persistService = inject(LearnTubePersistService);

  private store = inject(LocalStoreService);

  private quiz = signal<Quiz>({
    setId: '02',
    questions: [
      {
        id: 'q1',
        question: 'Which widget is dynamic?',
        options: ['StatelessWidget', 'StatefulWidget'],
        correctIndex: 1,
      },
      {
        id: 'q2',
        type: 'puzzle',
        question: 'Arrange flow:',
        items: ['Build', 'Widget Tree', 'Render'],
        correctOrder: [1, 0, 2],
      },
    ],
  });

  private answers = signal<AnswerMap>({});
  currentIndex = signal(0);

  totalQuestions = computed(() => this.quiz().questions.length);
  currentQuestion = computed(() => this.quiz().questions[this.currentIndex()] || null);

  selectedAnswer = computed(() => {
    const q = this.currentQuestion();
    if (!q) return null;
    return this.answers()[q.id] as number;
  });

  selectedOrder = computed(() => {
    const q = this.currentQuestion();
    if (!q) return [];
    return (this.answers()[q.id] as number[]) || [];
  });

  quizTitle = computed(() => `Level Quiz`);

  canProceed = computed(() => {
    const q = this.currentQuestion();
    if (!q) return false;

    const ans = this.answers()[q.id];

    if (q.type === 'puzzle') return Array.isArray(ans) && ans.length === (q.items?.length || 0);
    return typeof ans === 'number';
  });

  isLast = computed(() => this.currentIndex() === this.totalQuestions() - 1);

  constructor() {
    this.hydrate();
    effect(() => this.persist());
  }

  selectOption(i: number) {
    const q = this.currentQuestion();
    if (!q) return;

    this.answers.update((a) => ({ ...a, [q.id]: i }));
  }

  toggleOrder(i: number) {
    const q = this.currentQuestion();
    if (!q) return;

    const current = [...this.selectedOrder()];
    const index = current.indexOf(i);

    if (index > -1) current.splice(index, 1);
    else current.push(i);

    this.answers.update((a) => ({ ...a, [q.id]: current }));
  }

  next() {
    if (!this.canProceed()) return;

    const q = this.currentQuestion();
    const ans = this.answers()[q!.id];

    const isCorrect =
      q?.type === 'puzzle'
        ? JSON.stringify(ans) === JSON.stringify(q.correctOrder)
        : ans === q?.correctIndex;

    console.log('Q:', q?.question, '| Answer:', ans, '| Correct:', isCorrect);

    if (this.isLast()) {
      this.submit();
      return;
    }

    this.currentIndex.update((v) => v + 1);
  }

  prev() {
    if (this.currentIndex() === 0) return;
    this.currentIndex.update((v) => v - 1);
  }

  private submit() {
    const score = this.calculateScore();
    this.cacheResult(score);
    this.persistService.set(LearnTubeStage.QuizEnded);
    this.flowNext('dashboard');
  }

  private calculateScore(): number {
    const qs = this.quiz().questions;
    const ans = this.answers();

    let score = 0;

    for (const q of qs) {
      const a = ans[q.id];

      if (q.type === 'puzzle') {
        if (JSON.stringify(a) === JSON.stringify(q.correctOrder)) score++;
      } else {
        if (a === q.correctIndex) score++;
      }
    }

    return score;
  }

  private storageKey() {
    return `lt_quiz_${this.quiz().setId}`;
  }

  private persist() {
    this.store.set(this.storageKey(), {
      answers: this.answers(),
      index: this.currentIndex(),
    });
  }

  private hydrate() {
    const data = this.store.get<{ answers: AnswerMap; index: number }>(this.storageKey());
    if (!data) return;

    this.answers.set(data.answers || {});
    this.currentIndex.set(data.index || 0);
  }

  private cacheResult(score: number) {
    this.store.set(this.storageKey() + '_result', {
      score,
      total: this.totalQuestions(),
    });
  }
}
