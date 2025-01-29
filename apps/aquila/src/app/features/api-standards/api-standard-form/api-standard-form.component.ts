import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SharedUiModule } from '@stc-apps/shared-ui';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { catchError, of, switchMap, tap, timer } from 'rxjs';
import { BreadcrumbsComponent } from '../../../shared/components/breadcrumbs/breadcrumbs.component';
import { StandardsService } from '../../../shared/services/standards.service';

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
      standardId: ['', [Validators.required, Validators.pattern(/^\S*$/)]],
      name: ['', [Validators.required, Validators.pattern(/^\S*$/)]],
      version: ['', Validators.required],
      publishUpdate: ['', Validators.required],
      businessArea: ['', Validators.required],
      domain: ['', Validators.required],
      file: [[], Validators.required],
    });
    this.isEditMode = history.state.isEditMode;
    if (this.isEditMode && history.state.standard) {
      const standardData = history.state.standard;
      this.form.patchValue({
        ...standardData,
      });
    }

    if (!this.isEditMode) {
      this.form.get('name')?.valueChanges.subscribe((name: string) => {
        if (name) {
          const standardId = this.generateStandardId(name);
          this.form
            .get('standardId')
            ?.setValue(standardId, { emitEvent: false });
        }
      });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const formData = this.prepareFormData();
    this.standardsService
      .uploadStandard(formData)
      .pipe(
        tap(() => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Standard added successfully',
          });
          timer(1000)
            .pipe(
              switchMap(() => {
                this.router.navigate(['api-standard-list']);
                return of(null);
              })
            )
            .subscribe();
        }),
        catchError((error) => {
          const errorResponse = JSON.parse(error.error);
          const errorMessage =
            errorResponse?.errorMessage || 'Failed to add standard';
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: errorMessage,
          });
          console.error('Error adding standard:', error);
          return of(null);
        })
      )
      .subscribe();
  }

  private prepareFormData(): FormData {
    const formData = new FormData();

    Object.keys(this.form.value).forEach((key) => {
      if (key !== 'file') {
        let value = this.form.get(key)?.value;
        if (key === 'publishUpdate' && value instanceof Date) {
          value = this.formatDate(value);
        }
        formData.append(key, value);
      }
    });

    // Append files to FormData
    const files = this.form.get('file')?.value;
    if (files && files.length > 0) {
      files.forEach((file: File) => {
        formData.append('file', file, file.name);
      });
    }
    return formData;
  }

  private generateStandardId(name: string): string {
    return name.replace(/^-+|-+$/g, '');
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const milliseconds = String(date.getMilliseconds()).padStart(3, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}`;
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
    this.form.get('file')?.updateValueAndValidity();
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
      this.form.get('file')?.updateValueAndValidity();
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Invalid File',
        detail: `${selectedFile.name} is not a supported file type.`,
      });
    }
  }
}
