import {
  Component,
  EventEmitter,
  Input,
  InputSignal,
  Output,
  effect,
  input,
} from '@angular/core';
import { mentionRegexService } from '../services/mentionRegex.service';
import { DatePipe } from '@angular/common';

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
      let mentions;
      if (this.commaSepartedMentions() !== null &&this.commaSepartedMentions()) {
        mentions = this.commaSepartedMentions().split(',');
      }

      console.log(
        'new mentions',
        this.reply(),
        this.comment(),
        this.hasReplies(),
        this.commaSepartedMentions(),
        mentions
      );

      if (this.reply() == true) {
        this.replyClass = true;
        this.actionsList = ['Edit', 'Delete'];
      } else {
        this.actionsList = ['Reply', 'Edit', 'Delete'];
        this.replyClass = false;
      }
    });
  }
  generateRegex() {
    const mentions = this.commaSepartedMentions().split(',');
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
