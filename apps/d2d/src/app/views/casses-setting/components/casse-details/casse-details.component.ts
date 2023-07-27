import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BannerDataService, DialogService } from '@stc-apps/shared-ui';
import {
  CaseStatus,
  CassesService,
  Task,
  TaskCicle,
} from '../../casses.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { saveAs } from 'file-saver';
import { LanguageManagerService } from '@stc-apps/lng-selector';
import { Subscription } from 'rxjs';

@Component({
  selector: 'stc-apps-casse-details',
  templateUrl: './casse-details.component.html',
  styleUrls: ['./casse-details.component.scss'],
})
export class CasseDetailsComponent implements OnInit, OnDestroy {
  readonly TaskCicle = TaskCicle;
  readonly CaseStatus = CaseStatus;

  closeForm!: FormGroup;
  infoForm!: FormGroup;
  rejectForm!: FormGroup;
  replyForm!: FormGroup;
  firstEscalateForm!: FormGroup;
  secondEscalateForm!: FormGroup;

  formData = new FormData();

  casseId!: string;
  caseStatus!: string;
  caseData: any;
  allTasks!: Task[];
  assigneeType = [
    { name: 'team', value: '1' },
    { name: 'users', value: '2' },
  ];
  users: any = [];

  langSub!: Subscription;
  invalidFileMessageDetail!: string;

  constructor(
    private formBuilder: FormBuilder,
    protected dialogService: DialogService,
    private bannerDataService: BannerDataService,
    private route: ActivatedRoute,
    public cassesService: CassesService,
    private languageManagerService: LanguageManagerService
  ) {}

  ngOnInit(): void {
    this.casseId = this.route.snapshot.params['id'];
    this.subscribeToLanguage();

    this.cassesService.getCasse(this.casseId).subscribe((res) => {
      if (res) {
        this.caseData = res;
        this.caseStatus = res.caseStatus;
      }
    });
    this.getCaseTasks(+this.casseId);

    this.closeForm = this.formBuilder.group({
      close_mail_content: [''],
    });
    this.infoForm = this.formBuilder.group({
      assignedTo: ['1', Validators.required],
      selectedUser: ['', Validators.required],
      message: ['', Validators.required],
      check_case_attachment: [''],
    });
    this.rejectForm = this.formBuilder.group({
      reject_note: [''],
    });
    this.replyForm = this.formBuilder.group({
      message: ['', Validators.required],
      check_case_attachment: [''],
    });
    this.firstEscalateForm = this.formBuilder.group({
      first_escalate_content: ['', Validators.required],
    });
    this.secondEscalateForm = this.formBuilder.group({
      second_escalate_content: ['', Validators.required],
    });
  }
  getCaseTasks(id: number) {
    this.cassesService.getTaskByCaseId(id).subscribe((res: any) => {
      this.allTasks = res.data.filter((t: any) => t.assignedUser);
    });
  }

  isLoading = false;
  uploadedFile: any[] = []; // turn to File later
  onUploadFile(files: string | any[]) {
    if (files) {

      for (let i = 0; i < files?.length; i++) {

        this.isLoading = true;
        const formData = new FormData();
        formData.append('file', files[i]);
        // this.formData.append('file', files[i]);
        this.cassesService.uploadFile(formData).subscribe((res: any) => {
          if (res) {
            this.uploadedFile.push(res);
            this.isLoading = false;
            this.infoForm.get('check_case_attachment')?.setValue(this.uploadedFile);
            console.log("The value", this.infoForm.get("check_case_attachment")?.value)
          }
        });
      }
    }
  }

  onDeleteFile(id: number) {
    this.cassesService.deleteFile(id).subscribe((res: any) => {
      this.uploadedFile = this.uploadedFile.filter((x: any) => x.id !== id);
      this.infoForm.get('check_case_attachment')?.setValue(this.uploadedFile);
    });
  }


  downloadFile(id: number, name: string) {
    this.cassesService.getFile(id).subscribe((buffer) => {
      const data: Blob = new Blob([buffer], {
        type: 'text/csv;charset=utf-8',
      });
      // you may improve this code to customize the name
      // of the export based on date or some other factors
      saveAs(data, name);
    });
  }
  /** function to call fetching all tasks again and close any Modal if found **/
  refreshTasks(data: any) {
    this.cassesService
      .updateCaseTask(+this.casseId, data)
      .subscribe((res: any) => {
        this.caseStatus = res.caseStatus;
        this.dialogService.close();
        this.getCaseTasks(+this.casseId);
      });
  }

  /** Actions with check case info (Request More Info) status **/
  onCheck() {
    this.dialogService.open('request-Info-Modal');
  }

