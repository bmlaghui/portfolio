import { Component, Input, Output, EventEmitter, signal, ChangeDetectionStrategy, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RichEditorComponent } from '../rich-editor/rich-editor';
import { FileUploaderComponent } from '../file-uploader/file-uploader';
import { SanitizePipe } from '../../../core/pipes/sanitize.pipe';

export type BlockType = 'paragraph' | 'code' | 'image' | 'video' | 'quote';

export interface ContentBlock {
  id: string;
  type: BlockType;
  content?: string;       // HTML for paragraph/quote, plain text for code
  language?: string;      // for code blocks
  url?: string;           // for image/video blocks
  caption?: string;       // for image blocks
  alt?: string;           // for image blocks
}

function uid(): string {
  return Math.random().toString(36).slice(2, 9);
}

@Component({
  selector: 'app-block-editor',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, RichEditorComponent, FileUploaderComponent, SanitizePipe],
  template: `
    <div class="block-editor">

      <!-- Blocks list -->
      <div class="blocks-list">
        <div class="block-item" *ngFor="let block of blocks(); let i = index" [attr.data-type]="block.type">
          <!-- Block controls -->
          <div class="block-controls">
            <span class="block-type-badge">{{ blockLabel(block.type) }}</span>
            <div class="block-actions">
              <button type="button" class="bact" (click)="moveBlock(i, -1)" [disabled]="i === 0" title="Monter">↑</button>
              <button type="button" class="bact" (click)="moveBlock(i, 1)" [disabled]="i === blocks().length - 1" title="Descendre">↓</button>
              <button type="button" class="bact del" (click)="removeBlock(i)" title="Supprimer">✕</button>
            </div>
          </div>

          <!-- PARAGRAPH -->
          <div class="block-content" *ngIf="block.type === 'paragraph'">
            <app-rich-editor
              [value]="block.content ?? ''"
              placeholder="Rédigez votre paragraphe..."
              (valueChange)="updateBlock(i, 'content', $event)">
            </app-rich-editor>
          </div>

          <!-- CODE -->
          <div class="block-content" *ngIf="block.type === 'code'">
            <div class="code-header">
              <select class="lang-select" [ngModel]="block.language" (ngModelChange)="updateBlock(i, 'language', $event)">
                <option value="typescript">TypeScript</option>
                <option value="javascript">JavaScript</option>
                <option value="html">HTML</option>
                <option value="scss">SCSS / CSS</option>
                <option value="bash">Bash / Shell</option>
                <option value="json">JSON</option>
                <option value="yaml">YAML</option>
                <option value="sql">SQL</option>
                <option value="php">PHP</option>
                <option value="python">Python</option>
                <option value="dockerfile">Dockerfile</option>
              </select>
            </div>
            <textarea class="code-textarea"
              [ngModel]="block.content ?? ''"
              (ngModelChange)="updateBlock(i, 'content', $event)"
              rows="8"
              placeholder="// Collez votre code ici...">
            </textarea>
          </div>

          <!-- IMAGE -->
          <div class="block-content" *ngIf="block.type === 'image'">
            <app-file-uploader
              [currentUrl]="block.url"
              (uploaded)="updateBlock(i, 'url', $event)"
              (removed)="updateBlock(i, 'url', '')">
            </app-file-uploader>
            <div class="image-meta" *ngIf="block.url">
              <input class="meta-input" type="text" [ngModel]="block.alt" (ngModelChange)="updateBlock(i, 'alt', $event)" placeholder="Texte alternatif (alt)">
              <input class="meta-input" type="text" [ngModel]="block.caption" (ngModelChange)="updateBlock(i, 'caption', $event)" placeholder="Légende (optionnel)">
            </div>
          </div>

          <!-- VIDEO -->
          <div class="block-content" *ngIf="block.type === 'video'">
            <input class="video-url-input" type="text" [ngModel]="block.url" (ngModelChange)="updateBlock(i, 'url', $event)" placeholder="URL YouTube, Vimeo ou lien direct mp4...">
            <div class="video-preview" *ngIf="block.url">
              <iframe *ngIf="isYoutube(block.url)" [src]="embedUrl(block.url) | sanitize" frameborder="0" allowfullscreen loading="lazy"></iframe>
              <video *ngIf="!isYoutube(block.url)" [src]="block.url" controls></video>
            </div>
          </div>

          <!-- QUOTE -->
          <div class="block-content" *ngIf="block.type === 'quote'">
            <textarea class="quote-textarea"
              [ngModel]="block.content ?? ''"
              (ngModelChange)="updateBlock(i, 'content', $event)"
              rows="3"
              placeholder="Votre citation...">
            </textarea>
            <input class="meta-input" type="text" [ngModel]="block.caption" (ngModelChange)="updateBlock(i, 'caption', $event)" placeholder="Source / Auteur (optionnel)">
          </div>
        </div>

        <div class="empty-blocks" *ngIf="blocks().length === 0">
          <span>Cliquez sur un type de bloc pour commencer</span>
        </div>
      </div>

      <!-- Add block toolbar -->
      <div class="add-toolbar">
        <span class="add-label">+ AJOUTER :</span>
        <button type="button" class="add-btn" (click)="addBlock('paragraph')">Texte</button>
        <button type="button" class="add-btn" (click)="addBlock('code')">Code</button>
        <button type="button" class="add-btn" (click)="addBlock('image')">Image</button>
        <button type="button" class="add-btn" (click)="addBlock('video')">Vidéo</button>
        <button type="button" class="add-btn" (click)="addBlock('quote')">Citation</button>
      </div>
    </div>
  `,
  styles: [`
    .block-editor { display: flex; flex-direction: column; gap: 1rem; }
    .blocks-list { display: flex; flex-direction: column; gap: 1.5rem; }
    .block-item { border: 1px solid var(--glass-border); border-radius: 12px; overflow: hidden; background: var(--surface); }
    .block-item[data-type="code"] { border-color: rgba(34,211,238,0.2); }
    .block-item[data-type="image"] { border-color: rgba(192,132,252,0.2); }
    .block-item[data-type="video"] { border-color: rgba(244,114,182,0.2); }
    .block-item[data-type="quote"] { border-color: rgba(250,204,21,0.2); }
    .block-controls { display: flex; align-items: center; justify-content: space-between; padding: 0.6rem 1rem; border-bottom: 1px solid var(--glass-border); background: color-mix(in srgb, var(--bg) 42%, transparent); }
    .block-type-badge { font-size: 0.6rem; font-weight: 900; color: var(--text-muted); letter-spacing: 2px; text-transform: uppercase; }
    .block-actions { display: flex; gap: 4px; }
    .bact { background: color-mix(in srgb, var(--surface) 85%, transparent); border: 1px solid var(--glass-border); color: var(--text-muted); border-radius: 4px; width: 24px; height: 24px; cursor: pointer; font-size: 0.7rem; display: flex; align-items: center; justify-content: center; transition: 0.2s; }
    .bact:hover { background: color-mix(in srgb, var(--primary) 12%, var(--surface)); color: var(--text); }
    .bact.del:hover { color: #ef4444; border-color: rgba(239,68,68,0.3); }
    .bact:disabled { opacity: 0.2; cursor: not-allowed; }
    .block-content { padding: 1rem; }
    /* Code block */
    .code-header { margin-bottom: 0.5rem; }
    .lang-select { background: color-mix(in srgb, var(--bg) 70%, transparent); border: 1px solid var(--glass-border); color: var(--secondary); padding: 0.3rem 0.6rem; border-radius: 6px; font-size: 0.7rem; font-family: 'Fira Code', monospace; }
    .code-textarea { width: 100%; background: color-mix(in srgb, #020617 88%, var(--bg)); border: 1px solid var(--glass-border); color: #a5f3fc; padding: 1rem; border-radius: 8px; font-family: 'Fira Code', monospace; font-size: 0.9rem; line-height: 1.7; resize: vertical; }
    /* Image block */
    .image-meta { display: flex; flex-direction: column; gap: 0.5rem; margin-top: 0.75rem; }
    .meta-input { background: color-mix(in srgb, var(--bg) 55%, transparent); border: 1px solid var(--glass-border); color: var(--text); padding: 0.6rem 0.8rem; border-radius: 8px; font-size: 0.85rem; width: 100%; }
    .meta-input:focus { outline: none; border-color: var(--primary); }
    /* Video block */
    .video-url-input { width: 100%; background: color-mix(in srgb, var(--bg) 55%, transparent); border: 1px solid var(--glass-border); color: var(--text); padding: 0.8rem 1rem; border-radius: 8px; font-size: 0.9rem; margin-bottom: 0.75rem; }
    .video-url-input:focus { outline: none; border-color: var(--primary); }
    .video-preview iframe, .video-preview video { width: 100%; aspect-ratio: 16/9; border-radius: 8px; border: none; }
    /* Quote block */
    .quote-textarea { width: 100%; background: rgba(250,204,21,0.06); border: 1px solid rgba(250,204,21,0.22); color: var(--text); padding: 1rem; border-radius: 8px; font-size: 1.05rem; font-style: italic; line-height: 1.7; resize: vertical; margin-bottom: 0.5rem; }
    /* Add toolbar */
    .empty-blocks { text-align: center; padding: 2rem; color: var(--text-muted); font-size: 0.85rem; border: 1px dashed var(--glass-border); border-radius: 12px; }
    .add-toolbar { display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; padding: 0.75rem 1rem; background: var(--surface); border: 1px solid var(--glass-border); border-radius: 10px; }
    .add-label { font-size: 0.6rem; font-weight: 900; color: var(--text-muted); letter-spacing: 2px; margin-right: 0.5rem; }
    .add-btn { background: color-mix(in srgb, var(--bg) 45%, transparent); border: 1px solid var(--glass-border); color: var(--text-muted); padding: 0.4rem 0.9rem; border-radius: 20px; font-size: 0.7rem; font-weight: 700; cursor: pointer; transition: 0.2s; }
    .add-btn:hover { background: var(--primary); color: #000; border-color: var(--primary); }
  `]
})
export class BlockEditorComponent {
  @Input() set value(v: ContentBlock[]) { this.blocks.set(v ?? []); }
  @Output() valueChange = new EventEmitter<ContentBlock[]>();
  blocks = signal<ContentBlock[]>([]);
  cdr = inject(ChangeDetectorRef);

