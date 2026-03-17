import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  Input,
  ViewChild,
  ElementRef,
  effect,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { AiChatDomainRegistryService } from '../../../core/registry/ai-chat-domain-registry.service';

type Role = 'user' | 'assistant';

interface ChatMsg {
  id: number;
  role: Role;
  content: string;
}

type DomainType = 'class9-maths' | 'coding-kids';

@Component({
  selector: 'ai-tutor-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ai-tutor-chat.component.html',
  styleUrls: ['./ai-tutor-chat.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AiTutorChatComponent {
  private aiChatRegistry = inject(AiChatDomainRegistryService);

  @ViewChild('chatBody') chatBody!: ElementRef;

  question = '';
  loading = signal(false);
  messages = signal<ChatMsg[]>([]);

  private id = 2;
  private _context = '';
  private _domain: DomainType = 'class9-maths';

  get contextLabel() {
    return this._context;
  }

  @Input({ required: true })
  set context(value: string) {
    if (!value || value === this._context) return;
    this._context = value;

    if (this.messages().length === 0) {
      this.messages.set([
        { id: 1, role: 'assistant', content: `Ask any question about ${value}.` },
      ]);
    }
  }

  @Input({ required: true })
  set domain(value: DomainType) {
    this._domain = value;
  }

  constructor() {
    effect(() => {
      this.messages();
      queueMicrotask(() => {
        if (this.chatBody) {
          this.chatBody.nativeElement.scrollTop = this.chatBody.nativeElement.scrollHeight;
        }
      });
    });
  }

  send() {
    const q = this.question.trim();
    if (!q || this.loading()) return;

    this.messages.update((m) => [...m, { id: this.id++, role: 'user', content: q }]);

    this.question = '';
    this.loading.set(true);

    this.aiChatRegistry
      .ask(this._domain, {
        question: q,
        history: this.messages().slice(-6),
      })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (res: string) => {
          this.messages.update((m) => [...m, { id: this.id++, role: 'assistant', content: res }]);
        },
        error: () => {
          this.messages.update((m) => [
            ...m,
            { id: this.id++, role: 'assistant', content: 'Something went wrong. Try again.' },
          ]);
        },
      });
  }

  trackMsg(_: number, m: ChatMsg) {
    return m.id;
  }
}
