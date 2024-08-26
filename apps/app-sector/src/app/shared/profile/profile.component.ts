import {
  Component,
  EventEmitter,
  Input,
  InputSignal,
  OnInit,
  Output,
  effect,
  input,
} from '@angular/core';
import { mentionRegexService } from '../services/mentionRegex.service';
import { DatePipe } from '@angular/common';
import { CookieService } from 'ngx-cookie';
import { AuthService } from '../../services/auth.service';

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
  edited: InputSignal<boolean> = input(false);
  parentLoop: InputSignal<number> = input(0);
  authorID: InputSignal<number> = input(0);
  loggedUserID: InputSignal<number> = input(0);
  hasReplies: InputSignal<boolean> = input(false);
  commaSepartedMentions: InputSignal<string> = input('');
  @Output() commentActionName = new EventEmitter<string>();
  @Output() replyActionName = new EventEmitter<string>();
  actionsList = [''];
  constructor(
    private mentionsService: mentionRegexService,
    private datePipe: DatePipe
  ) {
    effect(() => {
      if (this.reply() == true && this.authorID() == this.loggedUserID()) {
        this.replyClass = true;
        this.actionsList = ['Edit', 'Delete'];
      } else if (
        this.reply() == true &&
        this.authorID() != this.loggedUserID()
      ) {
        this.replyClass = true;
        this.actionsList = [];
      } else if (!this.reply() && this.authorID() == this.loggedUserID()) {
        this.actionsList = ['Reply', 'Edit', 'Delete'];
        this.replyClass = false;
      } else {
        this.actionsList = ['Reply'];
        this.replyClass = false;
      }
    });
  }

  generateRegex() {
    let mentions = this.commaSepartedMentions().split(',');

    mentions = mentions.map((mention) => {
      if (mention.includes('|')) {
        const mentionData = mention.split('|');
        return mentionData[1];
      } else {
        return mention;
      }
    });
    return this.mentionsService.generateRegex(mentions);
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
      return 'Few Seconds Ago';
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
  actionsClick(actionName: string) {
    if (this.reply()) {
      this.replyActionName.emit(actionName);
    } else {
      this.commentActionName.emit(actionName);
    }
  }
}
