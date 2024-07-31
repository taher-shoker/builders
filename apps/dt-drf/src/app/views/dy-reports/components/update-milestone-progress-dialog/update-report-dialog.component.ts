/* eslint-disable @nx/enforce-module-boundaries */
/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  MilestoneAttachment,
  ReportDetails,
  ReportsService,
  RequestTask,
} from '../../dy-reports.service';

@Component({
  selector: 'stc-apps-update-report-dialog',
  templateUrl: './update-report-dialog.component.html',
  styleUrl: './update-report-dialog.component.scss',
})
export class UpdateReportDialogComponent {
  // remarksHint: string = 'You can add remarks optionally';
  // justificationHint: string = 'Please add justification';
  // evidenceHint: string = 'Please add Evidence';

  // hint = signal('');
  // milestoneName = signal('');

  // paramsName = signal('');
  // paramsValue = signal('');

  // dialogCaption: Signal<string> = computed(() => {
  //   let status;
  //   if (this.data.type === Actions.addEvidence.uniqueTitle) {
  //     status = 'status is completed !';
  //   } else if (this.data.type === Actions.addJustification.uniqueTitle) {
  //     status = 'status is delayed !';
  //   } else if (this.data.type === Actions.addOnTrack.uniqueTitle) {
  //     status = 'status is on track !';
  //   } else {
  //     return `Validation Confirmation | ${this.milestoneName()}`;
  //   }
  //   return `${this.milestoneName()} ${status}`;
  // });

  form!: FormGroup;
  showAttachment!: boolean;

  /**
   * isApproved true = comment optional - attachments are NOT allowed
   * isApproved false = comment required - attachments optional
   */

  // isRequired: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<UpdateReportDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      item: RequestTask;
      approvalState: 'approval' | 'rejection' | 'Add Data';
      report: ReportDetails;
    },
    private reportsService: ReportsService
  ) {
    this.initForm(data.approvalState);
    // this.milestoneName.set(data.milestoneName);
    // if (data.type === Actions.addEvidence.uniqueTitle) {
    //   this.requireFormControl();
    //   this.isRequired = true;
    // }
    // const hintPrefix = `You're about to`;
    // const returnHintAction = 'return';
    // const hintTail =
    //   "Kindly note you can't roll back this action, Are you sure?";

    // if (data.type === Actions.addEvidence.uniqueTitle) {
    //   this.hint.set(this.evidenceHint);
    // } else if (data.type === Actions.addJustification.uniqueTitle) {
    //   this.hint.set(this.justificationHint);
    // } else if (this.data.type === Actions.addOnTrack.uniqueTitle) {
    //   this.hint.set(this.remarksHint);
    // } else if (
    //   this.data.type === Actions.returnEvidence.uniqueTitle
    // ) {
    //   this.hint.set(
    //     `${hintPrefix} ${returnHintAction} ${this.milestoneName()}, ${hintTail} `
    //   );
    // }
  }

  isLoading = false;
  uploadedFile: any[] = [];
  attachmentsIDs: string[] = []; // should be like 1,2,5,22 (comma separated)

  acceptedExtensions = [
    'image/png',
    'image/jpeg',
    'image/jpg',
    'application/pdf',
    'text/csv',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel',
  ];

  initForm(approvalState: 'approval' | 'rejection' | 'Add Data') {
    if (approvalState === 'approval') {
      this.form = new FormGroup({
        comment: new FormControl(''),
      });
      this.showAttachment = false;
    } else if (approvalState === 'rejection') {
      this.form = new FormGroup({
        comment: new FormControl('', Validators.required),
        attachment: new FormControl(''),
      });
      this.showAttachment = true;
    } else {
      this.form = new FormGroup({
        comment: new FormControl('', Validators.required),
        attachment: new FormControl('', Validators.required),
      });
      this.showAttachment = true;
    }
  }

  onUploadFile(files: string | any[]) {
    this.isLoading = true;

    if (files) {
      const file = files[0];

      const formData = new FormData();
      formData.append('file', file);
      this.reportsService
        .uploadFile(formData, this.data.report.id)
        .subscribe((res: MilestoneAttachment) => {
          this.uploadedFile.push(res);
          this.isLoading = false;
          this.form.get('attachment')?.setValue(this.uploadedFile);

          this.attachmentsIDs.push(res.id.toString());
          // if(this.attachmentsCombinedString.length > 0){
          //   this.attachmentsCombinedString = res.id.toString();
          // }else{
          //   this.attachmentsCombinedString += `,${res.id}`
          // }
        });
    }
  }

  onDeleteFile(id: number) {
    this.uploadedFile = this.uploadedFile.filter((x: any) => x.id !== id);
    this.attachmentsIDs = this.attachmentsIDs.filter(
      (x: any) => x !== id.toString()
    );
    this.form.get('attachment')?.setValue(this.uploadedFile);
  }

  downloadFile(id: number, name: string) {
    this.reportsService.getFile(id).subscribe((buffer: any) => {
      const data: Blob = new Blob([buffer], {
        type: 'text/csv;charset=utf-8',
      });
      // you may improve this code to customize the name
      // of the export based on date or some other factors
      // saveAs(data, name);
    });
  }

  requireFormControl() {
    this.form.get('attachment')?.setValidators(Validators.required);
    this.form.get('attachment')?.updateValueAndValidity();
  }

  update() {
    const attachmentsIDsToString = this.attachmentsIDs.join('@#%@#%Z%#@%#@'); // !separator changed to fix the split of any note or rejection
    this.dialogRef.close({
      comment: this.form.get('comment')?.value,
      attachments: attachmentsIDsToString,
    });
  }

  cancel() {
    this.dialogRef.close(undefined);
  }
}
