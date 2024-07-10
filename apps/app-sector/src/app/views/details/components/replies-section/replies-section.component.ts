import {
  Component,
  effect,
  ElementRef,
  input,
  InputSignal,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { AuthService } from 'apps/app-sector/src/app/shared/services/auth.service';
import { CookieService } from 'ngx-cookie';
import { newComment } from '../../../models/newComment';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { ConfirmationDialogeComponent } from 'apps/app-sector/src/app/shared/confirmation-dialoge/confirmationDialoge.component';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { dialogeService } from 'apps/app-sector/src/app/shared/services/dialoge.service';
import { comment } from '../../models/commentsModel';

@Component({
  selector: 'stc-apps-replies-section',
  templateUrl: './replies-section.component.html',
  styleUrl: './replies-section.component.scss',
})
export class RepliesSectionComponent implements OnInit {
  // @Output() editComment = new EventEmitter<string>();
  @ViewChild('targetElement') textArea?: ElementRef;
  newComment: InputSignal<newComment> = input({} as newComment);
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
  editedText = signal('');
  mentions = [
    { name: 'Assem Khalifa Ahmed', comment: 'UI/UX Designer' },
    { name: 'Assem Ahmed', comment: 'Business Analyst' },
    { name: 'Assem Khalifa', comment: 'UI/UX Designer' },
    { name: 'Naden Draz', comment: 'UI/UX Designer' },
    { name: 'Habiba mohamed', comment: 'UI/UX Designer' },
    { name: 'Habiab Mohamed Nagiub', comment: 'UI/UX Designer' },
  ];
  mentionsArray: string[] = [];
  commentsList: comment[] = [
    {
      name: 'Assem Khalifa',
      mentions: ['@Naden Draz', '@Habiba mohamed'],
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
      mentions: ['@Habiab Mohamed Nagiub'],
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
  confirmationBtnDesc = 'Delete';
  constructor(
    private dialog: MatDialog,
    private datePipe: DatePipe,
    private fb: FormBuilder,
    private cookieService: CookieService,
    public router: Router,
    private authService: AuthService,
    private dialogeService: dialogeService
  ) {
    effect(() => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      console.log('in replies', this.newComment());
      if (this.newComment().name) {
        const newObj: comment = {
          name: 'Assem Khalifa',
          mentions: this.newComment().mentions,
          comment: this.newComment().name,
          time: 'Few Seconds ago',
          replies: [],
        };
        this.commentsList.unshift(newObj);
        this.commentsCount();
      }
      console.log('array', this.commentsList);
    });
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
  onContentChange(content: any): void {
    // console.log('onContentChange');
    // this.mentionsArray = this.extractMentions(this.form.value.comment);
    const mentionsArray = this.extractMentions(content);
    this.mentionsArray = mentionsArray;

    console.log('Form Value:', this.form.get('comment')?.value);
    console.log('Mentions:', this.mentionsArray);
    console.log('Content:', content);
    console.log('editedText:', this.editedText());
  }

  extractMentions(text: string): string[] {
    const mentions: string[] = this.mentions.map((mention: any) => {
      return `@${mention.name}`;
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
  confirm() {
    if (this.deleteCommentFlag) {
      this.deleteComment(this.commentIndex);
    } else if (this.deleteReplyFlag) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this.deleteReply(this.commentIndex, this.replyIndex!);
    }
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
    console.log('inside save');
    this.commentsList[this.commentIndex].replies?.unshift({
      name: this.loggedUser,
      comment: this.form.get('comment')?.value,
      time: 'Few Seconds Ago',
      mentions: this.mentionsArray,
    });
    console.log('new comments', this.commentsList);
    this.form.reset();
    this.editedText.set('');
    this.showCommentTextArea = false;
  }
  editCommentt() {
    const commentText = this.form.get('comment')?.value;
    this.commentsList[this.commentIndex].comment = commentText;
    this.commentsList[this.commentIndex].mentions = this.mentionsArray;
    console.log('new comments', this.commentsList);
    this.form.reset();
    this.editedText.set('');
    this.showCommentTextArea = false;
  }
  editReply() {
    this.commentsList[this.commentIndex].replies[this.replyIndex].comment =
      this.form.get('comment')?.value;
    console.log('new comments', this.commentsList);
    this.form.reset();
    this.editReplyTextArea = false;
  }
  scrollIntoView() {
    console.log(this.textArea?.nativeElement);
    if (this.textArea?.nativeElement) {
      console.log('scrolll 2');
      // window.scrollBy({ top: 300, behavior: 'smooth' });
      this.textArea.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'start',
      });
    }
  }
  handleCommentActions(e: string, commentIndex: number) {
    this.commentIndex = commentIndex;
    this.deleteReplyFlag = false;
    console.log(e, commentIndex);
    if (!this.showCommentTextArea) {
      if (e === 'Delete') {
        this.deleteCommentFlag = true;
        const dialogeDesc = 'Are you sure you want to delete this comment?';
        this.dialogeService.openDialog(
          '0ms',
          '0ms',
          dialogeDesc,
          this.confirmationBtnDesc,
          this.confirm.bind(this)
        );
        // this.openDialog('0ms', '0ms', commentIndex);
      } else if (e === 'Reply') {
        this.editedText.set('');
        this.showCommentTextArea = true;
        this.commentActionBtn = 'Save';
        setTimeout(() => {
          this.scrollIntoView();
        });
      } else if (e === 'Edit') {
        this.commentActionBtn = 'Update';
        setTimeout(() => {
          this.scrollIntoView();
        });
        this.showCommentTextArea = true;
        const comment = this.commentsList[commentIndex].comment;
        this.form.get('comment')?.setValue(comment);
        this.editedText.set(comment);
        this.mentionsArray = this.commentsList[commentIndex].mentions;
      }
    }
  }

  handleReplyActions(e: string, commentIndex: number, replyIndex: number) {
    this.commentIndex = commentIndex;
    this.replyIndex = replyIndex;
    this.deleteCommentFlag = false;
    if (!this.editReplyTextArea) {
      if (e === 'Delete') {
        this.deleteReplyFlag = true;
        const dialogeDesc = 'Are you sure you want to delete this reply?';
        this.dialogeService.openDialog(
          '0ms',
          '0ms',
          dialogeDesc,
          this.confirmationBtnDesc,
          this.confirm.bind(this)
        );
      } else if (e === 'Edit') {
        this.editReplyTextArea = true;
        const reply =
          this.commentsList[commentIndex].replies[replyIndex].comment;
        this.form.get('comment')?.setValue(reply);
        this.editedText.set(reply);
        setTimeout(() => {
          this.scrollIntoView();
        });
      }
    }
  }
}
