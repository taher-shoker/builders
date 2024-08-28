import {
  Component,
  effect,
  ElementRef,
  EventEmitter,
  input,
  InputSignal,
  OnInit,
  Output,
  signal,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { CookieService } from 'ngx-cookie';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { dialogeService } from 'apps/app-sector/src/app/shared/services/dialoge.service';
import {
  addreplyBody,
  comment,
  commentEditBody,
  reply,
  replyEditBody,
  user,
} from '../../models/commentsModel';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { AuthService } from 'apps/app-sector/src/app/services/auth.service';
import { commentsService } from '../../services/comments.service';
import { ToastrService } from 'ngx-toastr';
import { NotificationsService } from '../../services/notifications.service';

@Component({
  selector: 'stc-apps-replies-section',
  templateUrl: './replies-section.component.html',
  styleUrl: './replies-section.component.scss',
})
export class RepliesSectionComponent implements OnInit {
  @Output() textAreaOpend = new EventEmitter<string>();
  @ViewChild('targetElement') textArea?: ElementRef;
  newComment: InputSignal<comment> = input({} as comment);
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
  loggedUserID = 0;
  editedText = signal('');
  mentions: user[] = [];
  mentionsArray: string[] = [];
  comments: comment[] = [];
  confirmationBtnDesc = 'Delete';
  // mentions2 = [
  //   {
  //     id: 532,
  //     name: 'Habiba Mohamed',
  //     email: 'habiba.mohamed@qeema.net',
  //     jobTitle: 'Has two roles User Chief, GCEO',
  //   },
  //   {
  //     id: 552,
  //     name: 'Sara',
  //     email: 'sara.alkurdy@qeema.net',
  //     jobTitle: 'Professional Football Player',
  //   },
  //   {
  //     id: 519,
  //     name: 'Habiba Mohamed',
  //     email: 'habiba12.mohamed@qeema.net',
  //     jobTitle: 'Has two roles User Chief',
  //   },
  //   {
  //     id: 614,
  //     name: 'Noha Yousry',
  //     email: 'noha.yousry@qeema.net',
  //     jobTitle: 'Football Manager',
  //   },
  // ];
  constructor(
    private fb: FormBuilder,
    private cookieService: CookieService,
    public router: Router,
    private authService: AuthService,
    private dialogeService: dialogeService,
    private commentService: commentsService,
    private toastr: ToastrService,
    private commentsService: commentsService,
    private notificatinService: NotificationsService
  ) {
    effect(() => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      if (this.newComment().comment) {
        this.cancel();
        this.cancelReply();

        if (this.newComment().replies == null) {
          this.newComment().replies = [];
        }
        this.comments.unshift(this.newComment());

        this.commentsCount();
      }
    });
    this.handleForm();
  }
  ngOnInit(): void {
    //this.getSectorUsers();
    if (
      this.cookieService.get('MODERN_SYSTEM_USER') &&
      this.cookieService.get('token')
    ) {
      this.authService.getUserData();
      this.authService.loggedUserStream.subscribe((res) => {
        this.loggedUserID = res?.id || 0;
      });
    }
    this.commentService.commenstList.subscribe((result: comment[]) => {
      if (result[0] && result[0].comment) {
        this.comments = result;
        this.commentsCount();
      } else {
        this.comments = [];
        this.commentsCount();
      }
    });
    this.notificatinService.mentionsList.subscribe((result: user[]) => {
      if (result) {
        this.mentions = result;
        console.log(this.mentions,'this.mentions');
        
      } else {
        this.mentions = [];
      }
    });
  }
  handleForm() {
    this.form = this.fb.group({
      comment: this.fb.control('', [Validators.required]),
    });
  }
  mentionObjectChanged(object: user) {
    // console.log(object, 'in replies');
  }
  findAllIndexes(str: string, searchTerm: string): number[] {
    const indexes: number[] = [];
    let startIndex = 0;

    while ((startIndex = str.indexOf(searchTerm, startIndex)) > -1) {
      indexes.push(startIndex);
      startIndex += searchTerm.length; // Move past the last found index
    }

    return indexes;
  }
  //eslint-disable-next-line @typescript-eslint/no-explicit-any

  onContentChange(content: any): void {
    console.log('content', content);
    const mentionsArray = this.extractMentions(content);
    this.mentionsArray = mentionsArray;
    if (mentionsArray?.length == 0) {
      this.notificatinService.mentionsObjects = [];
    }
  }
  deleteMention(event: number[]) {
    console.log('deleteMention', event);
    const ids = event.map((str) => Number(str));
    this.notificatinService.mentionsObjects =
      this.notificatinService.mentionsObjects.filter((obj) =>
        ids.includes(obj.id)
      );
  }

  extractMentions(text: string): string[] {
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mentions: string[] = this.mentions.map((mention: user) => {
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
    if (this.textArea?.nativeElement) {
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
    this.notificatinService.mentionsObjects = [];
    this.showCommentTextArea = false;

    this.form.reset();
  }
  cancelReply() {
    this.notificatinService.mentionsObjects = [];
    this.editReplyTextArea = false;
    this.form.reset();
  }
  save() {
    if (this.commentActionBtn === 'Save') {
      this.saveReply();
    } else {
      this.editCommentt();
    }
  }
  refactoringCommaSepartedMention(commaSepartedMentions: string): any[] {
    let mentionsSeparted: any = commaSepartedMentions?.split(',');
    console.log('mentions separted', mentionsSeparted);

    mentionsSeparted = mentionsSeparted?.map((mention: any) => {
      const pipeSeparted = mention.split('|');
      const mentionObj: user = {
        id: +pipeSeparted[0],
        name: pipeSeparted[1],
        email: pipeSeparted[2],
        jobTitle: pipeSeparted[3],
      };
      return mentionObj;
    });
    return mentionsSeparted;
  }
  section = '';
  handleCommentActions(e: string, commentIndex: number) {
    this.section = 'reply';
    this.commentIndex = commentIndex;
    this.deleteReplyFlag = false;
    this.editReplyTextArea = false;

    if (e == 'Delete') {
      this.deleteCommentFlag = true;
      const dialogeDesc = 'Are you sure you want to delete this comment?';
      this.dialogeService.openDialog(
        '0ms',
        '0ms',
        dialogeDesc,
        this.confirmationBtnDesc,
        this.confirm.bind(this)
      );
    } else if (e == 'Reply') {
      this.notificatinService.mentionsObjects = [];

      //  this.editedText.set('');
      this.form.reset();
      this.showCommentTextArea = true;
      this.textAreaOpend.emit('opened');
      this.commentActionBtn = 'Save';
      setTimeout(() => {
        this.scrollIntoView();
      });
    } else if (e == 'Edit') {
      this.notificatinService.mentionsObjects = [];
      if (
        this.comments[commentIndex].commaSeparatedMentions !== '' &&
        this.comments[commentIndex].commaSeparatedMentions?.includes('|')
      ) {
        this.notificatinService.mentionsObjects =
          this.refactoringCommaSepartedMention(
            this.comments[commentIndex].commaSeparatedMentions!
          );
      }

      this.showCommentTextArea = true;
      this.textAreaOpend.emit('opend');
      const comment = this.comments[commentIndex].comment;
      this.editedText.set(comment);
      this.form.get('comment')?.setValue(comment);

      this.commentActionBtn = 'Update';
      setTimeout(() => {
        this.scrollIntoView();
      });
    }
  }

  deleteComment(commentIndex: number) {
    this.commentService
      .deleteComment(this.comments[commentIndex].id)
      .subscribe({
        next: () => {
          this.toastr.success('Comment Deleted Successfully');
          this.comments.splice(commentIndex, 1);
          this.commentsCount();
          this.cancel();
        },
        error: () => {
          this.toastr.error('Error occured while deleting comment');
          this.cancel();
        },
      });
  }
  editCommentt() {
    console.log('final mentions ', this.notificatinService.mentionsObjects);
    const commentObj: commentEditBody = {
      id: this.comments[this.commentIndex].id,
      comment: this.form.get('comment')?.value,
      commaSeparatedMentions: this.notificatinService.mentionsObjects
        ? this.notificatinService.commaSepartedMentions(
            this.notificatinService.mentionsObjects
          )
        : null,
    };

    this.commentService.editComment(commentObj).subscribe({
      next: (result: comment) => {
        this.toastr.success('Comment Edited Successfully');
        this.comments[this.commentIndex].comment = result.comment;
        this.comments[this.commentIndex].edited = result.edited;
        this.comments[this.commentIndex].editedAt = result.editedAt;
        this.comments[this.commentIndex].commaSeparatedMentions =
          result.commaSeparatedMentions;
        this.form.reset();
        if (this.notificatinService.mentionsObjects?.length !== 0) {
          this.notificatinService.notificationsSenderEngine(
            result.comment,
            this.notificatinService.mentionsObjects,
            result.id
          );
        }
        this.editedText.set('');
        this.showCommentTextArea = false;
      },
      error: () => {
        this.toastr.error('error occured');
        this.form.reset();
        this.editedText.set('');
        this.showCommentTextArea = false;
      },
    });
  }

  handleReplyActions(e: string, commentIndex: number, replyIndex: number) {
    this.section = 'reply';
    this.showCommentTextArea = false;
    this.commentIndex = commentIndex;
    this.replyIndex = replyIndex;
    this.deleteCommentFlag = false;
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
      this.notificatinService.mentionsObjects = [];
      if (
        this.comments[commentIndex].replies[replyIndex]
          .commaSeparatedMentions !== '' &&
        this.comments[commentIndex].replies[
          replyIndex
        ].commaSeparatedMentions?.includes('|')
      ) {
        this.notificatinService.mentionsObjects =
          this.refactoringCommaSepartedMention(
            this.comments[commentIndex].replies[replyIndex]
              .commaSeparatedMentions!
          );
      }

      this.editReplyTextArea = true;
      this.textAreaOpend.emit('opend');
      const reply = this.comments[commentIndex].replies[replyIndex].reply;
      this.form.get('comment')?.setValue(reply);
      this.editedText.set(reply);
      setTimeout(() => {
        this.scrollIntoView();
      });
    }
  }

  saveReply() {
    this.notificatinService.mentionsObjects =
      this.notificatinService.mentionsObjects.filter(
        (item, index, self) => self.indexOf(item) === index
      );
    console.log('final mentions ', this.notificatinService.mentionsObjects);
    console.log('inside save');
    const replyObj: addreplyBody = {
      commentId: this.comments[this.commentIndex].id,
      reply: this.form.get('comment')?.value,
      commaSeparatedMentions: this.notificatinService.mentionsObjects
        ? this.notificatinService.commaSepartedMentions(
            this.notificatinService.mentionsObjects
          )
        : null,
    };
    this.commentService.addReply(replyObj).subscribe({
      next: (result: reply) => {
        if (result) {
          this.toastr.success('Reply Added Successfully');
          this.comments[this.commentIndex].replies?.unshift(result);
          this.commentsCount();
          console.log('new comments', this.comments);
          this.form.reset();
          this.editedText.set('');
          this.showCommentTextArea = false;
          if (this.notificatinService.mentionsObjects?.length !== 0) {
            this.notificatinService.notificationsSenderEngine(
              result.reply,
              this.notificatinService.mentionsObjects,
              this.comments[this.commentIndex].id
            );
          }
        }
      },
      error: () => {
        this.toastr.error('Reply Addtion Failed');
        this.form.reset();
        this.editedText.set('');
        this.showCommentTextArea = false;
      },
    });
  }
  deleteReply(commentIndex: number, replyIndex: number) {
    this.commentService
      .deleteReply(this.comments[commentIndex].replies[replyIndex].id)
      .subscribe({
        next: () => {
          this.toastr.success('Reply Deleted Successfully');
          this.comments[commentIndex].replies?.splice(replyIndex, 1);
          this.commentsCount();
          this.cancelReply();
        },
        error: () => {
          this.toastr.success('Error occured while deleting reply');
          this.cancelReply();
        },
      });
  }
  editReply() {
    const replyObj: replyEditBody = {
      id: this.comments[this.commentIndex].replies[this.replyIndex].id,
      reply: this.form.get('comment')?.value,
      commaSeparatedMentions: this.notificatinService.mentionsObjects
        ? this.notificatinService.commaSepartedMentions(
            this.notificatinService.mentionsObjects
          )
        : null,
    };
    this.commentService.editReply(replyObj).subscribe({
      next: (result: reply) => {
        this.toastr.success('Reply Edited Successfully');
        this.comments[this.commentIndex].replies[this.replyIndex].reply =
          result.reply;
        this.comments[this.commentIndex].replies[this.replyIndex].edited =
          result.edited;
        this.comments[this.commentIndex].replies[this.replyIndex].editedAt =
          result.editedAt;
        this.comments[this.commentIndex].replies[
          this.replyIndex
        ].commaSeparatedMentions = result.commaSeparatedMentions;
        if (this.notificatinService.mentionsObjects?.length !== 0) {
          this.notificatinService.notificationsSenderEngine(
            result.reply,
            this.notificatinService.mentionsObjects,
            this.comments[this.commentIndex].id
          );
        }
        this.editReplyTextArea = false;
        this.form.reset();
      },
    });
  }
}
