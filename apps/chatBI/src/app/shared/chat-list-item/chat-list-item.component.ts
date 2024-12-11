import { Component, input, InputSignal } from '@angular/core';

@Component({
  selector: 'stc-apps-chat-list-item',
  templateUrl: './chat-list-item.component.html',
  styleUrl: './chat-list-item.component.scss',
})
export class ChatListItemComponent {
  message: InputSignal<string> = input('Voice Quality In the last day?');
  messageDate: InputSignal<string> = input('16:46 PM');
  messageType: InputSignal<number> = input(0);
}
