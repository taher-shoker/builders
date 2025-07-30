import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
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
  isLoading = false;
  accept = 'image/*';
  @ViewChild('fileUpload') fileUpload!: ElementRef;
  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<FeedbackIssueComponent>
  ) {}
  ngOnInit(): void {
    this.intiateForm();
  }

  intiateForm() {
    this.feedbackIssueForm = this.formBuilder.group({
      type: ['Feedback', Validators.required],
      subject: ['', Validators.required],
      comment: ['', Validators.required],
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
    files.forEach((f) => {
      if (f.size > 8 * 1024 * 1024) {
        this.errorSize = true;
      } else if (!f.type.startsWith('image/')) {
        this.errorType = true;
      } else {
        this.formData.append('file', f);
        console.log('formData', this.formData, files, f);
        this.feedbackIssueForm.get('file')?.setValue(this.formData);
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
    console.log('submit', this.feedbackIssueForm.value);
  }
}
