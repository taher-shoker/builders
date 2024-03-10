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

  dialogCaption: Signal<string> = computed(() => {
    let status;
    if(this.data.type === Actions.addEvidence){
      status = 'status is completed !'
    }else if (this.data.type === Actions.addJustification) {
      status = 'status is delayed !'
    }else{
      status = 'status is on track !'
    }
    return `${this.milestoneName()} ${status}`
  });


  form: FormGroup = new FormGroup({
    note: new FormControl('', Validators.required),
    attachment: new FormControl('', Validators.required),
  });

  constructor(
    public dialogRef: MatDialogRef<UpdateMilestoneProgressDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { type: Actions, milestoneName: string },
    private milestonesService: MilestonesService
  ) {

    this.milestoneName.set(data.milestoneName)

    if (data.type === Actions.addEvidence) {
      this.hint.set(this.evidenceHint);
    } else if (data.type === Actions.addJustification) {
      this.hint.set(this.justificationHint);
    } else {
      this.hint.set(this.remarksHint);
    }
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
        //postEvidenceOrJustification
        this.milestonesService.uploadFile(formData).subscribe((res: any) => {
          if (res) {
            this.uploadedFile.push(res);
            this.isLoading = false;
            this.form
              .get('attachment')
              ?.setValue(this.uploadedFile);
          }
        });
      }
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
      attachment: this.form.get('attachment')?.value,
    });
  }

  cancel() {
    this.dialogRef.close(undefined);
  }
}
