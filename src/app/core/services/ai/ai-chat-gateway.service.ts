import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, retry, shareReplay, catchError, finalize } from 'rxjs/operators';
import { AiGatewayRequest, AiModelType } from '../../../models/ai-chat/ai-chat.model';
import { environment } from '../../../environments/environment.prod';

interface AiApiResponse {
  choices: { message: { content: string } }[];
}

@Injectable({ providedIn: 'root' })
export class AiChatGatewayService {
  private http = inject(HttpClient);

  private cache = new Map<string, string>();

  readonly loading = signal(false);

  private resolveModel(type?: AiModelType, priority?: 'low' | 'medium' | 'high') {
    const models = environment.aiModels;

    if (priority === 'low') return models.fast;
    if (priority === 'high') return models.smart;

    return models[type ?? 'solving'];
  }

  ask(req: AiGatewayRequest): Observable<string> {
    const model = this.resolveModel(req.modelType, req.priority);

    const cacheKey = JSON.stringify({
      model,
      q: req.question,
      s: req.system,
      c: req.context,
    });

    const cached = this.cache.get(cacheKey);
    if (cached) return of(cached);

    this.loading.set(true);

    const body = {
      model,
      temperature: 0.5,
      max_tokens: 700,
      messages: [
        { role: 'system', content: req.system },
        ...(req.context ? [{ role: 'system', content: req.context }] : []),
        { role: 'user', content: req.question },
      ],
    };

    return this.http
      .post<AiApiResponse>(environment.openrouter.baseUrl, body, {
        headers: {
          Authorization: `Bearer ${environment.openrouter.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'AI Tutor',
        },
      })
      .pipe(
        retry({ count: 2, delay: 800 }),

        map((res) => {
          const ans = res?.choices?.[0]?.message?.content ?? '';
          this.cache.set(cacheKey, ans);
          return ans;
        }),

        catchError((err: HttpErrorResponse) => {
          // 🔥 FULL ERROR LOGGING
          console.group('❌ AI API ERROR');
          console.log('Status:', err.status);
          console.log('Message:', err.message);
          console.log('Error Body:', err.error);
          console.log('Headers:', err.headers);
          console.log('Request Model:', model);
          console.log('Request Body:', body);
          console.groupEnd();

          return of('Something went wrong. Please try again.');
        }),

        finalize(() => this.loading.set(false)),

        shareReplay(1),
      );
  }
}
