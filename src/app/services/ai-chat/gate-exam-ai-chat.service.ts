import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AiChatGatewayService } from '../../core/services/ai/ai-chat-gateway.service';

export interface GateQuestionRequest {
  subject: string;
  question: string;
  modelType?: 'theory' | 'solving';
}

export interface QuestionRequest {
  question: string;
  history?: { role: 'user' | 'assistant'; content: string }[];
}

@Injectable({ providedIn: 'root' })
export class GateExamAiChatService {
  private ai = inject(AiChatGatewayService);

  ask(req: QuestionRequest): Observable<string> {
    const systemPrompt = `
You are an expert GATE exam tutor.
Explain concepts clearly and step-by-step.
Focus on exam-oriented reasoning.
Give formulas and short solving tricks when useful.
Avoid unnecessary long theory.
`;

    return this.ai.ask({
      system: systemPrompt,
      question: req.question,
      modelType:  'solving',
      context: 'Beginner coding for kids',
      ...(req.history ? { history: req.history } : {}),
    });
  }
}