  addBlock(type: BlockType) {
    const block: ContentBlock = { id: uid(), type, content: '', language: type === 'code' ? 'typescript' : undefined };
    this.blocks.update(b => [...b, block]);
    this.emit();
  }

  removeBlock(i: number) {
    this.blocks.update(b => b.filter((_, idx) => idx !== i));
    this.emit();
  }

  moveBlock(i: number, dir: -1 | 1) {
    const arr = [...this.blocks()];
    const j = i + dir;
    if (j < 0 || j >= arr.length) return;
    [arr[i], arr[j]] = [arr[j], arr[i]];
    this.blocks.set(arr);
    this.emit();
  }

  updateBlock(i: number, field: keyof ContentBlock, val: any) {
    this.blocks.update(b => b.map((block, idx) => idx === i ? { ...block, [field]: val } : block));
    this.emit();
  }

  private emit() {
    this.valueChange.emit(this.blocks());
  }

  blockLabel(type: BlockType): string {
    const map: Record<BlockType, string> = { paragraph: 'TEXTE', code: 'CODE', image: 'IMAGE', video: 'VIDÉO', quote: 'CITATION' };
    return map[type] ?? type;
  }

  isYoutube(url: string): boolean {
    return url.includes('youtube.com') || url.includes('youtu.be') || url.includes('vimeo.com');
  }

  embedUrl(url: string): string {
    if (url.includes('youtube.com/watch')) return url.replace('watch?v=', 'embed/');
    if (url.includes('youtu.be/')) return url.replace('youtu.be/', 'www.youtube.com/embed/');
    if (url.includes('vimeo.com/')) return url.replace('vimeo.com/', 'player.vimeo.com/video/');
    return url;
  }
}
