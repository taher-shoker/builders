import { Location } from '@angular/common';
import {
  Component,
  EventEmitter,
  input,
  InputSignal,
  Output,
} from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'stc-apps-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  title: InputSignal<string> = input('');
  newMessageIsSent: InputSignal<boolean> = input(false);
  @Output() newChat = new EventEmitter<void>();
  constructor(private location: Location, private router: Router) {}
  goBack() {
    setTimeout(() => {
      this.location.back();
    }, 300);
    // this.router.navigate(['/startChat'])
  }
  startChat() {
    this.newChat.emit();
  }
}
