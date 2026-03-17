import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, retry, shareReplay } from 'rxjs/operators';
import { environment } from '../../../environments/environment.prod';
import { AiGatewayRequest, AiModelType } from '../../../models/ai-chat/ai-chat.model';

interface AiApiResponse {
  choices: { message: { content: string } }[];
}

@Injectable({ providedIn: 'root' })
export class AiChatGatewayService {
  private http = inject(HttpClient);

  private cache = new Map<string, string>();

  readonly loading = signal(false);

  private resolveModel(type?: AiModelType) {
    const models = environment.aiModels;
    return models[type ?? 'solving'];
  }

  ask(req: AiGatewayRequest): Observable<string> {
    const model = this.resolveModel(req.modelType);

    const cacheKey = `${model}-${req.system}-${req.question}`;

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
        },
      })
      .pipe(
        retry({ count: 2, delay: 900 }),
        map((res) => {
          const ans = res?.choices?.[0]?.message?.content ?? '';
          this.cache.set(cacheKey, ans);
          this.loading.set(false);
          return ans;
        }),
        shareReplay(1),
      );
  }
}
