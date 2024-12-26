import {
  Component,
  ElementRef,
  EventEmitter,
  input,
  InputSignal,
  Output,
  ViewChild,
} from '@angular/core';
import Hammer from 'hammerjs';
@Component({
  selector: 'stc-apps-pop-up-image',
  templateUrl: './pop-up-image.component.html',
  styleUrl: './pop-up-image.component.scss',
})
export class PopUpImageComponent {
  selectedImage: InputSignal<string> = input('');
  lastTap = 0;

  @ViewChild('container', { static: true }) container!: ElementRef;
  private scale = 1;
  private lastScale = 1;
  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() close = new EventEmitter<void>(); // Declare the Output Event

  closeImagePopup() {
    //close pop up logic
    this.close.emit();
  }
  handleImageTap(event: MouseEvent) {
    const image = event.target as HTMLElement;

    const currentTime = new Date().getTime();
    const tapInterval = currentTime - this.lastTap;

    // If the interval between two taps is less than 300ms, consider it a double-tap
    if (tapInterval < 300 && tapInterval > 0) {
      this.toggleZoom(image);
    }

    this.lastTap = currentTime;
  }
  toggleZoom(image: HTMLElement) {
    if (image.classList.contains('zoomed')) {
      image.classList.remove('zoomed'); // Remove zoom
    } else {
      image.classList.add('zoomed'); // Add zoom
    }
  }
}
