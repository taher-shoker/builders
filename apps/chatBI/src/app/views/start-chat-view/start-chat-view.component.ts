import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'stc-apps-start-chat-view',
  templateUrl: './start-chat-view.component.html',
  styleUrl: './start-chat-view.component.scss',
})
export class StartChatViewComponent implements OnInit {
  isAnimated = false;
  constructor(private router: Router) {}
  ngOnInit() {
    // Trigger the animation after the component is initialized
    setTimeout(() => {
      this.isAnimated = true;
    }, 100); // Delay for smoother animation (optional)
  }
  startChatNavigation() {
    this.router.navigate(['/chatView']);
  }
}
