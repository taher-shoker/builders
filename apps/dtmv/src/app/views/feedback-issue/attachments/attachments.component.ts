import {
  Component,
  EventEmitter,
  input,
  InputSignal,
  Output,
} from '@angular/core';
import { FeedbackIssueService } from '../services/feedback-issues.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'stc-apps-feedback-issue-attachments',
  templateUrl: './attachments.component.html',
  styleUrl: './attachments.component.scss',
})
export class AttachmentsComponent {
  files: InputSignal<
    (File | { attachmentId: number; attachmentName: string })[]
  > = input([] as (File | { attachmentId: number; attachmentName: string })[]);
  errorSize: InputSignal<boolean> = input(false);
  errorType: InputSignal<boolean> = input(false);
  errorMaxNumber: InputSignal<boolean> = input(false);
  logs: InputSignal<boolean> = input(false);
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
  isFileInstance(file: any): file is File {
    return file instanceof File;
  }
  removeFile(file: any) {
    this.removeFileEvent.emit(file);
  }
  downloadFile(file: any) {
    console.log(file.attachmentId);
    this.feedbackIssuesService.downloadAttachment(file.attachmentId).subscribe({
      next: () => {
        this.toastr.success('Image downloaded successfully');
      },
    });
  }
}
