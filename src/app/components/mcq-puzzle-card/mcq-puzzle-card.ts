import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  inject,
  signal,
  computed,
  effect,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DummyPuzzleService } from '../../services/puzzle/dummy/dummy-puzzle.service';

/* =========================================
   COMPONENT
========================================= */
@Component({
  selector: 'mcq-puzzle-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mcq-puzzle-card.html',
  styleUrls: ['./mcq-puzzle-card.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class McqPuzzleCardComponent {
  private puzzleApi = inject(DummyPuzzleService);

  /* ========= INPUT ========= */
  private readonly _puzzleId = signal<string | null>(null);

  @Input({ required: true })
  set puzzleId(value: string | null) {
    this._puzzleId.set(value);
  }

  /* ========= OUTPUT ========= */
  @Output() completedChange = new EventEmitter<string>();

  /* ========= STATE ========= */
  private readonly _level = signal(1);
  private readonly _question = signal('');
  private readonly _options = signal<string[]>([]);
  private readonly _correctIndex = signal<number | null>(null);

  private readonly _selectedIndex = signal<number | null>(null);
  private readonly _showResult = signal(false);
  private readonly _completed = signal(false);

  /* ========= PUBLIC SIGNALS FOR TEMPLATE ========= */
  readonly level = this._level.asReadonly();
  readonly question = this._question.asReadonly();
  readonly options = this._options.asReadonly();
  readonly correctIndex = this._correctIndex.asReadonly();

  readonly selectedIndex = this._selectedIndex.asReadonly();
  readonly showResult = this._showResult.asReadonly();
  readonly completed = this._completed.asReadonly();

  readonly isCorrect = computed(
    () => this._selectedIndex() !== null && this._selectedIndex() === this._correctIndex(),
  );

  readonly correctAnswerText = computed(() => {
    const idx = this._correctIndex();
    return idx !== null ? this._options()[idx] : '';
  });

  /* =========================================
     LOAD PUZZLE WHEN ID CHANGES
  ========================================= */
  constructor() {
    effect(() => {
      const id = this._puzzleId();
      if (!id) return;

      this.resetState();

      this.puzzleApi.getPuzzle$(id).subscribe((p) => {
        this._level.set(p.level);
        this._question.set(p.question);
        this._options.set(p.options);
        this._correctIndex.set(p.correctIndex);

        /* check completion lock (localStorage demo) */
        const done = localStorage.getItem(`puzzle_done_${id}`) === '1';
        this._completed.set(done);
      });
    });
  }

  /* =========================================
     USER ACTIONS
  ========================================= */
  selectOption(index: number) {
    if (this._showResult() || this._completed()) return;

    this._selectedIndex.set(index);
    this._showResult.set(true);
  }

  finishPuzzle() {
    const id = this._puzzleId();
    if (!id) return;

    /* mark completed permanently */
    localStorage.setItem(`puzzle_done_${id}`, '1');
    this._completed.set(true);

    /* emit to parent */
    this.completedChange.emit(id);
  }

  /* =========================================
     HELPERS
  ========================================= */
  private resetState() {
    this._selectedIndex.set(null);
    this._showResult.set(false);
  }
}
