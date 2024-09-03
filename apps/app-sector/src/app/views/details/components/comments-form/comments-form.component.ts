import {
  ChangeDetectorRef,
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
// eslint-disable-next-line @nx/enforce-module-boundaries
// eslint-disable-next-line @nx/enforce-module-boundaries
import { dialogeService } from 'apps/app-sector/src/app/shared/services/dialoge.service';
import { SharedFormService } from '../../../home/services/shared-form.service';
import { addCommentBody, comment, user } from '../../models/commentsModel';
import { commentsService } from '../../services/comments.service';
import { ToastrService } from 'ngx-toastr';
import { AttachmentService } from '../../services/attachment.service';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { SectorService } from 'apps/app-sector/src/app/services/sector.service';
import { KpiDTO } from '../../../models/SectorKpisDetails.model';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { NotificationsService } from '../../services/notifications.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'stc-apps-comments-form',
  templateUrl: './comments-form.component.html',
  styleUrls: ['./comments-form.component.scss'],
})
export class CommentsFormComponent implements OnInit, OnChanges {
  kpiObjectSignal: InputSignal<KpiDTO | any> = input(undefined);
  pathKpiCode: InputSignal<string> = input('');
  @ViewChild('fileInput') fileInput!: ElementRef;
  @ViewChild('contenteditableDiv')
  contenteditableDiv!: ElementRef<HTMLDivElement>;
  @ViewChild('mentionList') mentionList!: ElementRef<HTMLUListElement>;
  newComment: comment = {} as comment;
  form: FormGroup = new FormGroup({});
  uploadedFiles: File[] = [];
  displayedFiles: { file: File; formattedUploadDate: string }[] = [];
  accept = [
    'text/csv', // CSV files
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // Excel files (xlsx)
    'application/vnd.ms-excel', // Excel files (xls)
    'application/vnd.ms-powerpoint', // PowerPoint files (ppt)
    'application/vnd.openxmlformats-officedocument.presentationml.presentation', // PowerPoint files (pptx)
    'application/msword', // Word files (doc)
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // Word files (docx)
    'application/zip', // ZIP files
    'application/x-rar-compressed', // RAR files
  ];

  mentions: user[] = [];
  placeholder = 'Enter Comment Here...';
  // mentions2 = [
  //   {
  //     id: 532,
  //     name: 'Habiba Mohamed',
  //     email: 'habiba.mohamed@qeema.net',
  //     jobTitle: 'Has two roles User Chief, GCEO',
  //   },
  //   {
  //     id: 552,
  //     name: 'Sara',
  //     email: 'sara.alkurdy@qeema.net',
  //     jobTitle: 'Professional Football Player',
  //   },
  //   {
  //     id: 519,
  //     name: 'Habiba Mohamed',
  //     email: 'habiba12.mohamed@qeema.net',
  //     jobTitle: 'Has two roles User Chief',
  //   },
  //   {
  //     id: 614,
  //     name: 'Noha Yousry',
  //     email: 'noha.yousry@qeema.net',
  //     jobTitle: 'Football Manager',
  //   },
  // ];
  constructor(
    private fb: FormBuilder,
    private dialogeService: dialogeService,
    private attachmentService: AttachmentService,
    private sectorService: SectorService,
    private sharedFormService: SharedFormService,
    private commentsService: commentsService,
    private toastr: ToastrService,
    private notificatinService: NotificationsService,
    private cdr: ChangeDetectorRef,
    private cookieService: CookieService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['kpiObjectSignal']) {
      this.populateDisplayedFiles();
    }
  }

  ngOnInit(): void {
    this.notificatinService.mentionsList.subscribe((result: user[]) => {
      if (result) {
        console.log('replies section users', result);
        this.mentions = result;
      } else {
        this.mentions = [];
      }
    });
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
  mentionsArray: string[] = [''];
  onContentChange(content: string) {
    console.log('Content:', content);
    const contentText = this.extractTextFromContent(content);
    const mentionsArray = this.extractMentions(content);
    this.mentionsArray = mentionsArray;
    this.form.get('comment')?.setValue(contentText);
    // if (this.mentionsArray.length == 0) {
    //   this.notificatinService.mentionsObjects = [];
    // }
  }
  deleteMention(event: number[]) {
    console.log('deleteMention', event);
    const ids = event.map((str) => Number(str));
    this.notificatinService.mentionsObjects =
      this.notificatinService.mentionsObjects.filter((obj) =>
        ids.includes(obj.id)
      );
  }
  extractTextFromContent(content: any): string {
    return content ?? content.name;
  }
  resetForm() {
    this.form.reset();
  }
  extractMentions(text: string): string[] {
    const mentions: string[] = this.mentions.map((mention: user) => {
      return `${mention.name}`;
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
    console.log(this.notificatinService.mentionsObjects);

    this.notificatinService.mentionsObjects =
      this.notificatinService.mentionsObjects.filter(
        (item, index, self) => self.indexOf(item) === index
      );

    const commentObj: addCommentBody = {
      sectorName: this.sharedFormService.getForm().value.sectorName,
      year: this.sharedFormService.getForm().value.year,
      quarter: this.sharedFormService.getForm().value.quarter,
      scorecardTitle: this.cookieService.get('selectedTab'),
      kpiCode: this.pathKpiCode(),
      comment: this.form.value.comment,
      commaSeparatedMentions: this.notificatinService.mentionsObjects
        ? this.notificatinService.commaSepartedMentions(
            this.notificatinService.mentionsObjects
          )
        : null,
    };
    this.commentsService.addComment(commentObj).subscribe({
      next: (result: comment) => {
        this.toastr.success('Comment Added Successfully');
        console.log(result);
        this.newComment = result;
        if (this.notificatinService.mentionsObjects?.length !== 0) {
          this.notificatinService.notificationsSenderEngine(
            result.comment,
            this.notificatinService.mentionsObjects,
            result.id
          );
        }
        this.form.get('comment')?.reset();
        this.notificatinService.mentionsObjects = [];
        this.form.updateValueAndValidity();
      },
    });
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
      scorecardTitle: this.kpiObjectSignal().scorecardTitle,
      kpiCode: this.kpiObjectSignal().kpiCode,
      note: 'Test Note',
    };

    this.attachmentService
      .uploadKPIAttachment(uniqueFiles, addAttachmentDto)
      .subscribe((result) => {
        uniqueFiles.forEach((file, index) => {
          this.displayedFiles.unshift({
            file: file,
            ...result[index],
          });
        });
        this.toastr.success('File added Successfully');
      });
  }

  onDeleteFile(index: number, id: number) {
    this.attachmentService.deleteKPIAttachment(id).subscribe(() => {
      this.displayedFiles.splice(index, 1);
      this.toastr.success('File Deleted Successfully');
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
      this.toastr.success('File downloaded Successfully');
    });
  }
}
