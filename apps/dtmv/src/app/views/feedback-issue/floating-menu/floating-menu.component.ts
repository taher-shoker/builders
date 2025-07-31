import { trigger, transition, style, animate } from '@angular/animations';
import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'stc-apps-floating-menu',
  templateUrl: './floating-menu.component.html',
  styleUrl: './floating-menu.component.scss',
  animations: [
    trigger('menuAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate(
          '200ms ease-out',
          style({ opacity: 1, transform: 'translateY(0)' })
        ),
      ]),
      transition(':leave', [
        animate(
          '150ms ease-in',
          style({ opacity: 0, transform: 'translateY(10px)' })
        ),
      ]),
    ]),
  ],
})
export class FloatingMenuComponent {
  menuOpen = false;
  @Output() openForm = new EventEmitter<void>();
  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
  openFeedback() {
    this.menuOpen = false;
    this.openForm.emit();
  }
}
