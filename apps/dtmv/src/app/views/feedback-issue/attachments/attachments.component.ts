import {
  Component,
  EventEmitter,
  input,
  InputSignal,
  Output,
} from '@angular/core';
import { FeedbackIssueService } from '../services/feedback-issues.service';
import { ToastrService } from 'ngx-toastr';
import { saveAs } from 'file-saver';
@Component({
  selector: 'stc-apps-feedback-issue-attachments',
  templateUrl: './attachments.component.html',
  styleUrl: './attachments.component.scss',
})
export class AttachmentsComponent {
  files: InputSignal<
    (
      | File
      | { attachmentId: number; attachmentName: string; fileSize: number }
    )[]
  > = input(
    [] as (
      | File
      | { attachmentId: number; attachmentName: string; fileSize: number }
    )[]
  );
  errorSize: InputSignal<boolean> = input(false);
  errorType: InputSignal<boolean> = input(false);
  errorMaxNumber: InputSignal<boolean> = input(false);
  logs: InputSignal<boolean> = input(false);
  fileName = '';
  fileSize = 0;
  @Output() removeFileEvent = new EventEmitter<File>();
  constructor(
    private feedbackIssuesService: FeedbackIssueService,
    private toastr: ToastrService
  ) {}
  getFileName(
    file: File | { attachmentId: number; attachmentName: string }
  ): string {
    return file instanceof File ? file.name : file.attachmentName;
  }
  getFileSize(
    file:
      | File
      | { attachmentId: number; attachmentName: string; fileSize: number }
  ): number {
    return file instanceof File ? file.size : file.fileSize;
  }
  isFileInstance(file: any): file is File {
    return file instanceof File;
  }
  removeFile(file: any) {
    this.removeFileEvent.emit(file);
  }
  downloadFile(file: any) {
    console.log(file.attachmentId);
    this.feedbackIssuesService.downloadAttachment(file.attachmentId).subscribe({
      next: (buffer) => {
        const data: Blob = new Blob([buffer], {
          type: 'text/csv;charset=utf-8',
        });
        // you may improve this code to customize the name
        // of the export based on date or some other factors
        saveAs(data, file.attachmentName);
        this.toastr.success('Image downloaded successfully');
      },
    });
  }
}
