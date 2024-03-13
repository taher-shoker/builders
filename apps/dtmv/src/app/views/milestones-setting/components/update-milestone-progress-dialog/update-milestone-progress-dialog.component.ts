/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Component, Inject, Signal, computed, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Actions, MilestonesService } from '../../milestones.service';
import * as saveAs from 'file-saver';

@Component({
  selector: 'stc-apps-update-milestone-progress-dialog',
  templateUrl: './update-milestone-progress-dialog.component.html',
  styleUrl: './update-milestone-progress-dialog.component.scss',
})
export class UpdateMilestoneProgressDialogComponent {
  remarksHint: string = 'You can add remarks optionally';
  justificationHint: string = 'Please add justification';
  evidenceHint: string = 'Please add Evidence';

  hint = signal('');
  milestoneName = signal('');

  paramsName = signal('');
  paramsValue = signal('');


  dialogCaption: Signal<string> = computed(() => {
    let status;
    if (this.data.type === Actions.addEvidence) {
      status = 'status is completed !';
    } else if (this.data.type === Actions.addJustification) {
      status = 'status is delayed !';
    } else if (this.data.type === Actions.addOnTrack) {
      status = 'status is on track !';
    } else {
      return `Validation Confirmation | ${this.milestoneName()}`;
    }
    return `${this.milestoneName()} ${status}`;
  });

  form: FormGroup = new FormGroup({
    note: new FormControl('', Validators.required),
    attachment: new FormControl('', Validators.required),
  });

  constructor(
    public dialogRef: MatDialogRef<UpdateMilestoneProgressDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { type: Actions; milestoneName: string , milestoneId: number | string},
    private milestonesService: MilestonesService
  ) {
    this.milestoneName.set(data.milestoneName);
    const hintPrefix = `You're about to`;
    const evidenceHintAction = 'approve evidence';
    const justificationHintAction = 'approve justification';
    const trackHintAction = 'approve remarks';
    const returnHintAction = 'return';
    const hintTail =
      "Kindly note you can't roll back this action, Are you sure?";

    if (data.type === Actions.addEvidence) {
      this.hint.set(this.evidenceHint);
    } else if (data.type === Actions.addJustification) {
      this.hint.set(this.justificationHint);
    } else if (this.data.type === Actions.addOnTrack) {
      this.hint.set(this.remarksHint);
    } 
    
    // else if (this.data.type === Actions.reviewEvidence) {
    //   this.hint.set(
    //     `${hintPrefix} ${evidenceHintAction} ${this.milestoneName()}, ${hintTail} `
    //   );
    // } else if (this.data.type === Actions.reviewJustification) {
    //   this.hint.set(
    //     `${hintPrefix} ${justificationHintAction} ${this.milestoneName()}, ${hintTail} `
    //   );
    // } else if (this.data.type === Actions.reviewOnTrack) {
    //   this.hint.set(
    //     `${hintPrefix} ${trackHintAction} ${this.milestoneName()}, ${hintTail} `
    //   );
    // } 
    
    else if (this.data.type === Actions.return) {
      this.hint.set(
        `${hintPrefix} ${returnHintAction} ${this.milestoneName()}, ${hintTail} `
      );
    }
  }

  isLoading = false;
  uploadedFile: any[] = []; // turn to File later
  onUploadFiles(files: string | any[]) {
    if (files) {
      for (let i = 0; i < files?.length; i++) {
        this.isLoading = true;
        const formData = new FormData();
        formData.append('file', files[i]);
        // this.formData.append('file', files[i]);
        //postEvidenceOrJustification
        this.milestonesService.uploadFile(formData, this.data.milestoneId).subscribe((res: any) => {
          if (res) {
            this.uploadedFile.push(res);
            this.isLoading = false;
            this.form.get('attachment')?.setValue(this.uploadedFile);
          }
        });
      }
    }
  }


  attachmentsCombinedString: string = ""; // should be like 1,2,5,22 (comma separated)

  onUploadFile(files: string | any[]) {
    this.isLoading = true;

    if (files) {
      const file = files[0];

      const formData = new FormData();
      formData.append('file', file);
      this.milestonesService.uploadFile(formData, this.data.milestoneId).subscribe((res: number) => {
        this.uploadedFile.push(res);
        this.isLoading = false;
        this.form.get('attachment')?.setValue(this.uploadedFile);

        if(!this.attachmentsCombinedString){
          this.attachmentsCombinedString = res.toString();
        }else{
          this.attachmentsCombinedString += `,${res}`
        }
      })


      // for (let i = 0; i < files?.length; i++) {
      //   this.isLoading = true;
      //   const formData = new FormData();
      //   formData.append('file', files[i]);
      //   // this.formData.append('file', files[i]);
      //   //postEvidenceOrJustification
      //   this.milestonesService.uploadFile(formData, this.data.milestoneId).subscribe((res: any) => {
      //     if (res) {
      //       this.uploadedFile.push(res);
      //       this.isLoading = false;
      //       this.form.get('attachment')?.setValue(this.uploadedFile);
      //     }
      //   });
      // }
    }
  }

  onDeleteFile(id: number) {
    this.milestonesService.deleteFile(id).subscribe((res: any) => {
      this.uploadedFile = this.uploadedFile.filter((x: any) => x.id !== id);
      this.form.get('attachment')?.setValue(this.uploadedFile);
    });
  }

  downloadFile(id: number, name: string) {
    this.milestonesService.getFile(id).subscribe((buffer) => {
      const data: Blob = new Blob([buffer], {
        type: 'text/csv;charset=utf-8',
      });
      // you may improve this code to customize the name
      // of the export based on date or some other factors
      saveAs(data, name);
    });
  }

  update() {
    this.dialogRef.close({
      note: this.form.get('note')?.value,
      attachments: this.attachmentsCombinedString,
    });
  }

  cancel() {
    this.dialogRef.close(undefined);
  }
}
