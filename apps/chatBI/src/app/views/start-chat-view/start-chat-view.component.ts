import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'stc-apps-start-chat-view',
  templateUrl: './start-chat-view.component.html',
  styleUrl: './start-chat-view.component.scss',
})
export class StartChatViewComponent {
  constructor(private router: Router) {}
  startChatNavigation() {
    this.router.navigate(['/chatView']);
  }
}
