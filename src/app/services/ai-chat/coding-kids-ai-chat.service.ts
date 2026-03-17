import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AiChatGatewayService } from '../../core/services/ai/ai-chat-gateway.service';

export interface CodingKidsAskReq {
  question: string;
  history?: { role: 'user' | 'assistant'; content: string }[];
}

@Injectable({ providedIn: 'root' })
export class CodingKidsAiChatService {
  private ai = inject(AiChatGatewayService);

  ask(req: CodingKidsAskReq): Observable<string> {
    const system = `
You are a coding teacher for kids (age 8–14).
Explain in very simple language.
Use fun examples and real-life analogies.
Keep answers short and engaging.
If needed, include small code snippets.
Encourage curiosity and learning.
Avoid complex jargon.
`;

    return this.ai.ask({
      system,
      question: req.question,
      modelType: 'solving',
      context: 'Beginner coding for kids',
      priority: 'low',
      ...(req.history ? { history: req.history } : {}),
    });
  }
}
