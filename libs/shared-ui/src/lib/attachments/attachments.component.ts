import {
  Component,
  EventEmitter,
  input,
  InputSignal,
  Output,
} from '@angular/core';

@Component({
  selector: 'stc-apps-attachments',
  templateUrl: './attachments.component.html',
  styleUrls: ['./attachments.component.scss'],
})
export class AttachmentsComponent {
  maxFileSize: InputSignal<number> = input(1);
  maxFiles: InputSignal<number> = input(5);
  accept: InputSignal<string[] | any> = input([]);
  displayedFiles: InputSignal<
    { file: File; formattedUploadDate: string }[] | any
  > = input([]);

  @Output() filesSelected = new EventEmitter<File[]>();
  @Output() deleteFile = new EventEmitter<{ index: number; id: number }>();
  @Output() downloadFile = new EventEmitter<{
    index: number;
    id: number;
    file: File;
  }>();
  fileSizeExceeded = false;
  fileLimitExceeded = false;

  triggerFileInput(fileInput: HTMLInputElement) {
    fileInput.click();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const maxFileSizeBytes = this.maxFileSize() * 1024 * 1024;

    if (input.files && input.files.length > 0) {
      const filesArray = Array.from(input.files);

      if (filesArray.length > this.maxFiles()) {
        this.fileLimitExceeded = true;
        this.removeErrorMessage('limit');
        input.value = '';
        return;
      }

      this.fileLimitExceeded = false;
      this.fileSizeExceeded = false;

      const validFiles = filesArray.filter((file) => {
        if (file.size > maxFileSizeBytes) {
          this.fileSizeExceeded = true;
          this.removeErrorMessage('size');
          return false;
        }

        return true;
      });

      if (validFiles.length > 0) {
        this.filesSelected.emit(validFiles);
      }

      input.value = '';
    }
  }
  removeErrorMessage(variableName: string) {
    if (variableName == 'size') {
      setTimeout(() => {
        this.fileSizeExceeded = false;
      }, 3000);
    } else if (variableName == 'limit') {
      setTimeout(() => {
        this.fileLimitExceeded = false;
      }, 3000);
    }
  }
  onDeleteFile(index: number, id: number) {
    this.deleteFile.emit({ index, id });
  }

  onDownloadFile(index: number, id: number, file: File) {
    this.downloadFile.emit({ index, id, file });
  }
}
