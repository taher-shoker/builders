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
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const amPm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
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
            content:
              'Known information:\nAt 00:00 on December 22, 2024 Network statistics at Riyadh:\n    Total Throughput at Riyadh: 84\n    Statistics VoLTE Traffic at Riyadh: 0 second\n    2G Voice Traffic at Riyadh: 654.95796 Erl\n    Active Users at Riyadh: 52763\n    Data Traffic at Riyadh: 2.17275 TB\nAt 01:00 on December 22, 2024 Network statistics at Riyadh:\n    Total Throughput at Riyadh: 53\n    Statistics VoLTE Traffic at Riyadh: 0 second\n    2G Voice Traffic at Riyadh: 205.03497 Erl\n    Active Users at Riyadh: 39911\n    Data Traffic at Riyadh: 1.80321 TB\nAt 02:00 on December 22, 2024 Network statistics at Riyadh:\n    Total Throughput at Riyadh: 10\n    Statistics VoLTE Traffic at Riyadh: 0 second\n    2G Voice Traffic at Riyadh: 130.02969 Erl\n    Active Users at Riyadh: 33039\n    Data Traffic at Riyadh: 1.4192 TB\nAt 03:00 on December 22, 2024 Network statistics at Riyadh:\n    Total Throughput at Riyadh: 18\n    Statistics VoLTE Traffic at Riyadh: 0 second\n    2G Voice Traffic at Riyadh: 92.38938 Erl\n    Active Users at Riyadh: 28019\n    Data Traffic at Riyadh: 1.20904 TB\nAt 04:00 on December 22, 2024 Network statistics at Riyadh:\n    Total Throughput at Riyadh: 66\n    Statistics VoLTE Traffic at Riyadh: 0 second\n    2G Voice Traffic at Riyadh: 188.33307 Erl\n    Active Users at Riyadh: 30021\n    Data Traffic at Riyadh: 0.94607 TB\nAt 05:00 on December 22, 2024 Network statistics at Riyadh:\n    Total Throughput at Riyadh: 11\n    Statistics VoLTE Traffic at Riyadh: 0 second\n    2G Voice Traffic at Riyadh: 183.31764 Erl\n    Active Users at Riyadh: 31953\n    Data Traffic at Riyadh: 0.98048 TB\nAt 06:00 on December 22, 2024 Network statistics at Riyadh:\n    Total Throughput at Riyadh: 64\n    Statistics VoLTE Traffic at Riyadh: 0 second\n    2G Voice Traffic at Riyadh: 388.80548 Erl\n    Active Users at Riyadh: 38653\n    Data Traffic at Riyadh: 1.18173 TB\nAt 07:00 on December 22, 2024 Network statistics at Riyadh:\n    Total Throughput at Riyadh: 78\n    Statistics VoLTE Traffic at Riyadh: 0 second\n    2G Voice Traffic at Riyadh: 541.23754 Erl\n    Active Users at Riyadh: 44888\n    Data Traffic at Riyadh: 1.25982 TB\nAt 08:00 on December 22, 2024 Network statistics at Riyadh:\n    Total Throughput at Riyadh: 58\n    Statistics VoLTE Traffic at Riyadh: 0 second\n    2G Voice Traffic at Riyadh: 724.41902 Erl\n    Active Users at Riyadh: 47248\n    Data Traffic at Riyadh: 1.2919 TB\n',
            messageType: 0,
            date: this.getCurrentTime(),
          });
          console.log('case of error');
          this.apiVar = ''; // Clear input field
          this.pendingFlag.set(false);
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
