import { DatePipe } from '@angular/common';
import {
  Component,
  EventEmitter,
  InputSignal,
  Output,
  effect,
  input,
} from '@angular/core';

@Component({
  selector: 'stc-apps-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  replyClass = false;
  name: InputSignal<string> = input('');
  comment: InputSignal<string> = input('');
  time: InputSignal<string> = input('');
  lastItem: InputSignal<boolean> = input(false);
  reply: InputSignal<boolean> = input(false);
  parentLoop: InputSignal<number> = input(0);
  hasReplies: InputSignal<boolean> = input(false);
  @Output() commentActionName = new EventEmitter<string>();
  @Output() replyActionName = new EventEmitter<string>();
  actionsList = [''];
  constructor(private datePipe: DatePipe) {
    effect(() => {
      console.log(this.reply(), this.comment(), this.hasReplies());
      if (this.reply() == true) {
        this.replyClass = true;
        this.actionsList = ['Edit', 'Delete'];
      } else {
        this.actionsList = ['Reply', 'Edit', 'Delete'];
        this.replyClass = false;
      }
    });
  }
  // openDialog(
  //   enterAnimationDuration: string,
  //   exitAnimationDuration: string
  // ): void {
  //   const dialogConfig = new MatDialogConfig();

  //   dialogConfig.disableClose = true;
  //   dialogConfig.autoFocus = true;
  //   const dialogRef = this.dialog.open(MatDialogeComponent, {
  //     width: '450px',
  //     enterAnimationDuration,
  //     exitAnimationDuration,
  //   });
  //   dialogRef.afterClosed().subscribe((data) => {
  //     console.log('Dialog output:', data);
  //     if (data === 'confirmed' && !this.reply()) {
  //       this.deleteComment.emit('deleteComment');
  //     } else if (data === 'confirmed' && this.reply()) {
  //       this.deletereply.emit('deleteComment');
  //     }
  //   });
  // }
  actionsClick(actionName: string) {
    if (this.reply()) {
      this.replyActionName.emit(actionName);
    } else {
      this.commentActionName.emit(actionName);
    }
    // if (actionName == 'Delete') {
    //   this.openDialog('0ms', '0ms');
    // }
  }


}
