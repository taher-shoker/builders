import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DialogService } from '@stc-apps/shared-ui';
import { ToastrService } from 'ngx-toastr';
import { CassesService, File } from '../../casses.service';

@Component({
  selector: 'stc-apps-casse-form',
  templateUrl: './casse-form.component.html',
  styleUrls: ['./casse-form.component.scss'],
})
export class CasseFormComponent implements OnInit {
  form!: FormGroup;
  @Input() readOnly!: boolean;
  @Input() isSubmited!: boolean;
  @Input() casseId!: string;
  @Output() caseStatus = new EventEmitter<string>();
  formData = new FormData();
  constructor(
    private formBuilder: FormBuilder,
    protected dialogService: DialogService,
    private cassesService: CassesService,
    private toastr: ToastrService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.casseForm();
  }

  casseForm() {
    this.form = this.formBuilder.group({
      customerName: ['', Validators.required],
      city: ['', Validators.required],
      existingServiceOrder: ['', Validators.required],
      serviceType: ['', Validators.required],
      existingPlate: ['', Validators.required],
      existingPhoneNumber: ['', Validators.required],
      activationDate: ['', Validators.required],
      wfmOrder: ['', Validators.required],
      newPlate: ['', Validators.required],
      newServiceOrder: ['', Validators.required],
      newPhoneNumber: ['', Validators.required],
      contactNumber: ['', Validators.required],
      caseLabel: ['', Validators.required],
      description: ['', Validators.required],
      attachments: [[]],
    });
  }
  teams = [{ name: 'test', value: '1' }];

  isLoading = false;
  uploadedFiles: File[] = [];

  onUploadFile(files: string | any[]) {
    if (files) {
      for (let i = 0; i < files?.length; i++) {
        this.isLoading = true;

        this.formData.append('file', files[i]);
      }
    }
    this.cassesService.uploadFile(this.formData).subscribe((res: any) => {
      if (res) {
        this.uploadedFiles.push(res.id);
        this.isLoading = false;
        this.form.get('attachments')?.setValue(this.uploadedFiles);
      }
    });
  }

  onDeleteFile(id: number) {
    this.cassesService.deleteFile(id).subscribe((res: any) => {
      this.uploadedFiles = this.uploadedFiles.filter((x: any) => x !== id);
      this.form.get('attachments')?.setValue(this.uploadedFiles);
    });
  }
  onSubmit() {
    if (this.form.valid) {
      this.cassesService.createCasse(this.form.value).subscribe((res) => {
        if (res) {
          this.toastr.success('add case  successfuly');
          this.form.reset();
          this.router.navigate(['./home']);
        }
      });
    } else {
      Object.keys(this.form.controls).forEach((field) => {
        const control = this.form.get(field);
        control?.markAsTouched({ onlySelf: true });
      });
    }
  }
}
