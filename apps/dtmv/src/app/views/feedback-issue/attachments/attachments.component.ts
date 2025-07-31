import {
  Component,
  EventEmitter,
  input,
  InputSignal,
  Output,
} from '@angular/core';

@Component({
  selector: 'stc-apps-feedback-issue-attachments',
  templateUrl: './attachments.component.html',
  styleUrl: './attachments.component.scss',
})
export class AttachmentsComponent {
  files: InputSignal<File[]> = input([] as File[]);
  errorSize: InputSignal<boolean> = input(false);
  errorType: InputSignal<boolean> = input(false);
  errorMaxNumber: InputSignal<boolean> = input(false);
  logs: InputSignal<boolean> = input(false);
  @Output() removeFileEvent = new EventEmitter<File>();
  removeFile(file: File) {
    this.removeFileEvent.emit(file);
  }
}
