import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'stc-apps-feedback-issue',
  templateUrl: './feedback-issue.component.html',
  styleUrl: './feedback-issue.component.scss',
})
export class FeedbackIssueComponent {
  feedbackIssueForm!: FormGroup;
  selectedFile: File | null = null;
  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<FeedbackIssueComponent>
  ) {}
  intiateForm() {
    this.feedbackIssueForm = this.formBuilder.group({
      type: ['Feedback', Validators.required],
      subject: ['', Validators.required],
      comment: ['', Validators.required],
      attachment: null as File | null,
    });
  }
  submit() {
    console.log('submit');
  }
}
