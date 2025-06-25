import {
  Component,
  ElementRef,
  EventEmitter,
  Output,
  signal,
  ViewChild,
} from '@angular/core';
import suggestedQuestions from '../../views/chat-view/constants/SUGGESTED_QUESTIONS.constants';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrl: './slider.component.scss',
})
export class SliderComponent {
  @ViewChild('sliderWrapper') sliderWrapper!: ElementRef;
  currentSlide = 0;
  transitionStyle = 'transform 0.7s ease';
  activeIndex = signal(0);

  messages = suggestedQuestions;
  touchStartX = 0;
  touchEndX = 0;

  chunkedMessages = this.chunkMessages(this.messages, 3);
  @Output() questionEvent = new EventEmitter<string>();
  ngAfterViewInit() {
    this.setupSwipeGestures();
  }
  getTransform() {
    return `translateX(-${this.activeIndex() * 100}%)`;
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
    const minSwipeDistance = 50;

    if (this.touchStartX - this.touchEndX > minSwipeDistance) {
      this.nextSlide();
    } else if (this.touchEndX - this.touchStartX > minSwipeDistance) {
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
    return result;
  }

  goToSlide(index: number) {
    this.activeIndex.set(index);
  }
  cardClick(question: string) {
    this.questionEvent.emit(question);
  }
}
