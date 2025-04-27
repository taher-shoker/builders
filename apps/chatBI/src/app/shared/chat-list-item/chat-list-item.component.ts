import {
  animate,
  query,
  stagger,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import {
  Component,
  effect,
  ElementRef,
  EventEmitter,
  input,
  InputSignal,
  OnChanges,
  Output,
  signal,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { chunkData, sqlData } from '../../views/chat-view/models/chatModel';
import { ChatStreamService } from '../../views/chat-view/services/chat-stream.service';
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
  header: InputSignal<string> = input('');
  messageDate: InputSignal<string> = input('');
  newChat: InputSignal<boolean> = input(false);
  messagesChunks: InputSignal<chunkData[]> = input([{} as chunkData]);
  messageType: InputSignal<number> = input(0);
  isLoading: InputSignal<boolean> = input(false);
  @Output() questionEvent = new EventEmitter<string>();
  chunkStream: chunkData[] = [];
  errorMessage = 'Something went wrong! Please try again.';
  showPopUp = false;
  selectedImage = '';
  processedMessage = '';
  popUpClick = false;
  @ViewChild('container') myElementRef!: ElementRef;

  previousContent = '';
  newChunk = '';
  currentStage = '';
  words: string[] = [];
  currentWordIndex = 0;
  isAnimating = false;

  chartShowType = '';
  chartSqlData = { xList: [], yList: [], title: '' };

  constructor(private chatStreamService: ChatStreamService) {
    this.chatStreamService.chunkStageSubject.subscribe((chunkStream) => {
      this.chunkStream = chunkStream;
      const stage = this.chunkStream[this.chunkStream.length - 1];
      const fullContent = stage.stageContent;
      const stageTitle = stage.stageTitle;
      if (fullContent && typeof fullContent === 'string') {
        if (this.currentStage !== stageTitle) {
          this.previousContent = '';
          this.formattingNewChunk(fullContent);
          this.currentStage = stageTitle;
        } else {
          this.formattingNewChunk(fullContent);
        }
      }
    });
  }
  formattingNewChunk(fullContent: string) {
    this.newChunk = fullContent.slice(this.previousContent.length);
    this.words = this.newChunk.split(' ');
    this.currentWordIndex = 0;
    this.animateWords();
  }

  animateWords() {
    if (this.isAnimating) return;
    this.isAnimating = true;

    if (this.words?.length === 0) {
      this.isAnimating = false;
      return;
    }

    const interval = setInterval(() => {
      if (this.currentWordIndex < this.words.length) {
        this.previousContent += this.words[this.currentWordIndex] + ' '; // Add word progressively
        this.currentWordIndex++;
      } else {
        clearInterval(interval);
        this.isAnimating = false;
      }
    }, 100);
  }
  replaceNull(input: string | null): string {
    return input?.replace(/null/g, '') || '';
  }
  showPopUpOnClick(showType: string, sqlData: any) {
    this.showPopUp = true;
    this.chartShowType = showType;
    this.chartSqlData = sqlData;
  }
  closePopUp() {
    this.showPopUp = false;
  }
  questionClick(question: string) {
    this.questionEvent.emit(question);
  }
}
