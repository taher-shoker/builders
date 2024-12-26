import { DatePipe, Location } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';
import {
  Component,
  ElementRef,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { ChatService } from './services/chat.service';
import { chatArray, responseBody } from './models/chatModel';

@Component({
  selector: 'stc-apps-chat-view',
  templateUrl: './chat-view.component.html',
  styleUrl: './chat-view.component.scss',
})
export class ChatViewComponent implements OnInit {
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;
  @ViewChild('textarea') private textArea!: HTMLTextAreaElement;
  messages: chatArray[] = [];
  newMessage = '';
  maxLength = 512;
  isFocused = false;
  messageType = 1;
  apiVar = '';

  // this flas represents wether the api respond or not.
  pendingFlag = signal(false);
  isAnimated = false;

  ngOnInit() {
    // Trigger the animation after the component is initialized
    setTimeout(() => {
      this.isAnimated = true;
    }, 100); // Delay for smoother animation (optional)
  }
  constructor(private chatService: ChatService) {}
  private scrollToBottom(): void {
    try {
      this.scrollContainer.nativeElement.scrollTo({
        top: this.scrollContainer.nativeElement.scrollHeight,
        behavior: 'smooth',
      });
    } catch (err) {
      console.error('Error scrolling:', err);
    }
  }
  getCurrentTime(): string {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const amPm = hours >= 12 ? 'PM' : 'AM';
    // hours = hours % 12 || 12;
    const currentTime = `${hours
      .toString()
      .padStart(2, '0')}:${minutes} ${amPm}`;
    return currentTime;
  }
  getTimeFromFullDate(dateTimeString: string): string {
    let time = dateTimeString.split('T')[1].split('.')[0]; // Extracts HH:MM:SS
    time = `${time.split(':')[0]}:${time.split(':')[1]}`;
    const hours = +time.split(':')[0];
    const amPm = hours >= 12 ? 'PM' : 'AM';
    time = `${time} ${amPm}`;
    return time; // Output: "08:46:00"
  }
  reset() {
    this.apiVar = '';
    this.pendingFlag.set(false);
    setTimeout(() => {
      this.scrollToBottom();
    });
  }
  sendMessage() {
    if (
      this.newMessage.trim() &&
      this.newMessage.length <= 512 &&
      !this.pendingFlag()
    ) {
      this.getCurrentTime();
      this.messages.push(
        {
          content: this.newMessage,
          messageType: 1,
          date: this.getCurrentTime(),
        },
        {
          content: '',
          messageType: 0,
          date: this.getCurrentTime(),
        }
      );
      setTimeout(() => {
        this.scrollToBottom();
      });
      this.apiVar = this.newMessage;
      this.newMessage = ''; // Clear input field
      this.pendingFlag.set(true);
      // Resting the text area height.
      const textarea = document.getElementById('textarea');
      if (textarea) {
        textarea.style.height = 'auto';
      }
      this.chatService.sendMessage({ content: this.apiVar }).subscribe({
        next: (result: responseBody) => {
          this.messages.pop();
          if (result.data !== null) {
            this.messages.push({
              content: result.data.content,
              messageType: 0,
              date: this.getTimeFromFullDate(result.timestamp),
              images: result.data.images ?? '',
            });
          } else {
            this.messages.push({
              content: result.message,
              messageType: 0,
              date: this.getTimeFromFullDate(result.timestamp),
              images: [],
            });
          }
          this.reset();
        },
        error: () => {
          this.messages.pop();
          this.messages.push({
            content: 'Something went wrong! Please try again.',
            messageType: 0,
            date: this.getCurrentTime(),
          });
          this.reset();
        },
      });
    }
  }
  onEnter(event: any) {
    event.preventDefault();
    this.sendMessage();
  }
  onFocus(): void {
    this.isFocused = true;
  }

  onBlur(event: Event): void {
    this.isFocused = false;
  }
  get remainingChars(): number {
    return this.maxLength - this.newMessage.length;
  }
  adjustHeight(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto'; // Reset height
    textarea.style.height = `${Math.min(textarea.scrollHeight, 90)}px`; // Set to scroll height
  }
}
