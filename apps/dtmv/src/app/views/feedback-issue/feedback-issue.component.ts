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
  attachamentIDS: number[] = [];
  accept = 'image/*';
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
      subject: ['', [Validators.required, Validators.maxLength(100)]],
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
  handleUploadChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const files = Array.from(inputElement.files || []);
    if (files.length > 0) {
      this.clearFileInputElement();
      this.uploadAndProgress(files);
    }
  }
  uploadAndProgress(files: File[]) {
    this.files = files;
    const totalFiles = this.files.length;
    if (totalFiles > 5) {
      this.errorMaxNumber = true;
      console.log(totalFiles);

      return;
    }
    files.forEach((f) => {
      if (f.size > 8 * 1024 * 1024) {
        this.errorSize = true;
      } else if (!f.type.startsWith('image/')) {
        this.errorType = true;
      } else {
        this.formData.append('file', f);
        this.feedbackIssueForm.get('file')?.setValue(this.formData);
        this.feedbackIssueService.uploadFile(this.formData).subscribe({
          next: (attachment: feedbackIssuesAttachment) => {
            console.log('attachement', attachment);
            this.attachamentIDS.push(attachment.id);
          },
        });
      }
    });
  }
  removeFile(fileToRemove: File): void {
    this.files = this.files.filter((file) => file !== fileToRemove);
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
    console.log('submit', this.feedbackIssueForm.value);
    const body: formBody = {
      type: this.feedbackIssueForm.value.type,
      title: this.feedbackIssueForm.value.subject,
      description: this.feedbackIssueForm.value.comment,
      attachmentIds: this.attachamentIDS,
    };
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
