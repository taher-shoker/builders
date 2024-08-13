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
import { MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { CookieService } from 'ngx-cookie';
import { newComment } from '../../../models/newComment';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { dialogeService } from 'apps/app-sector/src/app/shared/services/dialoge.service';
import {
  addreplyBody,
  comment,
  commentEditBody,
  myComment,
  reply,
} from '../../models/commentsModel';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { AuthService } from 'apps/app-sector/src/app/services/auth.service';
import { commentsService } from '../../services/comments.service';

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
  comments: comment[] = [];
  commentsList: myComment[] = [
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
          mentions: [],
        },
        {
          name: 'Mohamed Fawzy Ahmed',
          comment: 'Reply 2',
          time: 'Few Seconds ago',
          mentions: [],
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
    private fb: FormBuilder,
    private cookieService: CookieService,
    public router: Router,
    private authService: AuthService,
    private dialogeService: dialogeService,
    private commentService: commentsService
  ) {
    effect(() => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      console.log('in replies', this.newComment());
      if (this.newComment().name) {
        const newObj: myComment = {
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

    this.commentService.commenstList.subscribe((result: comment[]) => {
      if (result[0] && result[0].comment) {
        console.log('replies section', result);
        this.comments = result;
        this.commentsCount();
      } else {
        this.comments = [];
        this.commentsCount();
      }
    });
  }

  handleForm() {
    this.form = this.fb.group({
      comment: this.fb.control('', [Validators.required]),
    });
  }
  onContentChange(content: any): void {
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
    if (this.comments) {
      this.comments.map((comment) => {
        this.totalComments++;
        comment.replies?.map(() => this.totalComments++);
      });
    }
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
  confirm() {
    if (this.deleteCommentFlag) {
      this.deleteComment(this.commentIndex);
    } else if (this.deleteReplyFlag) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this.deleteReply(this.commentIndex, this.replyIndex!);
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
        const comment = this.comments[commentIndex].comment;
        this.form.get('comment')?.setValue(comment);
        this.editedText.set(comment);
        this.mentionsArray = this.commentsList[commentIndex].mentions;
      }
    }
  }

  deleteComment(commentIndex: number) {
    console.log(commentIndex);
    this.commentService
      .deleteComment(this.comments[commentIndex].id)
      .subscribe(() => {
        this.comments.splice(commentIndex, 1);
        this.commentsCount();
      });
  }
  editCommentt() {
    const commentObj: commentEditBody = {
      id: this.comments[this.commentIndex].id,
      comment: this.form.get('comment')?.value,
    };
    this.commentService.editComment(commentObj).subscribe((result: comment) => {
      this.comments[this.commentIndex].comment = result.comment;
      this.comments[this.commentIndex].edited = result.edited;
      this.comments[this.commentIndex].editedAt = result.editedAt;
      this.form.reset();
      this.editedText.set('');
      this.showCommentTextArea = false;
    });
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

  saveReply() {
    console.log('inside save');
    const replyObj: addreplyBody = {
      commentId: this.comments[this.commentIndex].id,
      reply: this.form.get('comment')?.value,
    };
    this.commentService.addReply(replyObj).subscribe((result: reply) => {
      if (result) {
        this.comments[this.commentIndex].replies?.unshift(result);
        this.commentsCount();
        console.log('new comments', this.comments);
        this.form.reset();
        this.editedText.set('');
        this.showCommentTextArea = false;
      }
    });
  }
  deleteReply(commentIndex: number, replyIndex: number) {
    this.commentService
      .deleteReply(this.comments[commentIndex].replies[replyIndex].id)
      .subscribe(() => {
        this.comments[commentIndex].replies?.splice(replyIndex, 1);
        this.commentsCount();
      });
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
}
