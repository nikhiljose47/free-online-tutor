import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { finalize } from 'rxjs'
import { AiChatGatewayService } from '../../../core/services/ai/ai-chat-gateway.service'

type Role = 'user' | 'assistant'

interface ChatMsg {
  id: number
  role: Role
  content: string
}

@Component({
  selector: 'ai-tutor-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ai-tutor-chat.component.html',
  styleUrls: ['./ai-tutor-chat.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AiTutorChatComponent {

  private ai = inject(AiChatGatewayService)

  question = ''

  loading = signal(false)

  messages = signal<ChatMsg[]>([
    { id: 1, role: 'assistant', content: 'Ask any Class 9 maths question.' }
  ])

  private id = 2

  send() {

    const q = this.question.trim()
    if (!q) return

    this.messages.update(m => [...m, { id: this.id++, role: 'user', content: q }])

    this.question = ''
    this.loading.set(true)

    this.ai.ask({
      system: 'You are a Class 9 maths tutor',
      question: q,
      modelType: 'theory'
    })
    .pipe(finalize(() => this.loading.set(false)))
    .subscribe(res => {
      this.messages.update(m => [...m, { id: this.id++, role: 'assistant', content: res }])
    })

  }

  trackMsg(_: number, m: ChatMsg) {
    return m.id
  }

}