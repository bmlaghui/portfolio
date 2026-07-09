import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, ElementRef, ViewChild, AfterViewInit, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-rich-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="rich-editor-wrap">
      <div class="toolbar">
        <select class="tool-select" title="Format" (change)="formatBlock($any($event.target).value)">
          <option value="p">Paragraphe</option>
          <option value="h2">Titre H2</option>
          <option value="h3">Titre H3</option>
          <option value="blockquote">Citation</option>
          <option value="pre">Code</option>
        </select>
        <select class="tool-select compact" title="Taille" (change)="exec('fontSize', $any($event.target).value)">
          <option value="3">Normal</option>
          <option value="2">Petit</option>
          <option value="4">Grand</option>
          <option value="5">Très grand</option>
        </select>
        <span class="sep"></span>
        <button type="button" (click)="exec('undo')" title="Annuler">↶</button>
        <button type="button" (click)="exec('redo')" title="Rétablir">↷</button>
        <span class="sep"></span>
        <button type="button" (click)="exec('bold')" title="Gras"><b>B</b></button>
        <button type="button" (click)="exec('italic')" title="Italique"><i>I</i></button>
        <button type="button" (click)="exec('underline')" title="Souligné"><u>U</u></button>
        <button type="button" (click)="exec('strikeThrough')" title="Barré"><s>S</s></button>
        <span class="sep"></span>
        <button type="button" (click)="exec('insertUnorderedList')" title="Liste">≡</button>
        <button type="button" (click)="exec('insertOrderedList')" title="Liste numérotée">⒈</button>
        <span class="sep"></span>
        <button type="button" (click)="exec('justifyLeft')" title="Aligner à gauche">⇤</button>
        <button type="button" (click)="exec('justifyCenter')" title="Centrer">↔</button>
        <button type="button" (click)="exec('justifyRight')" title="Aligner à droite">⇥</button>
        <button type="button" (click)="exec('justifyFull')" title="Justifier">☰</button>
        <button type="button" (click)="exec('outdent')" title="Diminuer le retrait">‹</button>
        <button type="button" (click)="exec('indent')" title="Augmenter le retrait">›</button>
        <span class="sep"></span>
        <label class="color-tool" title="Couleur du texte">
          <span>A</span>
          <input type="color" [value]="textColor" (input)="applyColor('foreColor', $any($event.target).value)">
        </label>
        <label class="color-tool bg" title="Couleur de fond">
          <span>▣</span>
          <input type="color" [value]="backColor" (input)="applyColor('hiliteColor', $any($event.target).value)">
        </label>
        <span class="sep"></span>
        <button type="button" (click)="insertLink()" title="Lien">🔗</button>
        <button type="button" (click)="mediaInput.click()" title="Uploader une image">🖼</button>
        <button type="button" (click)="insertMediaUrl()" title="Insérer un média par URL">▶</button>
        <button type="button" (click)="exec('insertHorizontalRule')" title="Séparateur">─</button>
        <span class="sep"></span>
        <button type="button" (click)="toggleSource()" title="Mode HTML">&lt;/&gt;</button>
        <button type="button" (click)="exec('removeFormat')" title="Effacer formatage">✕</button>
        <input #mediaInput type="file" accept="image/*" hidden (change)="uploadMedia($event)">
      </div>
      <textarea *ngIf="sourceMode()" class="source-body" [ngModel]="sourceValue" (ngModelChange)="updateSource($event)" spellcheck="false"></textarea>
      <div *ngIf="!sourceMode()"
           #editor
           class="editor-body"
           contenteditable="true"
           [attr.placeholder]="placeholder"
           (input)="onInput($event)"
           (blur)="onBlur()"
           (mouseup)="saveSelection()"
           (keyup)="saveSelection()"
           (keydown)="onKeydown($event)"></div>
    </div>
  `,
  styles: [`
    .rich-editor-wrap { border: 1px solid var(--glass-border); border-radius: 12px; overflow: hidden; transition: 0.25s; background: var(--surface); }
    .rich-editor-wrap:focus-within { border-color: var(--primary); box-shadow: 0 0 20px rgba(192,132,252,0.1); }
    .toolbar { display: flex; align-items: center; flex-wrap: wrap; gap: 4px; padding: 0.65rem 0.8rem; border-bottom: 1px solid var(--glass-border); background: color-mix(in srgb, var(--surface) 88%, transparent); }
    .toolbar button, .tool-select, .color-tool { background: color-mix(in srgb, var(--bg) 70%, transparent); border: 1px solid var(--glass-border); color: var(--text-muted); border-radius: 6px; min-width: 30px; height: 30px; cursor: pointer; font-size: 0.8rem; display: flex; align-items: center; justify-content: center; transition: 0.2s; }
    .toolbar button:hover, .tool-select:hover, .color-tool:hover { background: color-mix(in srgb, var(--primary) 10%, var(--surface)); border-color: var(--primary); color: var(--text); }
    .tool-select { width: auto; max-width: 132px; padding: 0 0.45rem; font-weight: 800; }
    .tool-select option { color: #e2e8f0; background: #111827; }
    :host-context([data-theme="light"]) .tool-select option { color: #0f172a; background: #ffffff; }
    .tool-select.compact { max-width: 95px; }
    .color-tool { position: relative; gap: 0.25rem; padding: 0 0.45rem; font-weight: 900; }
    .color-tool input { position: absolute; inset: 0; opacity: 0; cursor: pointer; }
    .color-tool span { border-bottom: 3px solid currentColor; line-height: 1; }
    .color-tool.bg span { border-bottom-color: var(--primary); }
    .sep { width: 1px; height: 20px; background: var(--glass-border); margin: 0 4px; }
    .editor-body { 
      min-height: 240px; padding: 1.2rem; color: var(--text); font-size: 1rem; line-height: 1.8; outline: none; background: color-mix(in srgb, var(--bg) 48%, transparent);
      font-family: var(--font-body);
    }
    .source-body { width: 100%; min-height: 260px; padding: 1rem; border: 0; outline: 0; resize: vertical; color: var(--text); background: color-mix(in srgb, var(--bg) 62%, transparent); font: 0.86rem/1.7 'Fira Code', monospace; }
    .editor-body:empty::before { content: attr(placeholder); color: var(--text-muted); opacity: .65; pointer-events: none; }
    .editor-body :is(h2, h3) { font-family: var(--font-title); font-weight: 800; margin: 1.2rem 0 0.5rem; color: var(--text); }
    .editor-body h2 { font-size: 1.4rem; }
    .editor-body h3 { font-size: 1.1rem; }
    .editor-body p { margin-bottom: 0.8rem; }
    .editor-body ul, .editor-body ol { padding-left: 1.5rem; margin-bottom: 0.8rem; }
    .editor-body a { color: var(--primary); }
    .editor-body strong { color: var(--text); }
    .editor-body img, .editor-body video { display: block; max-width: 100%; height: auto; margin: 1rem 0; border-radius: 10px; }
    .editor-body blockquote { margin: 1rem 0; padding: 0.8rem 1rem; border-left: 3px solid var(--primary); background: color-mix(in srgb, var(--primary) 8%, transparent); border-radius: 8px; }
    .editor-body pre { overflow-x: auto; padding: 1rem; border-radius: 8px; background: color-mix(in srgb, #020617 88%, transparent); color: #a5f3fc; }
  `]
})
export class RichEditorComponent implements OnChanges, AfterViewInit {
  @Input() value = '';
  @Input() placeholder = 'Rédigez votre contenu...';
  @Output() valueChange = new EventEmitter<string>();
  @ViewChild('editor') editorRef!: ElementRef<HTMLDivElement>;

  sourceMode = signal(false);
  sourceValue = '';
  textColor = '#111827';
  backColor = '#fef3c7';

  private http = inject(HttpClient);
  private toast = inject(ToastService);
  private skipUpdate = false;
  private savedRange?: Range;

  ngAfterViewInit() {
    this.setContent(this.value);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['value'] && this.editorRef) {
      const incoming = changes['value'].currentValue ?? '';
      if (this.sourceMode()) {
        this.sourceValue = incoming;
      } else if (incoming !== this.editorRef.nativeElement.innerHTML) {
        this.skipUpdate = true;
        this.setContent(incoming);
      }
    }
  }

  private setContent(html: string) {
    if (this.editorRef) {
      this.editorRef.nativeElement.innerHTML = html || '';
    }
  }

  exec(command: string, value?: string) {
    if (this.sourceMode()) return;
    this.editorRef.nativeElement.focus();
    this.restoreSelection();
    document.execCommand(command, false, value);
    this.saveSelection();
    this.emit();
  }

  formatBlock(value: string) {
    this.exec('formatBlock', value);
  }

  applyColor(command: string, value: string) {
    if (command === 'foreColor') this.textColor = value;
    if (command === 'hiliteColor') this.backColor = value;
    this.exec(command, value);
  }

  insertLink() {
    const url = prompt('URL du lien :');
    if (url) this.exec('createLink', url);
  }

  insertMediaUrl() {
    const url = prompt('URL de l’image ou de la vidéo :');
    if (!url) return;
    if (/\.(mp4|webm|ogg)(\?.*)?$/i.test(url)) {
      this.insertHtml(`<video src="${this.escapeAttr(url)}" controls></video>`);
      return;
    }
    this.insertHtml(`<img src="${this.escapeAttr(url)}" alt="">`);
  }

  uploadMedia(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      this.toast.error('Format refusé. Image uniquement.');
      input.value = '';
      return;
    }
    const formData = new FormData();
    formData.append('file', file);
    this.http.post<{ url: string }>('/api/uploads/image', formData).subscribe({
      next: ({ url }) => {
        this.insertHtml(`<img src="${this.escapeAttr(url)}" alt="">`);
        input.value = '';
      },
      error: (err: any) => {
        this.toast.error('Échec du transfert : ' + (err.error?.message || 'Serveur non joignable'));
        input.value = '';
      },
    });
  }

  toggleSource() {
    if (this.sourceMode()) {
      this.sourceMode.set(false);
      setTimeout(() => this.setContent(this.sourceValue));
      this.valueChange.emit(this.sourceValue);
      return;
    }
    this.sourceValue = this.editorRef?.nativeElement.innerHTML ?? this.value ?? '';
    this.sourceMode.set(true);
  }

  updateSource(value: string) {
    this.sourceValue = value;
    this.valueChange.emit(value);
  }

  onInput(_: Event) {
    if (this.skipUpdate) { this.skipUpdate = false; return; }
    this.saveSelection();
    this.emit();
  }

  onBlur() {
    this.saveSelection();
    this.emit();
  }

  onKeydown(e: KeyboardEvent) {
    if (e.key === 'Tab') {
      e.preventDefault();
      document.execCommand('insertHTML', false, '&nbsp;&nbsp;&nbsp;&nbsp;');
      this.saveSelection();
    }
  }

  private insertHtml(html: string) {
    if (this.sourceMode()) {
      this.updateSource(`${this.sourceValue}${html}`);
      return;
    }
    this.editorRef.nativeElement.focus();
    this.restoreSelection();
    document.execCommand('insertHTML', false, html);
    this.saveSelection();
    this.emit();
  }

  saveSelection() {
    if (!this.editorRef || this.sourceMode()) return;
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    const range = selection.getRangeAt(0);
    if (this.editorRef.nativeElement.contains(range.commonAncestorContainer)) {
      this.savedRange = range.cloneRange();
    }
  }

  private restoreSelection() {
    if (!this.savedRange) return;
    const selection = window.getSelection();
    if (!selection) return;
    selection.removeAllRanges();
    selection.addRange(this.savedRange);
  }

  private escapeAttr(value: string) {
    return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
  }

  private emit() {
    this.valueChange.emit(this.editorRef?.nativeElement.innerHTML ?? '');
  }
}
