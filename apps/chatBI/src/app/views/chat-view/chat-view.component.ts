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
      content:
        '**Hello this is CEM copilot** \n\nTo get the expected results, please ask questions in the following sentence structure',
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
  togglePause() {
    this.isPaused = !this.isPaused;
  }
  setSuggestedQuestion(question: string) {
    this.resetTextArea();
    this.newMessage = question;
    this.textareaHeight = 128;
  }
  hideQuestionsAction() {
    this.hideQuestions = !this.hideQuestions;
    if (!this.hideQuestions) {
      setTimeout(() => {
        this.scrollToBottom();
      });
    }
  }
  handlePauseStream() {
    this.pauseStream();
    this.isPaused = true;
    this.pendingFlag.set(false);
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
    const chunkStream: chunkData[] = [];

    this.messagesStreamList.push({
      messageType: 0,
      content: '',
    });
    this.pendingFlag.set(true);
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
            chunkStream.push(newChunk);
            this.stage = chunk.stage;
          } else if (this.stage == chunk.stage) {
            this.chatStreamService.updateAssistantMessage(chunkStream, chunk);
          }
          const cloned = chunkStream.map((obj) => ({ ...obj }));
          setTimeout(() => {
            this.scrollToBottom();
          });
          this.chatStreamService.chunkStageSubject.next(cloned);
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
          this.reset();
          const lastResponse =
            this.messagesStreamList[this.messagesStreamList.length - 1];
          lastResponse.content = 'stream complete';
          lastResponse.chunk = chunkStream;
          console.log('Stream complete', this.messagesStreamList);
        },
      });
  }
  pauseStream() {
    console.log(this.messageSubscription);

    this.messageSubscription?.unsubscribe(); // Stops data from arriving
  }
  sendStreamMessage() {
    this.newMessageIsSent = true;
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
