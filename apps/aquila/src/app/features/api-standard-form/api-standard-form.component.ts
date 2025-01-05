import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { StandardsService } from '../../shared/services/standards.service';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SharedUiModule } from '@stc-apps/shared-ui';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { BreadcrumbsComponent } from '../../shared/components/breadcrumbs/breadcrumbs.component';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'stc-apps-api-standard-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    InputTextareaModule,
    CalendarModule,
    ButtonModule,
    SharedUiModule,
    RouterModule,
    FileUploadModule,
    ToastModule,
    BreadcrumbsComponent,
    SharedUiModule,
  ],
  providers: [MessageService],
  templateUrl: './api-standard-form.component.html',
  styleUrls: ['./api-standard-form.component.scss'],
})
export class ApiStandardFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private messageService = inject(MessageService);
  private standardsService = inject(StandardsService);
  form: FormGroup = new FormGroup({});
  isEditMode = false;
  acceptedTypes: string[] = [
    '.zip',
    '.rar',
    '.tar',
    '.gz',
    '.7z',
    '.tar.gz',
    '.tar.bz2',
    '.xz',
  ];

  uploadedFiles: any[] = [];

  ngOnInit(): void {
    this.form = this.fb.group({
      standardLink: ['', Validators.required],
      name: ['', Validators.required],
      version: ['', Validators.required],
      publishUpdate: ['', Validators.required],
      businessArea: ['', Validators.required],
      file: [[], Validators.required],
    });
    if (history.state && history.state.standard) {
      const standardData = history.state.standard;
      this.form.patchValue({
        ...standardData,
        name: standardData.apiName,
      });
    }
    this.isEditMode = history.state.isEditMode;
  }

  onSubmit(): void {
    if (this.form.valid) {
      const formData = new FormData();

      Object.keys(this.form.value).forEach((key) => {
        if (key !== 'file') {
          formData.append(key, this.form.get(key)?.value);
        }
      });

      const files = this.form.get('file')?.value;
      if (files && files.length > 0) {
        files.forEach((file: File) => {
          formData.append('file', file, file.name);
        });
      }

      this.standardsService.uploadStandard(formData).catch(
        (error) => {}
        // next: (response) => {
        //   this.router.navigate(['api-standard-list']);
        // },
        // error: (err) => {
        //   console.error('Error adding standard:', err);
        // },
      );
    } else {
      this.form.markAllAsTouched();
      return;
    }
  }

  onCancel(): void {
    this.router.navigate(['api-standard-list']);
  }

  onFileRemove(file: any): void {
    if (this.uploadedFiles) {
      this.uploadedFiles = this.uploadedFiles.filter((f) => f !== file);
    }

    this.form.get('file')?.setValue(this.uploadedFiles);
    this.form.get('file')?.updateValueAndValidity();
  }

  onFileUpload(event: any) {
    const files = event.files;
    this.uploadedFiles = files;
    this.form.get('file')?.patchValue(files);
    for (const file of files) {
    }
  }

  onFileSelect(event: any) {
    const fileList: FileList = event?.target?.files || event?.files;
    if (!fileList || fileList.length === 0) {
      console.error('No files selected');
      return;
    }

    const selectedFile = fileList[0];
    const fileExtension = selectedFile.name
      .slice(selectedFile.name.lastIndexOf('.'))
      .toLowerCase();

    if (this.acceptedTypes.includes(fileExtension)) {
      this.uploadedFiles = [selectedFile];
      this.form.get('file')?.setValue(this.uploadedFiles);
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Invalid File',
        detail: `${selectedFile.name} is not a supported file type.`,
      });
    }
  }
}
