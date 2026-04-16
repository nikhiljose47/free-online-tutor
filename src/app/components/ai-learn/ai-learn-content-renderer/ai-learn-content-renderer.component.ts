import { Component, ChangeDetectionStrategy, Input, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

type Block = {
  type: 'title' | 'para' | 'list' | 'code' | 'image';
  value: any;
};

@Component({
  selector: 'ai-content-renderer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ai-learn-content-renderer.component.html',
  styleUrls: ['./ai-learn-content-renderer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AiContentRendererComponent {
  private _content = signal<string>('');

  @Input()
  set content(val: string | null | undefined) {
    this._content.set(val ?? '');
  }

  readonly parsed = computed<Block[]>(() => this.parse(this._content()));

  // ✅ FIX: stable trackBy (no re-render / no error)
  trackByBlock = (i: number, item: Block) => item.type + '_' + i;
  trackByItem = (i: number, item: string) => item + '_' + i;

  private parse(input: string): Block[] {
    if (!input) return [];

    input = input
      .replace(/Title:/gi, '\nTitle:\n')
      .replace(/Explanation:/gi, '\nExplanation:\n')
      .replace(/-\s+/g, '\n- ');

    const lines = input.split('\n');

    const blocks: Block[] = [];

    let list: string[] = [];
    let para: string[] = [];
    let inCode = false;
    let codeBuffer: string[] = [];

    const flushPara = () => {
      if (para.length) {
        blocks.push({ type: 'para', value: para.join(' ') });
        para = [];
      }
    };

    const flushList = () => {
      if (list.length) {
        blocks.push({ type: 'list', value: [...list] });
        list = [];
      }
    };

    for (let raw of lines) {
      const line = raw.trim();
      if (!line) continue;

      if (line.startsWith('```')) {
        if (!inCode) {
          inCode = true;
          codeBuffer = [];
        } else {
          inCode = false;
          blocks.push({ type: 'code', value: codeBuffer.join('\n') });
        }
        continue;
      }

      if (inCode) {
        codeBuffer.push(line);
        continue;
      }

      if (line.toLowerCase().startsWith('title:')) {
        flushPara();
        flushList();
        blocks.push({
          type: 'title',
          value: line.replace(/title:/i, '').trim(),
        });
        continue;
      }

      if (/^https?:\/\/.*\.(png|jpg|jpeg|webp)$/i.test(line)) {
        flushPara();
        flushList();
        blocks.push({ type: 'image', value: line });
        continue;
      }

      if (line.toLowerCase().startsWith('explanation:')) continue;

      if (/^\d+\./.test(line) || line.startsWith('-')) {
        flushPara();
        list.push(line.replace(/^\d+\.\s*/, '').replace(/^-\s*/, ''));
        continue;
      }

      flushList();
      para.push(line);
    }

    flushPara();
    flushList();

    return blocks;
  }
}
