import { Component, EventEmitter, Output, signal } from '@angular/core';
import suggestedQuestions from '../../views/chat-view/models/chatModel';

@Component({
  selector: 'stc-apps-slider',
  templateUrl: './slider.component.html',
  styleUrl: './slider.component.scss',
})
export class SliderComponent {
  activeIndex = signal(0);
  // ngOnInit() {
  //   setInterval(() => {
  //     const nextIndex = (this.activeIndex() + 1) % this.messages.length;
  //     this.activeIndex.set(nextIndex);
  //   }, 4000);
  // }

  messages = suggestedQuestions;
  touchStartX = 0;
  touchEndX = 0;
  currentIndex = 0;

  chunkedMessages = this.chunkMessages(this.messages, 3);
  @Output() questionEvent = new EventEmitter<string>();
  chunkMessages(arr: string[], size: number): string[][] {
    const result = [];
    for (let i = 0; i < arr.length; i += size) {
      result.push(arr.slice(i, i + size));
    }
    console.log(result);

    return result;
  }

  goToSlide(index: number) {
    this.activeIndex.set(index);
  }
  cardClick(question: string) {
    this.questionEvent.emit(question);
  }
}
