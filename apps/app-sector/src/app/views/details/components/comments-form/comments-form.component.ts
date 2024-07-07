import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { newComment } from '../../../models/newComment';

@Component({
  selector: 'stc-apps-comments-form',
  templateUrl: './comments-form.component.html',
  styleUrls: ['./comments-form.component.scss'],
})
export class CommentsFormComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;
  @ViewChild('contenteditableDiv')
  contenteditableDiv!: ElementRef<HTMLDivElement>;
  @ViewChild('mentionList') mentionList!: ElementRef<HTMLUListElement>;
  newComment: newComment = {} as newComment;
  form: FormGroup = new FormGroup({});
  uploadedFiles: File[] = [];
  displayedFiles: { file: File; formattedUploadDate: string }[] = [];
  accept = [
    'image/png',
    'image/jpeg',
    'image/jpg',
    'application/pdf',
    'text/csv',
    'text/plain',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel',
  ];

  mentions: string[] = ['John', 'Jane', 'Doe', 'Smith'];
  placeholder = 'Enter Comment Here...';
  mentions2 = [
    { name: 'Assem Khalifa Ahmed', comment: 'UI/UX Designer' },
    { name: 'Assem Ahmed', comment: 'Business Analyst' },
    { name: 'Assem Khalifa', comment: 'UI/UX Designer' },
  ];
  mentionsArray: string[] = [''];
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.handleForm();
  }

  handleForm() {
    this.form = this.fb.group({
      comment: this.fb.control('', [Validators.required]),
      attachments: this.fb.control([], [Validators.required]),
    });
  }

  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const filesArray = Array.from(input.files);
      const existingFileNames = new Set(
        this.uploadedFiles.map((file) => file.name)
      );
      const uniqueFiles = filesArray.filter(
        (file) => !existingFileNames.has(file.name)
      );

      this.uploadedFiles = this.uploadedFiles.concat(uniqueFiles);
      this.displayedFiles = this.displayedFiles.concat(
        uniqueFiles.map((file) => ({
          file,
          formattedUploadDate: this.formatDate(new Date()),
        }))
      );

      console.log('Selected files:', this.uploadedFiles);
      this.form.patchValue({
        attachments: this.uploadedFiles,
      });
      input.value = '';
    }
  }

  formatDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return `Uploaded at ${date.toLocaleDateString('en-US', options)}`;
  }

  downloadFile(file: any) {
    const url = URL.createObjectURL(file);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = file.name;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  }

  deleteFile(index: number) {
    this.uploadedFiles?.splice(index, 1);
    this.displayedFiles?.splice(index, 1);
  }

  // onDeleteFile(id: number) {
  //   this.uploadedFiles = this.uploadedFiles.filter((x: any) => x.id !== id);
  //   this.form.get('attachments')?.setValue(this.uploadedFiles);
  // }

  onContentChange(content: string) {
    const mentionsArray = this.extractMentions(content);
    this.mentionsArray = mentionsArray;
    this.form.get('comment')?.setValue(content);
    console.log('Mentions:', mentionsArray);
    // console.log('Content:', content);
  }

  extractMentions(text: string): string[] {
    const mentionPattern = /@([\w\s]+)/g;
    const mentions: string[] = [];
    let match;
    while ((match = mentionPattern.exec(text)) !== null) {
      mentions.push(match[0].trim());
    }
    return mentions;
  }

  onSubmit() {
    console.log('Form Data:', this.form.value);
    this.newComment = {
      name: this.form.value.comment,
      mentions: this.mentionsArray,
    };

    console.log('this', this.newComment);
    this.form.reset();
  }
  onEditComment(content: string) {
    // console.log(content);
    this.form.get('comment')?.setValue(content);
  }
}
