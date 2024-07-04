import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatDialogeComponent } from '../mat-dialoge/mat-dialoge.component';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { AuthService } from 'apps/app-sector/src/app/shared/services/auth.service';
import { CookieService } from 'ngx-cookie';

@Component({
  selector: 'stc-apps-replies-section',
  templateUrl: './replies-section.component.html',
  styleUrl: './replies-section.component.scss',
})
export class RepliesSectionComponent implements OnInit {
  // @Output() editComment = new EventEmitter<string>();
  totalComments = 0;
  deleteCommentFlag = false;
  deleteReplyFlag = false;
  placeholder = 'Enter Reply Here...';
  form: FormGroup = new FormGroup({});
  showCommentTextArea = false;
  editReplyTextArea = false;
  commentActionBtn = '';
  commentIndex = 0;
  replyIndex = 0;
  loggedUser = '';
  editedText = '';
  mentions = [
    { name: 'Assem Khalifa Ahmed', comment: 'UI/UX Designer' },
    { name: 'Assem Ahmed', comment: 'Business Analyst' },
    { name: 'Assem Khalifa', comment: 'UI/UX Designer' },
  ];
  mentionsArray: string[] = [];
  commentsList = [
    {
      name: 'Assem Khalifa',
      mentions: ['Naden Draz', 'Habiba mohamed'],
      comment: 'Test comment @Naden Draz test @Habiba mohamed',
      time: 'Few Seconds ago',
      replies: [
        {
          name: 'Assem Ahmed',
          comment: 'Reply 1',
          time: 'Few Seconds ago',
          mentions: [''],
        },
        {
          name: 'Mohamed Fawzy Ahmed',
          comment: 'Reply 2',
          time: 'Few Seconds ago',
          mentions: [''],
        },
      ],
    },
    {
      name: 'Assem Ahmed',
      mentions: ['Habiab Mohamed Nagiub'],
      comment: 'Test Comment 2 @Habiab Mohamed Nagiub',
      time: 'Few Seconds ago',
      replies: [],
    },
    {
      name: 'Mohamed Fawzy',
      mentions: [],
      comment: 'Test Comment 3',
      time: '48 Mins ago',
      replies: [],
    },
  ];
  constructor(
    private dialog: MatDialog,
    private datePipe: DatePipe,
    private fb: FormBuilder,
    private cookieService: CookieService,
    public router: Router,
    private authService: AuthService
  ) {
    this.handleForm();
    this.commentsCount();
  }
  ngOnInit(): void {
    if (
      this.cookieService.get('MODERN_SYSTEM_USER') &&
      this.cookieService.get('token')
    ) {
      this.loggedUser = this.cookieService.get('USER_FULLNAME') || '';
      this.authService.getUserData();
      this.authService.loggedUserStream.subscribe((res) => {
        this.loggedUser = res?.name || '';
      });
    } else {
      this.loggedUser = 'Assem Khalifa';
    }
  }
  handleForm() {
    this.form = this.fb.group({
      comment: this.fb.control('', [Validators.required]),
    });
  }
  onContentChange(content: string) {
    console.log('habiba');
    this.mentionsArray = this.extractMentions(content);

    console.log('form', this.form.get('comment')?.value);
    console.log('Mentions:', this.mentionsArray);
    console.log('Content:', content);
  }
  extractMentions(text: string): string[] {
    const mentionPattern = /@(\w+)/g;
    const mentions: string[] = [];
    let match;
    while ((match = mentionPattern.exec(text)) !== null) {
      mentions.push(match[1]);
    }
    return mentions;
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
  cancel() {
    this.showCommentTextArea = false;
    this.form.reset();
  }
  cancelReply() {
    this.editReplyTextArea = false;
    this.form.reset();
  }
  save() {
    console.log(this.commentActionBtn);
    if (this.commentActionBtn === 'Save') {
      this.saveReply();
    } else {
      this.editCommentt();
    }
  }
  saveReply() {
    this.commentsList[this.commentIndex].replies?.unshift({
      name: this.loggedUser,
      comment: this.form.get('comment')?.value,
      time: 'Few Seconds Ago',
      mentions: this.mentionsArray,
    });
    console.log('new comments', this.commentsList);
    this.form.reset();
    this.editedText = '';
    this.showCommentTextArea = false;
  }
  editCommentt() {
    this.commentsList[this.commentIndex].comment =
      this.form.get('comment')?.value;
    this.commentsList[this.commentIndex].mentions = this.mentionsArray;
    console.log('new comments', this.commentsList);
    this.form.reset();
    this.editedText = '';
    this.showCommentTextArea = false;
  }
  editReply() {
    this.commentsList[this.commentIndex].replies[this.replyIndex].comment =
      this.form.get('comment')?.value;
    this.commentsList[this.commentIndex].replies[this.replyIndex].mentions =
      this.mentionsArray;
    console.log('new comments', this.commentsList);
    this.form.reset();
    this.editReplyTextArea = false;
  }
  handleCommentActions(e: string, commentIndex: number) {
    this.commentIndex = commentIndex;
    console.log(e, commentIndex);
    if (e === 'Delete') {
      this.deleteCommentFlag = true;
      this.openDialog('0ms', '0ms', commentIndex);
    } else if (e === 'Reply') {
      this.editedText = '';
      this.showCommentTextArea = true;
      this.commentActionBtn = 'Save';
    } else if (e === 'Edit') {
      this.commentActionBtn = 'Update';
      this.showCommentTextArea = true;
      this.form
        .get('comment')
        ?.setValue(this.commentsList[commentIndex].comment);
      this.editedText = this.commentsList[commentIndex].comment;
      console.log(this.form.get('comment')?.value);
    }
    //  else if (e === 'Edit') {
    //   this.handlEditComment(commentIndex);
    // }
  }
  handleReplyActions(e: string, commentIndex: number, replyIndex: number) {
    this.commentIndex = commentIndex;
    this.replyIndex = replyIndex;
    if (e === 'Delete') {
      this.deleteReplyFlag = true;
      this.openDialog('0ms', '0ms', commentIndex, replyIndex);
    }
    if (e === 'Edit') {
      this.editReplyTextArea = true;
      this.form
        .get('comment')
        ?.setValue(this.commentsList[commentIndex].replies[replyIndex].comment);
      this.editedText =
        this.commentsList[commentIndex].replies[replyIndex].comment;
    }
    // else if (e === 'Edit') {
    //   this.handleEditReply(commentIndex, replyIndex);
    // }
  }

  // handlEditComment(commentIndex: number) {
  //   const comment = this.commentsList[commentIndex].comment;
  //   this.editComment.emit(comment);
  // }

  // handleEditReply(commentIndex: number, replyIndex: number) {
  //   const reply = this.commentsList[commentIndex].replies![replyIndex].comment;
  //   this.editComment.emit(reply);
  // }
}
