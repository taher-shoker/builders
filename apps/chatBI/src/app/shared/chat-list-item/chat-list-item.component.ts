import { animate, style, transition, trigger } from '@angular/animations';
import { Component, effect, input, InputSignal } from '@angular/core';
import { sqlData } from '../../views/chat-view/models/chatModel';

@Component({
  selector: 'stc-apps-chat-list-item',
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
  message: InputSignal<string> = input('');
  messageDate: InputSignal<string> = input('');
  messageType: InputSignal<number> = input(0);
  images: InputSignal<string[]> = input(['']);
  showType: InputSignal<string> = input('');
  sqlData: InputSignal<sqlData> = input({} as sqlData);
  isLoading: InputSignal<boolean> = input(false);
  showPopUp = false;
  selectedImage = '';
  processedMessage = '';
  popUpClick = false;
  constructor() {
    effect(() => {
      if (this.message()) {
        this.processedMessage = this.replaceNull(this.message());
      }
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
}
