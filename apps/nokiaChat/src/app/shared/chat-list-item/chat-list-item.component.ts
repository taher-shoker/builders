import { animate, style, transition, trigger } from '@angular/animations';
import {
  Component,
  effect,
  EventEmitter,
  input,
  InputSignal,
  Output,
} from '@angular/core';
import { sqlData } from '../../views/chat-view/models/chat-view.model';

@Component({
  selector: 'app-chat-list-item',
  templateUrl: './chat-list-item.component.html',
  styleUrl: './chat-list-item.component.scss',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ transform: 'translateY(200px)', opacity: 0.7 }),
        animate(
          '800ms ease-in-out',
          style({ transform: 'translateY(0)', opacity: 1 })
        ),
      ]),
    ]),
  ],
})
export class ChatListItemComponent {
  @Output() questionEvent = new EventEmitter<string>();
  messageType: InputSignal<string> = input('');
  message: InputSignal<string> = input('');
  header: InputSignal<string> = input('');
  messageDate: InputSignal<string> = input('');
  newChat: InputSignal<boolean> = input(false);
  isLoading: InputSignal<boolean> = input(false);
  showType: InputSignal<string> = input('');
  sqlData: InputSignal<sqlData> = input({} as sqlData);
  sqlReason: InputSignal<string> = input('');
  sqlQuery: InputSignal<string> = input('');

  showPopUp = false;
  constructor() {
    effect(() => {
      console.log(this.sqlData());
    });
  }
  replaceNull(input: string | null): string {
    return input?.replace(/null/g, '') || '';
  }
  showPopUpOnClick() {
    this.showPopUp = true;
  }
  closePopUp() {
    this.showPopUp = false;
  }
  questionClick(question: string) {
    this.questionEvent.emit(question);
  }
}
