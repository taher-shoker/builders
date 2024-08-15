import {
  Component,
  ElementRef,
  input,
  InputSignal,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { newComment } from '../../../models/newComment';
import { dialogeService } from 'apps/app-sector/src/app/shared/services/dialoge.service';
import { AttachmentService } from '../../services/attachment.service';
import { KpiDTO } from '../../../models/SectorKpisDetails.model';
import { SharedFormService } from '../../../home/services/shared-form.service';
import { SectorService } from 'apps/app-sector/src/app/services/sector.service';

@Component({
  selector: 'stc-apps-comments-form',
  templateUrl: './comments-form.component.html',
  styleUrls: ['./comments-form.component.scss'],
})
export class CommentsFormComponent implements OnInit, OnChanges {
  kpiObjectSignal: InputSignal<KpiDTO | any> = input(undefined);

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
  constructor(
    private fb: FormBuilder,
    private dialogeService: dialogeService,
    private attachmentService: AttachmentService,
    private sharedFormService: SharedFormService,
    private sectorService: SectorService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['kpiObjectSignal']) {
      this.populateDisplayedFiles();
    }
  }

  ngOnInit(): void {
    this.handleForm();
  }

  populateDisplayedFiles() {
    const kpiObject = this.kpiObjectSignal();

    if (kpiObject && kpiObject.attachementList) {
      this.displayedFiles = kpiObject.attachementList;
    } else {
      console.log('No attachmentList found or kpiObject is undefined');
    }
  }

  handleForm() {
    this.form = this.fb.group({
      comment: this.fb.control('', [Validators.required]),
      attachments: this.fb.control([], [Validators.required]),
    });
  }

  formatDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return `Uploaded at ${date.toLocaleDateString('en-US', options)}`;
  }

  // triggerFileInput() {
  //   this.fileInput.nativeElement.click();
  // }

  // downloadFile(file: any) {
  //   const url = URL.createObjectURL(file);
  //   const anchor = document.createElement('a');
  //   anchor.href = url;
  //   anchor.download = file.name;
  //   document.body.appendChild(anchor);
  //   anchor.click();
  //   document.body.removeChild(anchor);
  //   URL.revokeObjectURL(url);
  // }

  // deleteFile(index: number) {
  //   this.uploadedFiles?.splice(index, 1);
  //   this.displayedFiles?.splice(index, 1);
  // }
  // index = 0;
  // file: any;
  // confirmdDownload() {
  //   this.downloadFile(this.file);
  // }
  // confirmDelete() {
  //   this.deleteFile(this.index);
  // }
  // openDialog(downloadOrDeleteFlag: string, index: number, file?: any) {
  //   this.index = index;
  //   if (downloadOrDeleteFlag == 'delete') {
  //     const dialogeDesc = 'Are you sure you want to delete this attachment?';
  //     const confirmationBtnDesc = 'Delete';
  //     this.dialogeService.openDialog(
  //       '0ms',
  //       '0ms',
  //       dialogeDesc,
  //       confirmationBtnDesc,
  //       this.confirmDelete.bind(this)
  //     );
  //   } else {
  //     this.file = file;
  //     const dialogeDesc = `Do you want to download file ${file.name}?`;
  //     const confirmationBtnDesc = 'Download';
  //     this.dialogeService.openDialog(
  //       '0ms',
  //       '0ms',
  //       dialogeDesc,
  //       confirmationBtnDesc,
  //       this.confirmdDownload.bind(this)
  //     );
  //   }
  // }

  openDialog(
    downloadOrDeleteFlag: string,
    index: number,
    id?: number,
    file?: any
  ) {
    if (downloadOrDeleteFlag === 'delete' && id !== undefined) {
      const dialogeDesc = 'Are you sure you want to delete this attachment?';
      const confirmationBtnDesc = 'Delete';
      this.dialogeService.openDialog(
        '0ms',
        '0ms',
        dialogeDesc,
        confirmationBtnDesc,
        () => this.onDeleteFile(index, id)
      );
    } else if (downloadOrDeleteFlag === 'download' && id !== undefined) {
      const dialogeDesc = `Do you want to download file ${file.attachmentDisplayName}?`;
      const confirmationBtnDesc = 'Download';
      this.dialogeService.openDialog(
        '0ms',
        '0ms',
        dialogeDesc,
        confirmationBtnDesc,
        () => this.onDownloadFile(file, id)
      );
    }
  }

  onContentChange(content: string) {
    const mentionsArray = this.extractMentions(content);
    this.mentionsArray = mentionsArray;
    this.form.get('comment')?.setValue(content);
    console.log('Mentions:', mentionsArray);
    // console.log('Content:', content);
  }

  extractMentions(text: string): string[] {
    const mentions: string[] = this.mentions2.map((mention: any) => {
      return `@${mention.name}`;
    });

    const mentionPattern = new RegExp(mentions.join('|'), 'gi');
    const extractedMentions: string[] = [];
    let match;

    while ((match = mentionPattern.exec(text)) !== null) {
      extractedMentions.push(match[0]);
    }

    console.log('Extracted mentions:', extractedMentions);
    return extractedMentions;
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

  onFilesSelected(filesArray: File[]) {
    const existingFileNames = new Set(
      this.uploadedFiles.map((file) => file.name)
    );
    const uniqueFiles = filesArray.filter(
      (file) => !existingFileNames.has(file.name)
    );
    const addAttachmentDto = {
      sectorName: this.sectorService.getSectorName(),
      year: this.sharedFormService.getForm().value.year,
      quarter: this.sharedFormService.getForm().value.quarter,
      scorecardTitle: 'Group Business Unit',
      kpiCode: this.kpiObjectSignal().kpiCode,
      note: 'Test Note',
    };

    uniqueFiles.forEach((file) => {
      this.attachmentService
        .uploadKPIAttachment(file, addAttachmentDto)
        .subscribe((result) => {
          this.displayedFiles.unshift({
            file: file,
            ...result,
          });
        });
    });
  }

  onDeleteFile(index: number, id: number) {
    this.attachmentService.deleteKPIAttachment(id).subscribe(() => {
      this.displayedFiles.splice(index, 1);
    });
  }

  onDownloadFile(file: any, id: number) {
    this.attachmentService.downloadKPIAttachment(id).subscribe((blob: Blob) => {
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = file.attachmentDisplayName;
      anchor.click();
      window.URL.revokeObjectURL(url);
    });
  }
}
