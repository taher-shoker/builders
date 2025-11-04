import {
  Component,
  Input,
  ViewChild,
  ElementRef,
  forwardRef,
  Output,
  EventEmitter,
  HostListener,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'stc-apps-file-uploader',
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.scss'],
  standalone: false,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FileUploaderComponent),
      multi: true,
    },
  ],
})
export class FileUploaderComponent implements ControlValueAccessor {
  value: any;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onTouched: any = () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onChange: any = () => {};

  writeValue(value: any): void {
    if (value !== null && typeof value === 'object') {
      if (value.every((i: number) => typeof i !== 'number')) {
        for (let i = 0; i < value.length; i++) {
          this.files.push({
            name: value[i].fileName,
            lastModified: 552,
            size: 42533,
            type: '',
            webkitRelativePath: '',
            arrayBuffer: function (): Promise<ArrayBuffer> {
              throw new Error('Function not implemented.');
            },
            stream: function (): ReadableStream<Uint8Array> {
              throw new Error('Function not implemented.');
            },
            text: function (): Promise<string> {
              throw new Error('Function not implemented.');
            },
            slice: function (
              start?: number | undefined,
              end?: number | undefined,
              contentType?: string | undefined
            ): Blob {
              throw new Error('Function not implemented.');
            },
          });
        }
      }
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  @Input() attachmentFiles: any = [];
  @Input()
  mode: any;
  @Input()
  names: any;
  @Input()
  url: any;
  @Input()
  method: any;
  @Input()
  multiple!: boolean;
  @Input()
  disabled!: boolean;
  @Input()
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
  @Input()
  maxFileSize: any;
  @Input()
  isLoading!: boolean;
  @Input()
  required = false;
  @Input()
  withCredentials: any;
  @Input()
  invalidFileMessageDetail!: string;
  @Input()
  previewWidth: any;
  @Input()
  chooseLabel = 'Choose';
  @Input()
  uploadLabel = 'Upload';
  @Input()
  cancelLabel = 'Cancel';
  @Input()
  customUpload: any;
  @Input()
  showUploadButton: any;
  @Input()
  showCancelButton: any;
  @Input()
  dataUriPrefix: any;
  @Input()
  deleteButtonLabel: any;
  @Input()
  deleteButtonIcon = 'close';
  @Input()
  showUploadInfo: any;
  @Output() onformchange = new EventEmitter();
  @Output() ondelete = new EventEmitter();

  @ViewChild('fileUpload')
  fileUpload!: ElementRef;
  @Input()
  files: File[] = [];
  @Input()
  size = 2e7;
  onClick(event: any) {
    if (this.fileUpload) {
      this.clearInputElement();
      this.fileUpload.nativeElement.click();
    }
  }

  onFileSelected(event: any) {
    //this.attachmentFiles = [];
    this.invalidFileMessageDetail = '';
    const files = event.target.files;

    // for (let i = 0; i < files.length; i++) {
    //   const file = files[i];
    //   if (this.validate(file)) {
    //     // if (this.isImage(file)) {
    //     //   file.objectURL = this.sanitizer.bypassSecurityTrustUrl(
    //     //     window.URL.createObjectURL(files[i])
    //     //   );
    //     // }
    //     // const formData = new FormData();
    //     // if (files) {
    //     //   for (let i = 0; i < files?.length; i++) {
    //     //     formData.append('file', files[i]);
    //     //   }
    //     // }
    //     if (!this.isMultiple()) {
    //       this.files = [];
    //     }

    //     this.files.push(files[i]);
    //   }
    // }

    let allFilesValid = true;

    for (let i = 0; i < files.length; i++) {
      if (!this.validate(files[i])) {
        allFilesValid = false;
      }
    }

    if (allFilesValid) {
      this.onformchange.emit(files);
    }
  }

  removeFile(file: File) {
    let ix;
    if (this.files && -1 !== (ix = this.files.indexOf(file))) {
      this.files.splice(ix, 1);
      this.clearInputElement();
    }
  }
  removeFileRemotly(id: number) {
    this.ondelete.emit(id);
  }

  validate(file: File) {
    // Check if the file size exceeds 10 MB
    if (file.size > this.size) {
      this.invalidFileMessageDetail = 'File is too big!';
      return false;
    }

    // Check if the file type is an empty string
    if (file.type === '') {
      // this.invalidFileMessageDetail = 'File type is not specified!';

      // Split the name and extension based on the last dot
      const lastDotIndex = file.name.lastIndexOf('.');
      const extension =
        lastDotIndex !== -1 ? '.' + file.name.substring(lastDotIndex + 1) : '';

      // Check if the file extension is in the list of accepted types
      if (!this.accept.includes(extension.toLowerCase())) {
        this.invalidFileMessageDetail = 'File is Invalid Format!';
        return false;
      } else {
        return true;
      }
    }

    // Check if the file type is in the list of accepted types
    if (!this.accept.includes(file.type)) {
      this.invalidFileMessageDetail = 'File is Invalid Format!';
      return false;
    } else {
      return true;
    }
  }
  truncateLabelText(label: string) {
    // Find the extension
    const extension = label.slice(label.lastIndexOf('.'));
    // Truncate the first 20 characters and append the extension
    const truncatedText = label.slice(0, 10) + '...' + extension;
    return truncatedText;
  }
  clearInputElement() {
    this.fileUpload.nativeElement.value = '';
  }

  isMultiple(): boolean {
    return this.multiple;
  }
}
