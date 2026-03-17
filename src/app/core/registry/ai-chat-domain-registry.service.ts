import { Injectable, inject } from '@angular/core'
import { Observable } from 'rxjs'
import { GateExamAiChatService } from '../../services/ai-chat/gate-exam-ai-chat.service'
import { CodingKidsAiChatService } from '../../services/ai-chat/coding-kids-ai-chat.service'


export type DomainType =
  | 'class9-maths'
  | 'coding-kids'

export interface TutorAskInput {
  question: string
  history?: { role: 'user' | 'assistant'; content: string }[]
}

interface TutorPort {
  ask(req: TutorAskInput): Observable<string>
}

@Injectable({ providedIn: 'root' })
export class AiChatDomainRegistryService {

  private class9 = inject(GateExamAiChatService)
  private codingKids = inject(CodingKidsAiChatService)

  private registry: Record<DomainType, TutorPort> = {
    'class9-maths': this.class9,
    'coding-kids': this.codingKids,
  }

  ask(domain: DomainType, req: TutorAskInput): Observable<string> {
    const service = this.registry[domain] ?? this.class9
    return service.ask(req)
  }

}