import { Component, EventEmitter, Output } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatDialogeComponent } from '../mat-dialoge/mat-dialoge.component';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'stc-apps-replies-section',
  templateUrl: './replies-section.component.html',
  styleUrl: './replies-section.component.scss',
})
export class RepliesSectionComponent {
  @Output() editComment = new EventEmitter<string>();
  totalComments = 0;
  deleteCommentFlag = false;
  deleteReplyFlag = false;
  commentsList = [
    {
      name: 'Assem Khalifa',
      comment: 'Test comment @Naden draz',
      time: 'Few Seconds ago',
      replies: [
        { name: 'Assem Ahmed', comment: 'Reply 1', time: 'Few Seconds ago' },
        {
          name: 'Mohamed Fawzy Ahmed',
          comment: 'Reply 2',
          time: 'Few Seconds ago',
        },
      ],
    },
    {
      name: 'Assem Ahmed',
      comment: 'Test Comment 2',
      time: 'Few Seconds ago',
    },
    {
      name: 'Mohamed Fawzy',
      comment: 'Test Comment 3',
      time: '48 Mins ago',
    },
  ];
  constructor(private dialog: MatDialog, private datePipe: DatePipe) {
    this.commentsCount();
  }
  commentsCount() {
    this.totalComments = 0;
    this.commentsList.map((comment) => {
      this.totalComments++;
      comment.replies?.map(() => this.totalComments++);
    });
  }
  deleteComment(commentIndex: number) {
    console.log(commentIndex);
    this.commentsList.splice(commentIndex, 1);
    this.commentsCount();
  }
  deleteReply(commentIndex: number, replyIndex: number) {
    this.commentsList[commentIndex].replies?.splice(replyIndex, 1);
    this.commentsCount();
  }
  openDialog(
    enterAnimationDuration: string,
    exitAnimationDuration: string,
    commentIndex: number,
    replyIndex?: number
  ): void {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    const dialogRef = this.dialog.open(MatDialogeComponent, {
      width: '450px',
      enterAnimationDuration,
      exitAnimationDuration,
    });
    dialogRef.afterClosed().subscribe((data) => {
      console.log('Dialog output:', data);
      if (data == 'confirmed') {
        if (this.deleteCommentFlag) {
          this.deleteComment(commentIndex);
        } else if (this.deleteReplyFlag) {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          this.deleteReply(commentIndex, replyIndex!);
        }
      }
    });
  }
  getTimeAgo(date: any) {
    const now: any = new Date();
    date = new Date(date);
    const timeDifference = now - date;
    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    //const days = Math.floor(hours / 24);
    if (seconds < 60) {
      return 'just now';
    } else if (minutes === 1) {
      return '1 minute ago';
    } else if (minutes < 60) {
      return minutes + ' minutes ago';
    } else if (hours === 1) {
      return '1 hour ago';
    } else if (hours < 24) {
      return hours + ' hours ago';
    } else {
      return (
        this.datePipe.transform(date, 'longDate') +
        ' at ' +
        this.datePipe.transform(date, 'shortTime')
      );
    }
  }
  handleCommentActions(e: string, commentIndex: number) {
    console.log(e);
    if (e === 'Delete') {
      this.deleteCommentFlag = true;
      this.openDialog('0ms', '0ms', commentIndex);
    } else if (e === 'Edit') {
      this.handlEditComment(commentIndex);
    }
  }
  handleReplyActions(e: string, commentIndex: number, replyIndex: number) {
    if (e === 'Delete') {
      this.deleteReplyFlag = true;
      this.openDialog('0ms', '0ms', commentIndex, replyIndex);
    } else if (e === 'Edit') {
      this.handleEditReply(commentIndex, replyIndex);
    }
  }

  handlEditComment(commentIndex: number) {
    const comment = this.commentsList[commentIndex].comment;
    this.editComment.emit(comment);
  }

  handleEditReply(commentIndex: number, replyIndex: number) {
    const reply = this.commentsList[commentIndex].replies![replyIndex].comment;
    this.editComment.emit(reply);
  }
}
