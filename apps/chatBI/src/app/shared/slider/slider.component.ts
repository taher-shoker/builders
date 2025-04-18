import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Output,
  signal,
  ViewChild,
} from '@angular/core';
import suggestedQuestions from '../../views/chat-view/models/chatModel';

@Component({
  selector: 'stc-apps-slider',
  templateUrl: './slider.component.html',
  styleUrl: './slider.component.scss',
})
export class SliderComponent implements AfterViewInit {
  @ViewChild('sliderWrapper') sliderWrapper!: ElementRef;

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

  chunkedMessages = this.chunkMessages(this.messages, 3);
  @Output() questionEvent = new EventEmitter<string>();
  ngAfterViewInit() {
    this.setupSwipeGestures();
  }
  setupSwipeGestures() {
    const element = this.sliderWrapper.nativeElement;

    element.addEventListener(
      'touchstart',
      (e: TouchEvent) => {
        this.touchStartX = e.changedTouches[0].screenX;
      },
      { passive: true }
    );

    element.addEventListener(
      'touchend',
      (e: TouchEvent) => {
        this.touchEndX = e.changedTouches[0].screenX;
        this.handleSwipe();
      },
      { passive: true }
    );
  }

  handleSwipe() {
    const minSwipeDistance = 50; // Minimum distance to consider it a swipe

    if (this.touchStartX - this.touchEndX > minSwipeDistance) {
      // Swipe left - go to next slide
      this.nextSlide();
    } else if (this.touchEndX - this.touchStartX > minSwipeDistance) {
      // Swipe right - go to previous slide
      this.prevSlide();
    }
  }

  nextSlide() {
    const nextIndex = (this.activeIndex() + 1) % this.chunkedMessages.length;
    this.activeIndex.set(nextIndex);
  }

  prevSlide() {
    const prevIndex =
      (this.activeIndex() - 1 + this.chunkedMessages.length) %
      this.chunkedMessages.length;
    this.activeIndex.set(prevIndex);
  }
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
