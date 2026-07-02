import { Component, Input, Output, EventEmitter, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-file-uploader',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="uploader-container" 
         [class.dragging]="isDragging()" 
         (dragover)="onDragOver($event)" 
         (dragleave)="onDragLeave($event)" 
         (drop)="onDrop($event)">
      
      <div class="preview-area" *ngIf="currentUrl; else uploadPlaceholder">
        <img [src]="currentUrl" alt="Preview" class="preview-img">
        <div class="overlay">
          <button type="button" class="btn-change" (click)="fileInput.click()">Changer l'image</button>
          <button type="button" class="btn-remove" (click)="removeImage()">Supprimer</button>
        </div>
      </div>

      <ng-template #uploadPlaceholder>
        <div class="placeholder" (click)="fileInput.click()">
          <div class="icon">📁</div>
          <p>Glissez une image ou <span>cliquez ici</span></p>
          <span class="hint">JPG, PNG, WEBP (Max 5MB)</span>
        </div>
      </ng-template>

      <div class="upload-progress" *ngIf="isUploading()">
        <div class="progress-bar" [style.width]="progress() + '%'"></div>
      </div>

      <input #fileInput type="file" (change)="onFileSelected($event)" accept="image/*" hidden>
    </div>
  `,
  styles: [`
    .uploader-container {
      width: 100%;
      min-height: 180px;
      background: rgba(0,0,0,0.4);
      border: 2px dashed rgba(255,255,255,0.1);
      border-radius: 20px;
      position: relative;
      overflow: hidden;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .uploader-container.dragging {
      border-color: #c084fc;
      background: rgba(192, 132, 252, 0.1);
      transform: scale(1.02);
      box-shadow: 0 0 30px rgba(192, 132, 252, 0.2);
    }
    .preview-area {
      width: 100%;
      height: 100%;
      position: absolute;
      inset: 0;
    }
    .preview-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: filter 0.3s;
    }
    .overlay {
      position: absolute;
      inset: 0;
      background: rgba(0,0,0,0.6);
      backdrop-filter: blur(5px);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      opacity: 0;
      transition: opacity 0.3s;
    }
    .preview-area:hover .overlay {
      opacity: 1;
    }
    .preview-area:hover .preview-img {
      filter: grayscale(0.5) blur(2px);
    }
    .placeholder {
      text-align: center;
      cursor: pointer;
      padding: 2rem;
      width: 100%;
    }
    .placeholder .icon {
      font-size: 2.5rem;
      margin-bottom: 1rem;
      display: block;
      animation: float 3s ease-in-out infinite;
    }
    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }
    .placeholder p {
      color: #94a3b8;
      font-size: 1rem;
      margin-bottom: 0.5rem;
    }
    .placeholder p span {
      color: #c084fc;
      font-weight: 700;
      text-decoration: underline;
    }
    .hint {
      font-size: 0.75rem;
      color: #475569;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .btn-change, .btn-remove {
      padding: 0.6rem 1.5rem;
      border-radius: 10px;
      font-weight: 800;
      cursor: pointer;
      border: none;
      transition: all 0.3s;
    }
    .btn-change {
      background: #c084fc;
      color: #000;
    }
    .btn-remove {
      background: rgba(255,255,255,0.05);
      color: #ef4444;
      border: 1px solid rgba(239, 68, 68, 0.2);
    }
    .btn-remove:hover {
      background: #ef4444;
      color: #fff;
    }
    .upload-progress {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: rgba(255,255,255,0.1);
    }
    .progress-bar {
      height: 100%;
      background: linear-gradient(90deg, #6366f1, #c084fc);
      box-shadow: 0 0 10px #c084fc;
      transition: width 0.3s ease-out;
    }
  `]
})
export class FileUploaderComponent {
  @Input() currentUrl: string | undefined = '';
  @Output() uploaded = new EventEmitter<string>();
  @Output() removed = new EventEmitter<void>();

  isDragging = signal(false);
  isUploading = signal(false);
  progress = signal(0);

  private http = inject(HttpClient);
  private toast = inject(ToastService);

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragging.set(true);
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragging.set(false);
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragging.set(false);
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.uploadFile(files[0]);
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.uploadFile(file);
    }
  }

  private uploadFile(file: File) {
    if (!file.type.startsWith('image/')) {
       this.toast.error("Format refusé. Seules les images sont acceptées.");
       return;
    }

    const formData = new FormData();
    formData.append('file', file);

    this.isUploading.set(true);
    this.progress.set(10);

    this.http.post<{ url: string }>('/api/uploads/image', formData).subscribe({
      next: (res) => {
        this.progress.set(100);
        setTimeout(() => {
          this.isUploading.set(false);
          this.currentUrl = res.url;
          this.uploaded.emit(res.url);
        }, 500);
      },
      error: (err: any) => {
        this.toast.error("Échec du transfert : " + (err.error?.message || "Serveur non joignable"));
        this.isUploading.set(false);
      }
    });
  }

  removeImage() {
    this.currentUrl = '';
    this.removed.emit();
  }
}
