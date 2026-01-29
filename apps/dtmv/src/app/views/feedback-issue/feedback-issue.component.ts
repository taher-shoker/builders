import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { FeedbackIssueService } from './services/feedback-issues.service';
import {
  feedbackIssuesAttachment,
  formBody,
} from './models/feedback-issue.model';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
@Component({
  selector: 'stc-apps-feedback-issue',
  templateUrl: './feedback-issue.component.html',
  styleUrl: './feedback-issue.component.scss',
})
export class FeedbackIssueComponent implements OnInit {
  feedbackIssueForm!: FormGroup;
  formData = new FormData();
  selectedFile: File | null = null;
  files: File[] = [];
  errorSize = false;
  errorType = false;
  errorMaxNumber = false;
  isLoading = false;
  isUploadPending = false;
  attachamentIDS: number[] = [];
  accept = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];
  @ViewChild('fileUpload') fileUpload!: ElementRef;
  constructor(
    private formBuilder: FormBuilder,
    private feedbackIssueService: FeedbackIssueService,
    private toastr: ToastrService,
    private router: Router,
    private dialogRef: MatDialogRef<FeedbackIssueComponent>
  ) {}
  ngOnInit(): void {
    this.intiateForm();
  }

  intiateForm() {
    this.feedbackIssueForm = this.formBuilder.group({
      type: ['FEEDBACK', Validators.required],
      subject: ['', [Validators.required, Validators.maxLength(50)]],
      comment: ['', [Validators.required, Validators.maxLength(1000)]],
      file: [''],
    });
  }
  uploadClick() {
    if (this.fileUpload) {
      this.fileUpload.nativeElement.click();
    }
  }
  clearFileInputElement() {
    this.errorSize = false;
    this.errorType = false;
    this.errorMaxNumber = false;
    this.formData.delete('file');
    this.files = [];
  }
  resetUploadErrors() {
    this.errorSize = false;
    this.errorType = false;
    this.errorMaxNumber = false;
  }
  handleUploadChange(event: Event): void {
    if (this.isUploadPending) {
      console.log('pending');

      event.preventDefault();
    } else {
      const inputElement = event.target as HTMLInputElement;
      const files = Array.from(inputElement.files || []);
      if (files.length > 0) {
        this.resetUploadErrors();
        this.uploadAndProgress(files);
      }
    }
  }
  uploadAndProgress(files: File[]) {
    console.log(this.files.length);

    this.isUploadPending = true;
    let filesProcessed = 0;
    const totalFiles = this.files?.length + files.length;
    if (totalFiles > 5) {
      this.errorMaxNumber = true;
      this.isUploadPending = false;
      console.log(totalFiles);
      return;
    }
    files.forEach((f) => {
      if (f.size > 8 * 1024 * 1024) {
        this.errorSize = true;
        this.isUploadPending = false;
      } else if (!this.accept.includes(f.type)) {
        this.errorType = true;
        this.isUploadPending = false;
      } else {
        const exists = this.files.some(
          (existingFile) =>
            existingFile.name === f.name && existingFile.size === f.size
        );
        if (!exists) {
          this.formData.append('file', f);
          this.feedbackIssueForm.get('file')?.setValue(this.formData);
          const singleFileFormData = new FormData();
          singleFileFormData.append('file', f);
          this.feedbackIssueService.uploadFile(singleFileFormData).subscribe({
            next: (attachment: feedbackIssuesAttachment) => {
              console.log('attachement', attachment);
              this.attachamentIDS.push(attachment.id);
              this.files.push(f);
              filesProcessed++;
              if (filesProcessed === files.length) {
                this.isUploadPending = false;
              }
            },
            error: () => {
              this.isUploadPending = false;
            },
          });
        } else if (exists) {
          this.isUploadPending = false;
          this.toastr.error('Attachment already uploaded once');
        }
      }
    });
    console.log('final attachment ID', this.attachamentIDS);
  }

  removeFile(fileToRemove: { file: File; attachmentId: number }): void {
    this.files = this.files.filter((file) => file !== fileToRemove.file);
    this.attachamentIDS = this.attachamentIDS.filter(
      (ID) => ID != fileToRemove.attachmentId
    );
    this.isUploadPending = false;
    this.errorMaxNumber = false;
    console.log(this.attachamentIDS, this.files);
  }
  cancel() {
    this.feedbackIssueForm.reset();
    this.clearFileInputElement();
    this.dialogRef.close();
  }
  submit() {
    if (!this.feedbackIssueForm?.valid) return;
    this.isLoading = true;
    const onSuccess = (message: string) => {
      this.isLoading = false;
      this.toastr.success(message);
      this.cancel();
    };

    const body: formBody = {
      type: this.feedbackIssueForm.value.type,
      title: this.feedbackIssueForm.value.subject.trim(),
      description: this.feedbackIssueForm.value.comment.trim(),
      attachmentIds: this.attachamentIDS,
    };
    if (body.title == '' || body.description == '') {
      this.toastr.error(
        'Subject must not be blank, Description must not be blank'
      );
      this.isLoading = false;
      return;
    }
    this.feedbackIssueService.submitFeedbackIssueForm(body).subscribe({
      next: () => {
        onSuccess('Feedback/Issue has been submitted successfully!');
      },
      error: () => {
        this.toastr.error('Something went wrong');
        this.isLoading = false;
      },
    });
  }
}
