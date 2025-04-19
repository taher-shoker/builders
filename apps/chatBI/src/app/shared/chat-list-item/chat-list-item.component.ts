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
  prevValue = '';
  messageChunk = '';
  previousContent = '';
  newChunk = '';
  mergedChunks = '';
  chartShowType = '';
  chartSqlData = { xList: [], yList: [], title: '' };
  constructor(private chatStreamService: ChatStreamService) {
    this.chatStreamService.chunkStageSubject.subscribe((chunkStream) => {
      this.chunkStream = chunkStream;
      const stage = this.chunkStream[this.chunkStream.length - 1];
      const full = stage.stageContent;

      if (full && !full.startsWith(this.previousContent)) {
        this.previousContent = '';
        this.newChunk = full;
      } else {
        this.newChunk = full?.slice(this.previousContent.length);
      }
      if (this.newChunk) {
        this.mergedChunks = this.newChunk;
        setTimeout(() => {
          this.previousContent += this.newChunk;
          this.newChunk = '';
        }, 800);
      }
    });
    // effect(() => {
    //   if (this.message() && this.isLoading()) {
    //     this.processedMessage = this.replaceNull(this.message());
    //   }
    // });
  }
  onAnimationEnd() {
    // Merge smoothly once animation is done
    this.previousContent += this.newChunk;
    this.newChunk = '';
  }
  trackByContent(index: number, content: string): string {
    console.log('content', content);

    return content; // Changes in content will force re-render
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
