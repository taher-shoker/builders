import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BannerDataService, DialogService } from '@stc-apps/shared-ui';
import {
  CaseStatus,
  CasesService,
  TaskInDetails,
  TaskCicle,
  Case,
} from '../../casses.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { saveAs } from 'file-saver';
import { LanguageManagerService } from '@stc-apps/lng-selector';
import { Subscription } from 'rxjs';
import { AuthService } from './../../../../services/auth.service';

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
  taskId!: number;
  caseSerial!: string;
  caseStatus!: string;
  caseData: any;
  allTasks!: TaskInDetails[];
  assigneeType = [
    { name: 'team', value: '1' },
    { name: 'users', value: '2' },
  ];
  users: any = [];
  teams: any = [];
  selectedTeam = {};
  langSub!: Subscription;
  invalidFileMessageDetail!: string;

  constructor(
    private formBuilder: FormBuilder,
    protected dialogService: DialogService,
    private bannerDataService: BannerDataService,
    private route: ActivatedRoute,
    public CasesService: CasesService,
    private languageManagerService: LanguageManagerService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.casseId = this.route.snapshot.params['id'];

    this.bannerDataService.updateData({
      title: '',
      text: '',
    });

    this.CasesService.getCase(this.casseId).subscribe((res) => {
      if (res) {
        this.caseData = res;
        this.caseSerial = res.caseSerialNumber;
        this.caseStatus = res.caseStatus;
        this.subscribeToLanguage();
        this.handleTeam(this.caseData, this.teams);
      }
    });
    this.getCaseTasks(+this.casseId);

    this.authService.loggedUserStream.subscribe((res) => {
      if (res?.roles.includes('APPROVERS')) {
        this.CasesService.setSystemTeams().subscribe((res) => {
          this.teams = res;
          this.teams = this.teams.filter((x: any) => x.name !== 'Fraud');
          this.handleTeam(this.caseData, this.teams);
        });

        this.CasesService.setSystemUsers().subscribe((res) => {
          this.users = res;
          this.users = this.users.filter(
            (x: any) =>
              x.userGroups[0]?.groupName !== 'Approvers' &&
              x.userGroups[0]?.groupName !== 'Admins'
          );
        });
      }
    });

    this.closeForm = this.formBuilder.group({
      close_mail_content: [''],
    });
    this.infoForm = this.formBuilder.group({
      assignedTo: [this.assigneeType[0], Validators.required],
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
    this.CasesService.getTaskByCaseId(id).subscribe((res: any) => {
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
        this.CasesService.uploadFile(formData).subscribe((res: any) => {
          if (res) {
            this.uploadedFile.push(res);
            this.isLoading = false;
            this.infoForm
              .get('check_case_attachment')
              ?.setValue(this.uploadedFile);
          }
        });
      }
    }
  }

  onDeleteFile(id: number) {
    this.CasesService.deleteFile(id).subscribe((res: any) => {
      this.uploadedFile = this.uploadedFile.filter((x: any) => x.id !== id);
      this.infoForm.get('check_case_attachment')?.setValue(this.uploadedFile);
    });
  }

  downloadFile(id: number, name: string) {
    this.CasesService.getFile(id).subscribe((buffer) => {
      const data: Blob = new Blob([buffer], {
        type: 'text/csv;charset=utf-8',
      });
      // you may improve this code to customize the name
      // of the export based on date or some other factors
      saveAs(data, name);
    });
  }
  /** function to call fetching all tasks again and close any Modal if found **/
  refreshTasks(taskId: number, data: any) {
    this.CasesService.updateCaseTask(+this.casseId, taskId, data).subscribe(
      (res: any) => {
        this.caseStatus = res.caseStatus;
        this.dialogService.close();
        this.getCaseTasks(+this.casseId);
      }
    );
  }

  /** Actions with check case info (Request More Info) status **/
  onCheck(taskId: number) {
    this.taskId = taskId;
    this.dialogService.open('request-Info-Modal');
  }

  sendInfo() {
    const idsArr = [];
    for (const obj of this.uploadedFile) {
      idsArr.push(obj.id);
    }

    const data = {
      form: {
        info_needed: 1,
        form_assignee: this.infoForm.get('selectedUser')?.value.email
          ? this.infoForm.get('selectedUser')?.value.email
          : this.infoForm.get('selectedUser')?.value.name,
        message: this.infoForm.get('message')?.value,
        // check_case_attachment: this.infoForm.get('check_case_attachment')?.value
        check_case_attachment: idsArr,
      },
    };

    this.refreshTasks(this.taskId, data);

    this.closeForm.reset();
    this.infoForm.reset();
    this.uploadedFile = [];

    this.rejectForm.reset();
    this.replyForm.reset();
    this.firstEscalateForm.reset();
    this.secondEscalateForm.reset();
  }

  cancelCheck(taskId: number) {
    const data = { form: { info_needed: 0 } };
    // this.CasesService
    //   .updateCaseTask(+this.casseId, data)
    //   .subscribe((res: any) => {
    //     this.getCaseTasks(+this.casseId);
    //   });

    this.refreshTasks(taskId, data);
  }

  /** Actions with Fill More Info status  **/
  // getAssigneeValue(value: string) {
  //   if (value === '2') {
  //     this.users = [{ name: 'Demo', value: 'demo' }];
  //   }
  // }
  confirmReply() {
    const idsArr = [];
    for (const obj of this.uploadedFile) {
      idsArr.push(obj.id);
    }

    const data = {
      form: {
        message: this.replyForm.get('message')?.value,
        reply_attachments: idsArr,
      },
    };


    this.closeForm.reset();
    this.infoForm.reset();
    this.uploadedFile = [];

    this.rejectForm.reset();
    this.replyForm.reset();
    this.firstEscalateForm.reset();
    this.secondEscalateForm.reset();
    this.refreshTasks(this.taskId, data);
  }
  replyfeed(taskId: number) {
    this.taskId = taskId;
    this.dialogService.open('replyFeeback-Modal');
  }

  /** Actions with Approve Casse status  **/

  confirm(taskId: number) {
    this.taskId = taskId;
    this.dialogService.open('approve-Modal');
  }

  approvedTask() {
    const data = { form: { case_approved: 1 } };
    this.refreshTasks(this.taskId, data);
  }
  /** Actions with Reject status **/
  reject(taskId: number) {
    this.taskId = taskId;
    this.dialogService.open('reject-Modal');
  }
  confirmReject() {
    const data = {
      form: {
        case_approved: 0,
        reject_note: this.rejectForm.get('reject_note')?.value,
      },
    };
    this.refreshTasks(this.taskId, data);
  }
  /** Actions with Within Response Casse status  **/

  withinResponse(taskId: number) {
    const data = { form: {} };
    this.refreshTasks(taskId, data);
  }
  /** Actions with Should First Escalate  Casse status  **/

  shouldFirstEscalate(taskId: number) {
    this.taskId = taskId;
    this.dialogService.open('first-escalate-Modal');
  }
  notFirstEscalate(taskId: number) {
    const data = { form: { should_first_escalate: 0 } };
    this.refreshTasks(taskId, data);
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
    this.refreshTasks(this.taskId, data);
  }
  /** Actions with Should Second Escalate  Casse status  **/

  shouldSecondEscalate(taskId: number) {
    this.taskId = taskId;
    this.dialogService.open('second-escalate-Modal');
  }
  notSecondEscalate(taskId: number) {
    const data = { form: { should_second_escalate: 0 } };
    this.refreshTasks(taskId, data);
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
    this.refreshTasks(this.taskId, data);
  }
  /** Actions with Send to Close  Casse status  **/

  sendToClose(taskId: number) {
    this.taskId = taskId;
    this.dialogService.open('close-Modal');
  }

  confirmClose() {
    const data = { form: this.closeForm.value };
    this.closeForm.reset();
    this.infoForm.reset();

    this.rejectForm.reset();
    this.replyForm.reset();
    this.firstEscalateForm.reset();
    this.secondEscalateForm.reset();
    this.refreshTasks(this.taskId, data);
  }

  subscribeToLanguage() {
    this.langSub = this.languageManagerService
      .getSavedLanguageAsStream()
      .subscribe((res) => {
        const outputTitle =
          this.languageManagerService.getSavedLanguage() === 'ar'
            ? `تفاصيل حالة رقم : ${this.caseSerial} `
            : `D2D Case ( ID: ${this.caseSerial} ) Details`;
        this.bannerDataService.updateData({
          title: outputTitle,
          text: '',
        });
      });
  }

  checkAssigne(item: any) {
    if (item?.isAssigneeTeam) {
      if (item?.assignedUser === this.authService.getLoggedInUser().teamName) {
        return true;
      }
    } else {
      if (item?.assignedUser === this.authService.getLoggedInUser().email) {
        return true;
      }
    }
    return false;
  }

  handleTeam(caseData?: Case, team?: any) {
    if (caseData && team) {

      this.selectedTeam = team.filter(
        (t: any) => t.name === this.caseData?.creatorTeamName
      )[0];
    }
  }
  ngOnDestroy(): void {
    this.langSub.unsubscribe();
  }
}
