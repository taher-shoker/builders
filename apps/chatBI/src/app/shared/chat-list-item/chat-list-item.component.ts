import { Component, effect, input, InputSignal } from '@angular/core';

@Component({
  selector: 'stc-apps-chat-list-item',
  templateUrl: './chat-list-item.component.html',
  styleUrl: './chat-list-item.component.scss',
})
export class ChatListItemComponent {
  message: InputSignal<string> = input('');
  messageDate: InputSignal<string> = input('');
  messageType: InputSignal<number> = input(0);
  images: InputSignal<string[]> = input(['']);
  isLoading: InputSignal<boolean> = input(false);
  constructor(){
    effect(()=>{
      console.log(this.isLoading());
      
    })
  }
}
