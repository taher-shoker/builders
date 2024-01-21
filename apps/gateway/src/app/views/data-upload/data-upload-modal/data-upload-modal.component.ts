import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { DialogService } from '@stc-apps/shared-ui';
import { Option, SourceType } from '../../../shared/models/data-upload.model';
import { DataUploadService } from '../data-upload.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'stc-apps-data-upload-modal',
  templateUrl: './data-upload-modal.component.html',
  styleUrls: ['./data-upload-modal.component.scss'],
})
export class DataUploadModalComponent implements OnInit {
  form!: FormGroup;
  @ViewChild('fileUpload') fileUpload!: ElementRef;
  @Output() callList = new EventEmitter();
  @HostListener('document:click', ['$event'])
  onClick(event: Event) {
    const target = event.target as HTMLElement;
    const attributeOpenValue =
      this.el.nativeElement.getAttribute('attribute-open');
    if (target.className === 'stc-modal' && attributeOpenValue !== 'true') {
      const clickedInside = this.el.nativeElement.contains(target);
      if (!clickedInside) {
        this.closeModal();
      }
    }
  }
  formData = new FormData();
  files: File[] = [];
  errorSize = false;
  errorType = false;
  accept = '.csv';

  weeksNumbers: Option[] = [];
  sourceType!: SourceType;
  //array
  sourcesTypes: { id: SourceType; name: string }[] = [];
  allYears: Option[] = [];
  currentFromWeek = 0;
  currentToWeek = 0;
  errorMsg2!: string;
  disableDropdown = false;
  isLoading = false;
  inputFileName: string | undefined;

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    private formBuilder: FormBuilder,
    protected dialogService: DialogService,
    public _dataUploadService: DataUploadService,
    private el: ElementRef,
    private toastr: ToastrService
  ) {}
  ngOnInit(): void {
    this.uploadForm();
    this.sourcesTypes = [
      {
        name: 'Monthly',
        id: 'monthly',
      },
      {
        name: 'Lookup',
        id: 'lookup',
      },
    ];
  }

  selectedSourceType(source: { id: SourceType; name: string }) {
    this.sourceType = source.id;
    this.files = [];
    this.getYears();
    this.errorMsg2 = '';
    this.currentFromWeek = 0;
    this.currentToWeek = 0;
    this.weeksNumbers = [];
    this.form.controls['from'].enable();
    this.form.controls['to'].enable();
    this.form.controls['from'].setValue(null);
    this.form.controls['to'].setValue(null);
    if (source.id == 'monthly') {
      this.disableDropdown = false;
      for (let i = 1; i <= 12; i++) {
        this.weeksNumbers.push({ id: i, name: i });
      }
    } else {
      this.form.get('from')?.setValue('x');
      this.form.get('to')?.setValue('x');
      this.form.get('year')?.setValue('x');
      this.disableDropdown = true;
    }
  }
  selectFrom(e: Option) {
    this.currentFromWeek = +e.id;
    if (this.currentToWeek && this.currentFromWeek <= this.currentToWeek) {
      this.errorMsg2 = '';
    } else if (
      this.currentToWeek &&
      this.currentFromWeek > this.currentToWeek
    ) {
      this.errorMsg2 =
        'From Month value must be less than or equal To Month value';
    }
  }
  selectTo(e: Option) {
    this.currentToWeek = +e.id;
    if (this.currentFromWeek && this.currentFromWeek <= this.currentToWeek) {
      this.errorMsg2 = '';
    } else if (
      this.currentFromWeek &&
      this.currentFromWeek > this.currentToWeek
    ) {
      this.errorMsg2 =
        'From Month value must be less than or equal To Month value';
    }
  }
  uploadForm() {
    this.form = this.formBuilder.group({
      sourceType: ['', Validators.required],
      from: ['', Validators.required],
      to: ['', Validators.required],
      year: ['', Validators.required],
      file: ['', Validators.required],
    });
  }

  getYears() {
    this.allYears = [];
    const currentYear = new Date().getFullYear();
    for (let i = 2022; i <= currentYear; i++) {
      this.allYears.push({ id: i, name: i });
    }
  }

  onSubmit() {
    const onSuccess = (message: string) => {
      this.isLoading = false;
      this.closeModal();
      this.toastr.success(message);
      this.callList.emit();
    };

    const handleError = (error: any) => {
      if (error) {
        this.isLoading = false;
        this.closeModal();
        this.callList.emit();
      }
    };
    if (this.form.valid) {
      this.isLoading = true;
      if (this.form.value.sourceType.id === 'lookup') {
        this._dataUploadService
          .addFileDataLookup(this.formData)
          .subscribe(
            () => onSuccess('File has been uploaded successfully'),
            handleError
          );
      } else {
        const params = {
          from: this.form.value.from.id,
          to: this.form.value.to.id,
          year: this.form.value.year.id,
        };

        this._dataUploadService
          .addFileDataMonthly(this.formData, params)
          .subscribe(
            () => onSuccess('File has been uploaded successfully'),
            handleError
          );
      }
    } else {
      Object.keys(this.form.controls).forEach((field) => {
        const control = this.form.get(field);
        control?.markAsTouched({ onlySelf: true });
      });
    }
  }

  closeModal() {
    this.dialogService.close();
    this.form.reset();
    this.files = [];
    this.currentFromWeek = 0;
    this.currentToWeek = 0;
    this.errorMsg2 = '';
    this.clearInputElement();
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
      if (f.size > 20000000) {
        this.errorSize = true;
      } else if (f.type !== 'text/csv') {
        this.errorType = true;
      } else {
        this.formData.append('file', f);
        this.form.get('file')?.setValue(this.formData);
      }
    });
  }
}
