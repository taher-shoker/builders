import {
  Component,
  ElementRef,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { ChatService } from './services/chat.service';
import {
  chatArray,
  chunkData,
  responseBody,
  sqlData,
  streamChatArray,
} from './models/chatModel';
import { ChatStreamService } from './services/chat-stream.service';

import { Subscription } from 'rxjs';

@Component({
  selector: 'stc-apps-chat-view',
  templateUrl: './chat-view.component.html',
  styleUrl: './chat-view.component.scss',
})
export class ChatViewComponent implements OnInit {
  private messageSubscription!: Subscription;
  @ViewChild('scrollContainer') private scrollableContainer!: ElementRef;
  messagesList: chatArray[] = [];
  messagesStreamList: streamChatArray[] = [];
  hideQuestions = false;
  newMessage = '';
  maxLength = 512;
  isFocused = false;
  messageType = 1;
  modelQuery = '';
  // this flag represents wether the api respond or not.
  pendingFlag = signal(false);
  isAnimated = false;
  textareaHeight = 128;
  stage = '';
  isPaused = false;
  newMessageIsSent = false;
  chunkStream: chunkData[] = [];
  ngOnInit() {
    setTimeout(() => {
      this.isAnimated = true;
    }, 100);
    this.addingStartMessage();
  }
  constructor(
    private chatService: ChatService,
    private chatStreamService: ChatStreamService
  ) {}
  addingStartMessage() {
    this.newMessageIsSent = false;
    this.messagesStreamList.push({
      messageType: 1,
      newChat: true,
      header: 'Hello this is CEM copilot',
      content:
        'To get the expected results, please ask questions in the following sentence structure',
    });
  }
  onEnter(event: any) {
    event.preventDefault();
    this.sendStreamMessage();
  }
  onFocus(): void {
    this.isFocused = true;
  }
  onBlur(event: Event): void {
    this.isFocused = false;
  }
  handlePauseStream() {
    this.pauseStream();
    this.isPaused = true;
    this.pendingFlag.set(false);
    this.messagesStreamList.length !== 0 ? this.completeStream() : '';
  }
  handleNewChat() {
    this.messagesStreamList = [];
    this.handlePauseStream();
    this.addingStartMessage();
  }
  questionClick(question: string) {
    this.newMessage = question;
  }
  get remainingChars(): number {
    return this.maxLength - this.newMessage.length;
  }
  adjustHeight(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto'; // Reset height
    textarea.style.height = `${Math.min(textarea.scrollHeight, 90)}px`; // Set to scroll height
    if (textarea.scrollHeight < 100) {
      this.textareaHeight = textarea.scrollHeight + 76;
    } else if (textarea.scrollHeight == 100) {
      this.textareaHeight = textarea.scrollHeight + 65;
    } else {
      // eslint-disable-next-line no-self-assign
      this.textareaHeight = this.textareaHeight;
    }
  }
  connectToStream() {
    this.messagesStreamList.push({
      messageType: 0,
      content: '',
    });
    this.pendingFlag.set(true);
    this.chunkStream = [];
    this.stage = '';
    this.messageSubscription = this.chatStreamService
      .getStreamChatMessages(this.modelQuery)
      .subscribe({
        next: (chunk) => {
          if (this.isPaused) return;
          console.log(chunk);

          const stageContent =
            this.chatStreamService.getStageChunkContent(chunk);
          if (this.stage !== chunk.stage && chunk.stage !== 'COMPLETE') {
            const newChunk: chunkData = {
              stageTitle: chunk.stage,
              stageContent: stageContent,
              showType: chunk.data?.showType ?? '',
              sqlData: chunk.data?.showType ? chunk.data?.sqlData : undefined,
            };

            this.chunkStream.push(newChunk);
            this.stage = chunk.stage;
          } else if (this.stage == chunk.stage) {
            this.chatStreamService.updateAssistantMessage(
              this.chunkStream,
              chunk
            );
          }
          const cloned = this.chunkStream.map((obj) => ({ ...obj }));
          this.chatStreamService.chunkStageSubject.next(cloned);
          setTimeout(() => {
            this.scrollToBottom();
          });
        },
        error: (err) => {
          console.log(err);
          this.messagesStreamList.pop();
          this.reset();
          this.messagesStreamList.push({
            content: 'Something went wrong! Please try again.',
            messageType: 0,
          });
        },
        complete: () => {
          this.completeStream();
          console.log('Stream complete', this.messagesStreamList);
        },
      });
  }
  completeStream() {
    this.reset();
    const lastResponse =
      this.messagesStreamList[this.messagesStreamList.length - 1];
    lastResponse.content = 'stream complete';
    lastResponse.chunk = this.chunkStream;
  }
  pauseStream() {
    this.messageSubscription?.unsubscribe(); // Stops data from arriving
  }
  sendStreamMessage() {
    this.newMessageIsSent = true;
    this.isPaused = false;
    // if (!this.validateSentMessage()) return;

    if (this.newMessage) {
      if (this.messagesStreamList[this.messagesStreamList.length - 1].newChat) {
        this.messagesStreamList.pop();
      }
      this.messagesStreamList.push({
        content: this.newMessage,
        messageType: 1,
      });
      setTimeout(() => {
        this.scrollToBottom();
      });
      this.resetTextArea();
      this.modelQuery = this.newMessage;
      this.newMessage = '';
      this.connectToStream();
    } else {
      this.handlePauseStream();
    }
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
