import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import {
  Component,
  effect,
  input,
  InputSignal,
  OnChanges,
  signal,
  SimpleChanges,
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
export class ChatListItemComponent implements OnChanges {
  message: InputSignal<string> = input('');
  messageDate: InputSignal<string> = input('');
  messagesChunks: InputSignal<chunkData[]> = input([{} as chunkData]);
  messageType: InputSignal<number> = input(0);
  isLoading: InputSignal<boolean> = input(false);
  chunkStream: chunkData[] = [];

  showPopUp = false;
  selectedImage = '';
  processedMessage = '';
  popUpClick = false;
  stageList: string[] = [];

  lastText = '';
  displayedText = '';
  private bufferQueue: string[] = [];
  private typingInterval: any;
  constructor(private chatStreamService: ChatStreamService) {
    this.chatStreamService.chunkStageSubject.subscribe((chunkStream) => {
      this.chunkStream = chunkStream;
    });
    // effect(() => {
    //   if (this.message() && this.isLoading()) {
    //     this.processedMessage = this.replaceNull(this.message());
    //   }
    // });
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['message']) {
      const current = this.message();

      // Prevent duplicate work
      if (current === this.lastText) return;

      if (this.isLoading()) {
        const newChunk = current.slice(this.lastText.length);
        //  this.queueNewCharacters(newChunk);
        this.lastText = current;
      } else {
        this.displayedText = current;
        this.lastText = current;
      }
    }
  }
  queueNewCharacters(newChunk: string) {
    this.bufferQueue.push(...newChunk.split(''));

    if (!this.typingInterval) {
      this.typingInterval = setInterval(() => {
        if (this.bufferQueue.length > 0) {
          this.displayedText += this.bufferQueue.shift()!;
        } else {
          clearInterval(this.typingInterval);
          this.typingInterval = null;
        }
      }, 20); // adjust speed here
    }
  }
  replaceNull(input: string | null): string {
    return input?.replace(/null/g, '') || '';
  }
  showPopUpOnClick() {
    this.showPopUp = true;
  }
  closePopUp() {
    this.showPopUp = false;
  }
}
