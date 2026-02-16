import { Injectable } from '@angular/core';
import { delay, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DummyPuzzleService {
  getPuzzle$(id: string) {
    const data = {
      id,
      level: 1,
      question: 'What is the capital of France?',
      options: ['Berlin', 'Madrid', 'Paris', 'Rome'],
      correctIndex: 2,
    };

    return of(data).pipe(delay(400));
  }
}
