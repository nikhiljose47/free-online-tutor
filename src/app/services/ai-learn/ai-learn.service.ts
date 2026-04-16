import { Injectable, inject, signal } from '@angular/core';
import { Observable, of, timer } from 'rxjs';
import { catchError, finalize, map, switchMap, tap } from 'rxjs/operators';
import { EvaluateResult, LearnStep } from '../../models/ai-learn/ai-learn.model';
import { AiChatGatewayService } from '../../core/services/ai/ai-chat-gateway.service';
import { AI_LEARN_SYSTEM, buildLearnPrompt } from '../../core/constants/ai-learn.prompts';

@Injectable({ providedIn: 'root' })
export class AiLearnService {
  private ai = inject(AiChatGatewayService);

  private id = 1;

  readonly steps = signal<LearnStep[]>([]);
  readonly currentIndex = signal(0);
  readonly score = signal(0);
  readonly loading = signal(false);

  private context = '';
  private domain = '';
  private buffer: LearnStep[] = [];
  private history: string[] = [];

  init(context: string, domain: string): Observable<LearnStep> {
    this.context = context;
    this.domain = domain;

    this.steps.set([]);
    this.currentIndex.set(0);
    this.score.set(0);
    this.buffer = [];
    this.history = [];

    return this.fetchBatch().pipe(
      map(batch => {
        this.buffer = batch;
        const first = this.buffer.shift()!;
        this.steps.set([first]);
        this.history.push(first.body);
        return first;
      })
    );
  }

  next(): Observable<LearnStep> {
    const nextIndex = this.currentIndex() + 1;

    if (this.buffer.length > 0) {
      return timer(700).pipe(
        map(() => {
          const next = this.buffer.shift()!;
          this.steps.update(s => [...s, next]);
          this.currentIndex.set(nextIndex);
          this.history.push(next.body);
          return next;
        })
      );
    }

    return this.fetchBatch().pipe(
      switchMap(batch => {
        this.buffer = batch;
        return timer(900).pipe(map(() => this.buffer.shift()!));
      }),
      tap(step => {
        this.steps.update(s => [...s, step]);
        this.currentIndex.set(nextIndex);
        this.history.push(step.body);
      })
    );
  }

  evaluate(answer: string): Observable<EvaluateResult> {
    const step = this.steps()[this.currentIndex()];

    if (!step || step.type !== 'question') {
      return of({ correct: false, feedback: '', scoreDelta: 0 });
    }

    this.loading.set(true);

    return this.ai.ask({
      question: `Q: ${step.body}
A: ${answer}
Return JSON:
{"correct":true/false,"reason":"short human feedback"}`,
      system: `Strict evaluator.`,
      priority: 'low'
    }).pipe(
      map(res => {
        let parsed: any;
        try { parsed = JSON.parse(res); } catch { parsed = { correct: false, reason: '' }; }

        return {
          correct: !!parsed.correct,
          feedback: parsed.reason || '',
          scoreDelta: parsed.correct ? 5 : 0
        };
      }),
      tap(r => { if (r.correct) this.score.update(s => s + 5); }),
      catchError(() =>
        of({ correct: false, feedback: 'Failed', scoreDelta: 0 })
      ),
      finalize(() => this.loading.set(false))
    );
  }

  progress(): number {
    return Math.min(100, (this.currentIndex() + 1) * 10);
  }

  private fetchBatch(): Observable<LearnStep[]> {
    this.loading.set(true);

    return this.ai.ask({
      question: buildLearnPrompt(this.context, this.domain, this.history),
      system: AI_LEARN_SYSTEM,
      priority: 'medium'
    }).pipe(
      map(res => this.parseBatch(this.normalize(res))),
      catchError(() =>
        of([this.toContent('Title: Error\nExplanation: Failed to load')])
      ),
      finalize(() => this.loading.set(false))
    );
  }

  private parseBatch(res: string): LearnStep[] {
    const steps: LearnStep[] = [];

    const concepts = res.split('[CONCEPT]').slice(1);
    const questionBlock = res.split('[QUESTION]')[1];

    concepts.forEach(c => {
      steps.push(this.toContent(this.clean(c)));
    });

    if (questionBlock) {
      steps.push(this.toQuestion(this.clean(questionBlock)));
    }

    return steps;
  }

  private clean(res: string): string {
    return res
      .replace(/\[CONCEPT\]|\[QUESTION\]/g, '')
      .replace(/^\s*-\s*/gm, '• ')
      .replace(/\n{2,}/g, '\n')
      .trim();
  }

  private normalize(res: string): string {
    return res.replace(/\r/g, '').replace(/\n{2,}/g, '\n').trim();
  }

  private toContent(res: string): LearnStep {
    const title = res.match(/Title:\s*(.*)/i)?.[1]?.trim() || '';

    return {
      id: this.id++,
      type: 'content',
      title,
      body: res
    };
  }

  private toQuestion(res: string): LearnStep {
    const title = res.match(/Title:\s*(.*)/i)?.[1]?.trim() || 'Question';

    return {
      id: this.id++,
      type: 'question',
      title,
      body: res
    };
  }
}