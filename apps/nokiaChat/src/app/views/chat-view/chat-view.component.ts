import {
  Component,
  ElementRef,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { chatArray, responseBody } from './models/chat-view.model';
import { ChatService } from './services/chat.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chat-view',
  templateUrl: './chat-view.component.html',
  styleUrl: './chat-view.component.scss',
})
export class ChatViewComponent implements OnInit {
  queryMessage = '';
  queryModelParam = '';
  maxLength = 512;
  isFocused = false;
  textareaHeight = 128;
  newChatScreenFlag = true;
  autoScrollEnabled = true;
  isAnimated = false;
  messageList: chatArray[] = [];
  // this flag represents wether the api responded or not.
  pendingFlag = signal(false);
  @ViewChild('scrollContainer') private scrollableContainer!: ElementRef;
  private apiSubscription: Subscription | undefined;
  ngOnInit() {
    setTimeout(() => {
      this.isAnimated = true;
    }, 100);
    this.addingNewChatMessage();
  }
  addingNewChatMessage() {
    this.newChatScreenFlag = true;
    this.messageList.push({
      messageType: 'user',
      newChat: true,
      header: 'Hello this is FNI',
      content:
        'To get the expected results, please ask questions in the following sentence structure',
    });
  }

  handleNewChat() {
    this.messageList = [];
    this.addingNewChatMessage();
    this.apiSubscription?.unsubscribe();
    this.reset();
  }
  constructor(private chatService: ChatService) {}
  onEnter(event: any) {
    event.preventDefault();
  }
  onFocus(): void {
    this.isFocused = true;
  }
  onBlur(event: Event): void {
    this.isFocused = false;
  }
  adjustHeight(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 90)}px`;
    if (textarea.scrollHeight < 100) {
      this.textareaHeight = textarea.scrollHeight + 76;
    } else if (textarea.scrollHeight == 100) {
      this.textareaHeight = textarea.scrollHeight + 65;
    } else {
      // eslint-disable-next-line no-self-assign
      this.textareaHeight = this.textareaHeight;
    }
  }
  onScroll() {
    const scrollBarElement = this.scrollableContainer.nativeElement;
    const threshold = 200;
    requestAnimationFrame(() => {
      const position =
        scrollBarElement.scrollTop + scrollBarElement.clientHeight;
      const height = scrollBarElement.scrollHeight;
      this.autoScrollEnabled = position >= height - threshold;
    });
  }
  private scrollToBottom(): void {
    try {
      setTimeout(() => {
        if (this.autoScrollEnabled) {
          this.scrollableContainer.nativeElement.scrollTo({
            top: this.scrollableContainer.nativeElement.scrollHeight,
            behavior: 'smooth',
          });
        }
      });
    } catch (err) {
      console.error('Error scrolling:', err);
    }
  }
  resetTextArea() {
    const textarea = document.getElementById('textarea');
    if (textarea) {
      textarea.style.height = 'auto';
    }
  }
  reset() {
    this.queryModelParam = '';
    this.pendingFlag.set(false);
    setTimeout(() => {
      this.scrollToBottom();
    });
  }

  setSuggestedQuestion(question: string) {
    this.queryMessage = question;
  }
  handleAssistantResponse(arrayObject: chatArray) {
    this.messageList.pop();
    this.messageList.push(arrayObject);
    console.log(this.messageList);

    this.reset();
  }
  hanldeSendMessageSubscription() {
    this.apiSubscription = this.chatService
      .sendMessage({ showType: 'bar', content: this.queryModelParam })
      .subscribe({
        next: (response: responseBody) => {
          console.log(response);

          this.handleAssistantResponse({
            content: response.data.content,
            messageType: 'assistant',
            sqlQuery: response.data.sqlQuery,
            sqlReason: response.data.sqlReason,
            sqlData: response.data.sqlData ?? {
              xList: [],
              yList: [],
              title: '',
            },
            showType: response.data.showType ?? '',
          });
        },
        error: (error) => {
          this.handleAssistantResponse({
            content: 'Something went wrong! Please try again.',
            messageType: 'assistant',
          });
        },
      });
  }
  removeSuggestedQuestionsMessage() {
    if (this.messageList[this.messageList.length - 1].newChat) {
      this.messageList.pop();
    }
  }
  sendMessage() {
    if (
      this.queryMessage.length > 512 ||
      !this.queryMessage.trim() ||
      this.pendingFlag()
    )
      return;
    this.removeSuggestedQuestionsMessage();
    this.messageList.push({
      content: this.queryMessage,
      messageType: 'user',
    });
    setTimeout(() => {
      this.scrollToBottom();
    });
    this.resetTextArea();

    this.pendingFlag.set(true);
    this.newChatScreenFlag = false;
    this.queryModelParam = this.queryMessage;
    this.queryMessage = '';
    this.messageList.push({
      content: '',
      messageType: 'assistant',
    });
    this.hanldeSendMessageSubscription();
  }
}
