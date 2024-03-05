/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Component, Inject, Signal, computed, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Actions } from '../../milestones.service';

@Component({
  selector: 'stc-apps-update-milestone-progress-dialog',
  templateUrl: './update-milestone-progress-dialog.component.html',
  styleUrl: './update-milestone-progress-dialog.component.scss',
})
export class UpdateMilestoneProgressDialogComponent {

  // remarksCaption: string = 'You can add remarks optionally';
  // justificationCaption: string = 'Please add justification';
  // evidenceCaption: string = 'Please add Evidence';

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
    @Inject(MAT_DIALOG_DATA) public data: { type: Actions, milestoneName: string }
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
