import { animate, style, transition, trigger } from '@angular/animations';
import { Component, effect, input, InputSignal } from '@angular/core';

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
  isLoading: InputSignal<boolean> = input(false);
  showPopUp = false;
  selectedImage = '';
  constructor() {
    effect(() => {
      console.log(this.isLoading());
    });
  }
  imageClick(image: string) {
    this.selectedImage = image;
    this.showPopUp = true;
  }
  onPopupClose() {
    this.showPopUp = false;
  }
}
