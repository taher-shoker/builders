import {
  Component,
  EventEmitter,
  input,
  InputSignal,
  Output,
} from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  title: InputSignal<string> = input('');
  // newChatScreenFlag is used to show the add button or not it is shown if it's not a new chat display.
  newChatScreenFlag: InputSignal<boolean> = input(true);
  @Output() newChat = new EventEmitter<void>();
  constructor(private location: Location, private router: Router) {}
  goBack() {
    setTimeout(() => {
      this.location.back();
    }, 300);
  }
  startChat() {
    this.newChat.emit();
  }
}
