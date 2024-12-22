import { DatePipe, Location } from '@angular/common';
import { Component, ElementRef, signal, ViewChild } from '@angular/core';
import { ChatService } from './services/chat.service';
import { chatArray, responseBody } from './models/chatModel';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'stc-apps-chat-view',
  templateUrl: './chat-view.component.html',
  styleUrl: './chat-view.component.scss',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate(
          '400ms ease-out',
          style({ opacity: 1, transform: 'translateY(0)' })
        ),
      ]),
    ]),
  ],
})
export class ChatViewComponent {
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;
  messages: chatArray[] = [];
  newMessage = '';
  maxLength = 512;
  isFocused = false;
  messageType = 1;
  apiVar = '';

  // this flas represents wether the api respond or not.
  pendingFlag = signal(false);
  constructor(
    private location: Location,
    private chatService: ChatService,
    private datePipe: DatePipe
  ) {}
  private scrollToBottom(): void {
    try {
      console.log(
        'inside scroll',
        this.scrollContainer.nativeElement.scrollHeight
      );

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
  getTime(dateTimeString: string): string {
    let time = dateTimeString.split('T')[1].split('.')[0]; // Extracts HH:MM:SS
    time = `${time.split(':')[0]}:${time.split(':')[1]}`;
    const hours = +time.split(':')[0];
    const amPm = hours >= 12 ? 'PM' : 'AM';
    time = `${time} ${amPm}`;
    return time; // Output: "08:46:00"
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
      console.log(this.messages);
      this.chatService.sendMessage({ content: this.apiVar }).subscribe({
        next: (result: responseBody) => {
          this.messages.pop();
          this.messages.push({
            content: result.data.content,
            messageType: 0,
            date: this.getTime(result.timestamp),
            images: result.data.images ?? '',
          });
          this.apiVar = '';
          this.pendingFlag.set(false);
          setTimeout(() => {
            this.scrollToBottom();
          });
        },
        error: () => {
          this.messages.pop();
          this.messages.push({
            content: 'Something went wrong! Please try again.',
            messageType: 0,
            date: this.getCurrentTime(),
          });
          console.log('case of error');
          this.apiVar = ''; // Clear input field
          this.pendingFlag.set(false);
          setTimeout(() => {
            this.scrollToBottom();
          });
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
