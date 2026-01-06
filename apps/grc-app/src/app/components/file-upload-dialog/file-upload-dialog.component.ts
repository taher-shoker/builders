import {
  Component,
  EventEmitter,
  inject,
  input,
  OnChanges,
  Output,
  ViewChild,
} from '@angular/core';
import { ConfirmationService } from 'primeng/api';
@Component({
  selector: 'stc-apps-file-upload-dialog',
  standalone: false,
  templateUrl: './file-upload-dialog.component.html',
  styleUrl: './file-upload-dialog.component.scss',
})
export class FileUploadDialogComponent implements OnChanges {
  confirmationService = inject(ConfirmationService);
  showDialog = input<boolean>(false);
  showDialog2 = false;
  fileType = input.required<string>();
  @Output() dialogHide: EventEmitter<void> = new EventEmitter<void>();
  @Output() uploadFile: EventEmitter<File> = new EventEmitter<File>();
  @ViewChild('fileInput') fileInput: any;
  selectedFile!: File;
  selectedFileName = '';
  selectedFileSize = '';
  fileValid = true;
  errorMessage = '';
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.selectedFileName = file.name;
      this.selectedFileSize = this.getFileSize(file.size);
      // Validate file type
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      if (fileExtension !== this.fileType().toLowerCase()) {
        this.fileValid = false;
        this.errorMessage = `Invalid file type. Please upload a .${this.fileType()} file.`;
      } else {
        this.fileValid = true;
        this.errorMessage = '';
      }
    }
  }
  getFileSize(size: number): string {
    if (size < 1024) {
      return size + ' bytes';
    } else if (size < 1048576) {
      return (size / 1024).toFixed(2) + ' KB';
    } else {
      return (size / 1048576).toFixed(2) + ' MB';
    }
  }
  onUpload(): void {
    if (this.selectedFile) {
      this.uploadFile.emit(this.selectedFile);
      this.hideDialog();
    }
  }
  ngOnChanges() {
    this.showDialog2 = this.showDialog();
  }
  hideDialog() {
    this.dialogHide.emit();
    setTimeout(() => {
      this.clearFileData();
    }, 300);
  }
  clearFileData() {
    this.selectedFile = undefined as any;
    this.selectedFileName = '';
    this.selectedFileSize = '';
  }
}
