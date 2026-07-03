import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, ElementRef, ViewChild, AfterViewInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rich-editor',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="rich-editor-wrap">
      <div class="toolbar">
        <button type="button" (click)="exec('bold')" title="Gras"><b>B</b></button>
        <button type="button" (click)="exec('italic')" title="Italique"><i>I</i></button>
        <button type="button" (click)="exec('underline')" title="Souligné"><u>U</u></button>
        <span class="sep"></span>
        <button type="button" (click)="exec('insertUnorderedList')" title="Liste">≡</button>
        <button type="button" (click)="exec('insertOrderedList')" title="Liste numérotée">⒈</button>
        <span class="sep"></span>
        <button type="button" (click)="exec('formatBlock', 'h2')" title="Titre H2">H2</button>
        <button type="button" (click)="exec('formatBlock', 'h3')" title="Titre H3">H3</button>
        <button type="button" (click)="exec('formatBlock', 'p')" title="Paragraphe">¶</button>
        <span class="sep"></span>
        <button type="button" (click)="insertLink()" title="Lien">🔗</button>
        <button type="button" (click)="exec('removeFormat')" title="Effacer formatage">✕</button>
      </div>
      <div #editor
           class="editor-body"
           contenteditable="true"
           [attr.placeholder]="placeholder"
           (input)="onInput($event)"
           (blur)="onBlur()"
           (keydown)="onKeydown($event)"></div>
    </div>
  `,
  styles: [`
    .rich-editor-wrap { border: 2px solid #111; border-radius: 12px; overflow: hidden; transition: 0.4s; background: #000; }
    .rich-editor-wrap:focus-within { border-color: var(--primary); box-shadow: 0 0 20px rgba(192,132,252,0.1); }
    .toolbar { display: flex; align-items: center; flex-wrap: wrap; gap: 2px; padding: 0.6rem 0.8rem; border-bottom: 1px solid #111; background: rgba(255,255,255,0.02); }
    .toolbar button { background: none; border: 1px solid transparent; color: #667; border-radius: 6px; width: 30px; height: 28px; cursor: pointer; font-size: 0.8rem; display: flex; align-items: center; justify-content: center; transition: 0.2s; }
    .toolbar button:hover { background: rgba(255,255,255,0.05); border-color: #333; color: #fff; }
    .sep { width: 1px; height: 20px; background: #222; margin: 0 4px; }
    .editor-body { 
      min-height: 220px; padding: 1.2rem; color: #fff; font-size: 1rem; line-height: 1.8; outline: none; 
      font-family: var(--font-body);
    }
    .editor-body:empty::before { content: attr(placeholder); color: #334155; pointer-events: none; }
    .editor-body :is(h2, h3) { font-family: var(--font-title); font-weight: 800; margin: 1.2rem 0 0.5rem; color: #fff; }
    .editor-body h2 { font-size: 1.4rem; }
    .editor-body h3 { font-size: 1.1rem; }
    .editor-body p { margin-bottom: 0.8rem; }
    .editor-body ul, .editor-body ol { padding-left: 1.5rem; margin-bottom: 0.8rem; }
    .editor-body a { color: var(--primary); }
    .editor-body strong { color: #fff; }
  `]
})
export class RichEditorComponent implements OnChanges, AfterViewInit {
  @Input() value = '';
  @Input() placeholder = 'Rédigez votre contenu...';
  @Output() valueChange = new EventEmitter<string>();
  @ViewChild('editor') editorRef!: ElementRef<HTMLDivElement>;

  private skipUpdate = false;

  ngAfterViewInit() {
    this.setContent(this.value);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['value'] && this.editorRef) {
      const incoming = changes['value'].currentValue ?? '';
      if (incoming !== this.editorRef.nativeElement.innerHTML) {
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
    this.editorRef.nativeElement.focus();
    document.execCommand(command, false, value);
    this.emit();
  }

  insertLink() {
    const url = prompt('URL du lien :');
    if (url) this.exec('createLink', url);
  }

  onInput(_: Event) {
    if (this.skipUpdate) { this.skipUpdate = false; return; }
    this.emit();
  }

  onBlur() {
    this.emit();
  }

  onKeydown(e: KeyboardEvent) {
    if (e.key === 'Tab') {
      e.preventDefault();
      document.execCommand('insertHTML', false, '&nbsp;&nbsp;&nbsp;&nbsp;');
    }
  }

  private emit() {
    this.valueChange.emit(this.editorRef?.nativeElement.innerHTML ?? '');
  }
}
