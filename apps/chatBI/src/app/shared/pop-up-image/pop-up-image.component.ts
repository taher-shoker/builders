import {
  Component,
  effect,
  ElementRef,
  EventEmitter,
  input,
  InputSignal,
  OnDestroy,
  Output,
  ViewChild,
} from '@angular/core';
import { sqlData } from '../../views/chat-view/models/chatModel';

@Component({
  selector: 'stc-apps-pop-up-image',
  templateUrl: './pop-up-image.component.html',
  styleUrl: './pop-up-image.component.scss',
})
export class PopUpImageComponent implements OnDestroy {
  selectedImage: InputSignal<string> = input('');
  chartType: InputSignal<string> = input('');
  chartData: InputSignal<sqlData> = input({} as sqlData);
  lastTap = 0;
  isZoomed = false;
  imagePosition = { top: 0, left: 0, x: 0, y: 0 };
  private isDragging = false;
  private startX = 0;
  private startY = 0;
  private translateX = 0;
  private translateY = 0;
  popUpClicked = true;
  @ViewChild('imageContainer') 'imageContainer': ElementRef;
  @ViewChild('imageTag') 'imageTag': ElementRef;
  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() close = new EventEmitter<void>();

  ngOnDestroy() {
    this.isDragging = false;
  }
  closeImagePopup() {
    this.close.emit();
    this.popUpClicked = false;
  }
  handleImageTap(event: MouseEvent) {
    const currentTime = new Date().getTime();
    const tapInterval = currentTime - this.lastTap;
    // If the interval between two taps is less than 300ms, consider it a double-tap
    if (tapInterval < 300 && tapInterval > 0) {
      this.onClick(event);
    }

    this.lastTap = currentTime;
  }
  onClick(e: any) {
    this.isZoomed = !this.isZoomed;

    if (this.isZoomed) {
      this.zoomImage(e);
    } else {
      this.unZoomImage();
    }
  }
  zoomImage(e: any) {
    const zoomWidth = window.innerWidth > 900 ? '150%' : '200%';
    this.isDragging = true;
    this.imageContainer.nativeElement.style.overflow = 'hidden';
    this.imageTag.nativeElement.style.width = zoomWidth;
    this.imageTag.nativeElement.style.cursor = 'zoom-out';
    this.imageTag.nativeElement.style.left = `-${e.clientX}`;
    this.imageTag.nativeElement.style.top = `-${e.clientY}`;
  }
  unZoomImage() {
    this.isDragging = false;
    this.imageContainer.nativeElement.style.overflow = 'hidden';
    this.imageTag.nativeElement.style.width = '100%';
    this.imageTag.nativeElement.style.cursor = 'zoom-in';
    this.imageTag.nativeElement.style.transform = '';
  }
  onMouseDown(e: any) {
    this.imagePosition = {
      left: this.imageContainer.nativeElement.scrollLeft,
      top: this.imageContainer.nativeElement.scrollTop,
      x: e.clientX,
      y: e.clientY,
    };
  }
  mouseMoveHandler(e: any) {
    const dx = (e.clientX - this.imagePosition.x) * 2;
    const dy = (e.clientY - this.imagePosition.y) * 2;
    this.imageContainer.nativeElement.scrollTop = this.imagePosition.top - dy;
    this.imageContainer.nativeElement.scrollLeft = this.imagePosition.left - dx;
  }
  onTouchStart(event: TouchEvent) {
    if (this.isDragging && event.touches.length === 1) {
      const touch = event.touches[0];
      this.startX = touch.clientX - this.translateX;
      this.startY = touch.clientY - this.translateY;
    }
  }

  onTouchMove(event: TouchEvent) {
    console.log('inside touch move');
    if (this.isDragging && event.touches.length === 1) {
      event.preventDefault(); // Prevent scrolling
      const touch = event.touches[0];
      const x = touch.clientX - this.startX;
      if (x > -320 && x < 0) {
        console.log('true');
        this.translateX = x;
        this.imageTag.nativeElement.style.transform = `translate(${x}px)`;
      }
    }
  }
  toggleZoom(image: HTMLElement) {
    if (image.classList.contains('zoomed')) {
      image.classList.remove('zoomed'); // Remove zoom
    } else {
      image.classList.add('zoomed'); // Add zoom
    }
  }
}