  sendInfo() {

    const idsArr = []
    for(const obj of this.uploadedFile){
      idsArr.push(obj.id.toString())
    }

    const data = {
      form: {
        info_needed: 1,
        form_assignee: this.infoForm.get('selectedUser')?.value,
        message: this.infoForm.get('message')?.value,
        // check_case_attachment: this.infoForm.get('check_case_attachment')
        //   ?.value,
        check_case_attachment: idsArr

      },
    };

    this.refreshTasks(data);

    this.closeForm.reset();
    this.infoForm.reset();
    this.uploadedFile = [];
    console.log("The value", this.infoForm.get("check_case_attachment")?.value)
    console.log("The value", this.uploadedFile = [])

    this.rejectForm.reset();
    this.replyForm.reset();
    this.firstEscalateForm.reset();
    this.secondEscalateForm.reset();
  }
  cancelCheck() {
    const data = { form: { info_needed: 0 } };
    this.cassesService
      .updateCaseTask(+this.casseId, data)
      .subscribe((res: any) => {
        this.getCaseTasks(+this.casseId);
      });
  }

  /** Actions with Fill More Info status  **/
  getAssigneeValue(value: string) {
    if (value === '2') {
      this.users = [{ name: 'Demo', value: 'demo' }];
    }
  }
  confirmReply() {

    const idsArr = []
    for(const obj of this.uploadedFile){
      idsArr.push(obj.id.toString())
    }

    const data = {
      form: {
        message: this.replyForm.get('message')?.value,
        reply_attachments: idsArr
      },
    };
    this.closeForm.reset();
    this.infoForm.reset();
    this.uploadedFile = [];

    console.log("The value", this.replyForm.get("check_case_attachment")?.value)

    this.rejectForm.reset();
    this.replyForm.reset();
    this.firstEscalateForm.reset();
    this.secondEscalateForm.reset();
    this.refreshTasks(data);
  }
  replyfeed() {
    this.dialogService.open('replyFeeback-Modal');
  }

  /** Actions with Approve Casse status  **/

  confirm(){
    this.dialogService.open('approve-Modal');
  }

  approvedTask() {
    const data = { form: { case_approved: 1 } };
    this.refreshTasks(data);
  }
  /** Actions with Reject status **/
  reject() {
    this.dialogService.open('reject-Modal');
  }
  confirmReject() {
    const data = {
      form: {
        case_approved: 0,
        reject_note: this.rejectForm.get('reject_note')?.value,
      },
    };
    this.refreshTasks(data);
  }
  /** Actions with Within Response Casse status  **/

  withinResponse() {
    const data = { form: {} };

    this.refreshTasks(data);
  }
  /** Actions with Should First Escalate  Casse status  **/

  shouldFirstEscalate() {
    this.dialogService.open('first-escalate-Modal');
  }
  notFirstEscalate() {
    const data = { form: { should_first_escalate: 0 } };
    this.refreshTasks(data);
  }
  confirmFirstEscalate() {
    const data = {
      form: {
        should_first_escalate: 1,
        first_escalate_content: this.firstEscalateForm.get(
          'first_escalate_content'
        )?.value,
      },
    };
    this.refreshTasks(data);
  }
  /** Actions with Should Second Escalate  Casse status  **/

  shouldSecondEscalate() {
    this.dialogService.open('second-escalate-Modal');
  }
  notSecondEscalate() {
    const data = { form: { should_second_escalate: 0 } };
    this.refreshTasks(data);
  }
  confirmSecondEscalate() {
    const data = {
      form: {
        should_second_escalate: 1,
        second_escalate_content: this.secondEscalateForm.get(
          'second_escalate_content'
        )?.value,
      },
    };
    this.refreshTasks(data);
  }
  /** Actions with Send to Close  Casse status  **/

  sendToClose() {
    this.dialogService.open('close-Modal');
  }

  confirmClose() {
    const data = { form: this.closeForm.value };
    this.closeForm.reset();
    this.infoForm.reset();
    console.log("The value", this.infoForm.get("check_case_attachment")?.value)

    this.rejectForm.reset();
    this.replyForm.reset();
    this.firstEscalateForm.reset();
    this.secondEscalateForm.reset();
    this.refreshTasks(data);
  }

  subscribeToLanguage(){
    this.langSub = this.languageManagerService.getSavedLanguageAsStream().subscribe(res => {
      const outputTitle = this.languageManagerService.getSavedLanguage() === 'ar' ? `تفاصيل حالة D2D رقم : ${this.casseId} ` : `D2D Case ( ID: ${this.casseId} ) Details`
      this.bannerDataService.updateData({
        title: outputTitle,
        text: '',
      });
    })
  }

  ngOnDestroy(): void {
      this.langSub.unsubscribe();
  }
}
