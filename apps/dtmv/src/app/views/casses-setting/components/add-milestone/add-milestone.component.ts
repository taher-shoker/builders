import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BannerDataService } from '@stc-apps/shared-ui';
import { CasesService } from '../../casses.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'stc-apps-add-milestone',
  templateUrl: './add-milestone.component.html',
  styleUrls: ['./add-milestone.component.scss'],
})
export class AddMilestoneComponent implements OnInit {
  form!: FormGroup;
  @ViewChild('fileUpload') fileUpload!: ElementRef;

  isLoading = false;
  formData = new FormData();
  files: File[] = [];
  errorSize = false;
  errorType = false;
  accept = '.xls,.xlsx';
  constructor(
    private bannerDataService: BannerDataService,
    private formBuilder: FormBuilder,
    public casesService: CasesService,
    private toastr: ToastrService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.uploadForm();
    this.bannerDataService.updateData({
      title: 'Add new Milestone',
      text: 'Please add actual data and be sure to add all required data',
    });
  }

  uploadForm() {
    this.form = this.formBuilder.group({
      file: ['', Validators.required],
    });
  }
  onSubmit() {
    this.isLoading = true;
    const onSuccess = (message: string) => {
      this.isLoading = false;
      this.toastr.success(message);
      this.router.navigate(['../']);
    };

    const handleError = (error: any) => {
      if (error) {
        this.isLoading = false;
      }
    };
    if (this.form.valid) {
      this.casesService
        .addBulkData(this.formData, this.casesService.setUserTeam())
        .subscribe(
          () => onSuccess('File has been uploaded successfully'),
          handleError
        );
    } else {
      Object.keys(this.form.controls).forEach((field) => {
        const control = this.form.get(field);
        control?.markAsTouched({ onlySelf: true });
      });
    }
  }
  cancel() {
    this.router.navigate(['../']);
  }
  /** Uploader functions **/

  uploadClick() {
    if (this.fileUpload) {
      this.fileUpload.nativeElement.click();
    }
  }

  clearInputElement() {
    this.errorSize = false;
    this.errorType = false;
    this.formData.delete('file');
    this.files = [];
  }

  handleUploadChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const files = Array.from(inputElement.files || []);
    if (files.length > 0) {
      this.clearInputElement();
      this.uploadAndProgress(files);
    }
  }

  uploadAndProgress(files: File[]) {
    this.files = files;
    files.forEach((f) => {
      console.log(f.type);

      if (f.size > 20000000) {
        this.errorSize = true;
      } else if (
        f.type !==
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ) {
        this.errorType = true;
      } else {
        this.formData.append('file', f);
        this.form.get('file')?.setValue(this.formData);
      }
    });
  }
}
