import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  input,
  InputSignal,
  OnDestroy,
  Output,
  ViewChild,
} from '@angular/core';
import Hammer from 'hammerjs';
@Component({
  selector: 'stc-apps-pop-up-image',
  templateUrl: './pop-up-image.component.html',
  styleUrl: './pop-up-image.component.scss',
})
export class PopUpImageComponent implements OnDestroy {
  selectedImage: InputSignal<string> = input('');
  lastTap = 0;
  isZoomed = false;
  pos = { top: 0, left: 0, x: 0, y: 0 };
  @ViewChild('container') 'container': ElementRef;
  @ViewChild('img') 'img': ElementRef;
  private scale = 1;
  private lastScale = 1;
  private isDragging = false;
  private startX = 0;
  private startY = 0;
  private translateX = 0; // To store X-axis movement
  private translateY = 0; // To store Y-axis movement

  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() close = new EventEmitter<void>(); // Declare the Output Event
  ngOnDestroy() {
    this.isDragging = false;
  }
  closeImagePopup() {
    //close pop up logic
    this.close.emit();
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
    console.log(e.clientY, e.clientX);
    this.isZoomed = !this.isZoomed;
    const zoomWidth = window.innerWidth > 900 ? '150%' : '200%';
    console.log('inner width',zoomWidth);
    
    if (this.isZoomed) {
      this.isDragging = true;
      this.container.nativeElement.style.overflow = 'hidden';
      this.img.nativeElement.style.width = zoomWidth;
      this.img.nativeElement.style.cursor = 'zoom-out';
      this.img.nativeElement.style.left = `-${e.clientX}`;
      this.img.nativeElement.style.top = `-${e.clientY}`;
    } else {
      this.isDragging = false;
      this.container.nativeElement.style.overflow = 'hidden';
      this.img.nativeElement.style.width = '100%';
      this.img.nativeElement.style.cursor = 'zoom-in';
      this.img.nativeElement.style.transform = '';
    }
  }
  onMouseDown(e: any) {
    this.pos = {
      // The current scroll
      left: this.container.nativeElement.scrollLeft,
      top: this.container.nativeElement.scrollTop,
      // Get the current mouse position
      x: e.clientX,
      y: e.clientY,
    };
  }
  onMouseUp() {
    // this.isDragging = false;
  }
  mouseMoveHandler(e: any) {
    // How far the mouse has been moved
    const dx = (e.clientX - this.pos.x) * 2;
    const dy = (e.clientY - this.pos.y) * 2;

    // Scroll the element
    this.container.nativeElement.scrollTop = this.pos.top - dy;
    this.container.nativeElement.scrollLeft = this.pos.left - dx;
  }
  onTouchStart(event: TouchEvent) {
    console.log('inside touch start');

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
        this.img.nativeElement.style.transform = `translate(${x}px)`;
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
