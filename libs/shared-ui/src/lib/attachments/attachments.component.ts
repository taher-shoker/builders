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

  triggerFileInput(fileInput: HTMLInputElement) {
    fileInput.click();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const filesArray = Array.from(input.files);
      this.filesSelected.emit(filesArray);
      input.value = '';
    }
  }

  onDeleteFile(index: number, id: number) {
    this.deleteFile.emit({ index, id });
  }

  onDownloadFile(index: number, id: number, file: File) {
    this.downloadFile.emit({ index, id, file });
  }
}
