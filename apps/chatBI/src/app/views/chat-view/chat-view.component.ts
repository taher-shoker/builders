import { Location } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'stc-apps-chat-view',
  templateUrl: './chat-view.component.html',
  styleUrl: './chat-view.component.scss',
})
export class ChatViewComponent {
  messages: any[] = [];
  newMessage = '';
  maxLength = 512;
  isFocused = false;
  messageType = 1;
  message = `Voice Quality of Huzhou on October 14, 2024:
International roam-in 2G attach success rate in Huzhou: 94.01%
International roaming-in 4G attach success rate in Huzhou: 95.01%
Call completion rate of international roaming-in voice calls in Huzhou: 96.01%
International roaming-in attach success rate in Huzhou: 97.01%
Inter-province roam-in 2G attach success rate in Huzhou: 82.01%
Inter-province LTE roaming attach success rate: 83.01%
SG registration success rate of inter-province roaming subscribers in Huzhou: 84.01%
Huzhou inter-province roam-in video download rate: 185.01 MbpsD`;
  constructor(private location: Location) {}
  sendMessage() {
    if (this.newMessage.trim()) {
      this.messages.push({ content: this.newMessage, sender: 'You' });
      this.newMessage = ''; // Clear input field
    }
  }
  onFocus(): void {
    this.isFocused = true;
    console.log(this.isFocused);
  }

  onBlur(): void {
    this.isFocused = false;
  }
  get remainingChars(): number {
    return this.maxLength - this.newMessage.length;
  }
  // adjustHeight(event: Event) {
  //   const textarea = event.target as HTMLTextAreaElement;
  //   textarea.style.height = 'fit-content'; // Reset height

  //   textarea.style.height = `${textarea.scrollHeight}px`; // Set to scroll height
  //   console.log(textarea.style.height);
  // }
}
