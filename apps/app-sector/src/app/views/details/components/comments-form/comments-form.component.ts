import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'stc-apps-comments-form',
  templateUrl: './comments-form.component.html',
  styleUrls: ['./comments-form.component.scss'],
})
export class CommentsFormComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;
  form: FormGroup = new FormGroup({});

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.handleForm();
  }

  handleForm() {
    this.form = this.fb.group({
      comment: this.fb.control('', [Validators.required]),
      attachment: this.fb.control([], [Validators.required]),
    });
  }

  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      console.log('Selected file:', file);
      this.form.patchValue({
        attachment: file,
      });
    }
  }

  onSubmit() {
    console.log('Form Data:', this.form.value);
  }
}
