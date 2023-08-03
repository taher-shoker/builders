import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  MomentDateAdapter,
} from '@angular/material-moment-adapter';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { Router } from '@angular/router';
import { LanguageManagerService } from '@stc-apps/lng-selector';
import { DialogService } from '@stc-apps/shared-ui';
import { ToastrService } from 'ngx-toastr';
import { CassesService, File } from '../../casses.service';

export const APP_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
@Component({
  selector: 'stc-apps-casse-form',
  templateUrl: './casse-form.component.html',
  styleUrls: ['./casse-form.component.scss'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
  ],
})
export class CasseFormComponent implements OnInit {
  form!: FormGroup;
  @Input() readOnly!: boolean;
  @Input() isSubmited!: boolean;
  @Input() casseId!: string;
  @Output() caseStatus = new EventEmitter<string>();

  constructor(
    private formBuilder: FormBuilder,
    protected dialogService: DialogService,
    private cassesService: CassesService,
    private toastr: ToastrService,
    private router: Router,
    private languageManagerService: LanguageManagerService
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
        const formData = new FormData();

        formData.append('file', files[i]);

        this.cassesService.uploadFile(formData).subscribe((res: any) => {
          if (res) {
            this.uploadedFiles.push(res);
            this.isLoading = false;
            this.form.get('attachments')?.setValue(this.uploadedFiles);
          }
        });
      }
    }
  }

  onDeleteFile(id: number) {
    console.log('EL ID ', id);
    this.cassesService.deleteFile(id).subscribe((res: any) => {
      this.uploadedFiles = this.uploadedFiles.filter((x: any) => x.id !== id);
      this.form.get('attachments')?.setValue(this.uploadedFiles);
    });
  }

  confirm() {
    this.dialogService.open('add-case-modal');
  }

  logger(): void {
    this.form.get('customerName')?.setValue('from logger');
    this.form.get('city')?.setValue('from logger');
    this.form.get('existingServiceOrder')?.setValue('from logger');
    this.form.get('serviceType')?.setValue('from logger');
    this.form.get('existingPlate')?.setValue('from logger');
    this.form.get('existingPhoneNumber')?.setValue('from logger');
    this.form.get('activationDate')?.setValue('from logger');
    this.form.get('wfmOrder')?.setValue('from logger');
    this.form.get('newPlate')?.setValue('from logger');
    this.form.get('newServiceOrder')?.setValue('from logger');
    this.form.get('newPhoneNumber')?.setValue('from logger');
    this.form.get('contactNumber')?.setValue('from logger');
    this.form.get('caseLabel')?.setValue('from logger');
    this.form.get('description')?.setValue('from logger');
  }

  produceDate(month: string, day: string, year: string) {
    let monthNum = 0;
    const monthsList = [
      { name: 'Jan', id: 1 },
      { name: 'Feb', id: 2 },
      { name: 'Mar', id: 3 },
      { name: 'Apr', id: 4 },
      { name: 'May', id: 5 },
      { name: 'Jun', id: 6 },
      { name: 'Jul', id: 7 },
      { name: 'Aug', id: 8 },
      { name: 'Sep', id: 9 },
      { name: 'Oct', id: 10 },
      { name: 'Nov', id: 11 },
      { name: 'Dec', id: 12 },
    ];

    for (const monthObj of monthsList) {
      if (monthObj.name === month) {
        monthNum = monthObj.id;
      }
    }

    const finalDate = `${monthNum}/${day}/${year}`;
    return finalDate;
  }

  getIDsOfObjects(objects: any[]): number[] {
    const finalArr = [];

    for (const obj of objects) {
      finalArr.push(obj.id);
    }

    return finalArr;
  }
  onSubmit() {
    if (this.form.valid) {
      this.dialogService.close()

      // const cutDate = this.form.get("activationDate")?.value.toString().split(" ")
      // const stringifiedFormattedDate = this.produceDate(cutDate[1], cutDate[2], cutDate[3])

      // this.form.get("activationDate")?.setValue(stringifiedFormattedDate)

      this.form
        .get('attachments')
        ?.setValue(this.getIDsOfObjects(this.form.get('attachments')?.value));

      const formCopy = this.form.value;
      formCopy.activationDate = this.form
        .get('activationDate')
        ?.value.format('DD/MM/YYYY');

      this.cassesService.createCasse(formCopy).subscribe((res) => {
        if (res) {
          const msgOfToaster =
            this.languageManagerService.getSavedLanguage() == 'ar'
              ? 'تم إضافة الحالة بنجاح'
              : 'Case is added successfully';
          this.toastr.success(msgOfToaster);
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

  cancel() {
    this.router.navigate(['../']);
  }
}
