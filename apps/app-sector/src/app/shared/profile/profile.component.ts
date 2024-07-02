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
  @Input() mentions!: string[];

  @Output() commentActionName = new EventEmitter<string>();
  @Output() replyActionName = new EventEmitter<string>();
  actionsList = [''];
  constructor(private mentionsService: mentionRegexService) {
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
  generateRegex() {
    return this.mentionsService.generateRegex(this.mentions);
  }

  actionsClick(actionName: string) {
    if (this.reply()) {
      this.replyActionName.emit(actionName);
    } else {
      this.commentActionName.emit(actionName);
    }
  }
}
