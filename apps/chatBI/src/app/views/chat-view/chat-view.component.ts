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
import { chatArray, responseBody, sqlData } from './models/chatModel';

@Component({
  selector: 'stc-apps-chat-view',
  templateUrl: './chat-view.component.html',
  styleUrl: './chat-view.component.scss',
})
export class ChatViewComponent implements OnInit {
  @ViewChild('scrollContainer') private scrollableContainer!: ElementRef;
  messagesList: chatArray[] = [];
  newMessage = '';
  maxLength = 512;
  isFocused = false;
  messageType = 1;
  modelQuery = '';
  // this flag represents wether the api respond or not.
  pendingFlag = signal(false);
  isAnimated = false;

  ngOnInit() {
    setTimeout(() => {
      this.isAnimated = true;
    }, 100);
  }
  constructor(private chatService: ChatService) {}

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

  sendMessage() {
    if (!this.validateSentMessage()) {
      return;
    }
    this.getCurrentTime();
    this.pushNewMessage({
      content: this.newMessage,
      messageType: 1,
      date: this.getCurrentTime(),
      images: [],
    });
    this.pushNewMessage({
      content: '',
      messageType: 0,
      date: this.getCurrentTime(),
      images: [],
    });
    setTimeout(() => {
      this.scrollToBottom();
    });
    this.modelQuery = this.newMessage;
    this.newMessage = '';
    this.pendingFlag.set(true);
    this.resetTextArea();

    this.chatService.sendMessage({ content: this.modelQuery }).subscribe({
      next: (result: responseBody) => {
        this.handleModelResponse({
          content: result.data !== null ? result.data.content : result.message,
          messageType: 0,
          date: this.getTimeFromFullDate(result.timestamp),
          images: result.data !== null ? result.data.images : [],
          showType: result.data?.showType,
          sqlData: result.data?.sqlData,
        });
      },
      error: () => {
        this.handleModelResponse({
          content: 'Something went wrong! Please try again.',
          messageType: 0,
          date: this.getCurrentTime(),
          images: [],
        });
      },
    });
  }
  validateSentMessage() {
    return (
      this.newMessage.trim() &&
      this.newMessage.length <= 512 &&
      !this.pendingFlag()
    );
  }
  private scrollToBottom(): void {
    try {
      this.scrollableContainer.nativeElement.scrollTo({
        top: this.scrollableContainer.nativeElement.scrollHeight,
        behavior: 'smooth',
      });
    } catch (err) {
      console.error('Error scrolling:', err);
    }
  }
  reset() {
    this.modelQuery = '';
    this.pendingFlag.set(false);
    setTimeout(() => {
      this.scrollToBottom();
    });
  }
  handleModelResponse(newMessage: chatArray) {
    this.messagesList.pop();
    this.pushNewMessage(newMessage);
    this.reset();
  }
  pushNewMessage(newMessage: chatArray) {
    this.messagesList.push({
      content: newMessage.content,
      messageType: newMessage.messageType,
      date: newMessage.date,
      images: newMessage.images,
      showType: newMessage.showType ?? '',
      sqlData: newMessage.sqlData ?? ({} as sqlData),
    });
  }

  resetTextArea() {
    const textarea = document.getElementById('textarea');
    if (textarea) {
      textarea.style.height = 'auto';
    }
  }
  getCurrentTime(): string {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const amPm = hours >= 12 ? 'PM' : 'AM';
    const currentTime = `${hours
      .toString()
      .padStart(2, '0')}:${minutes} ${amPm}`;
    return currentTime;
  }
  getTimeFromFullDate(dateTimeString: string): string {
    let time = dateTimeString.split('T')[1].split('.')[0];
    time = `${time.split(':')[0]}:${time.split(':')[1]}`;
    const hours = +time.split(':')[0];
    const amPm = hours >= 12 ? 'PM' : 'AM';
    time = `${time} ${amPm}`;
    return time;
  }
}
