import {
  animate,
  AnimationBuilder,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, input, InputSignal, OnChanges } from '@angular/core';

@Component({
  selector: 'stc-apps-chat-insight-card',
  templateUrl: './chat-insight-card.component.html',
  styleUrl: './chat-insight-card.component.scss',
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        // when element appears
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate(
          '400ms ease-out',
          style({ opacity: 1, transform: 'translateY(0)' })
        ),
      ]),
      transition(':leave', [
        // when element disappears
        animate('400ms ease-out', style({ opacity: 0 })),
      ]),
    ]),
  ],
})
export class ChatInsightCardComponent implements OnChanges {
  contentKey = 0;
  newContent: InputSignal<string> = input('');
  title: InputSignal<string> = input('');
  isExpanded = true;
  previousContent = '';
  newChunk = '';
  constructor(private builder: AnimationBuilder) {}

  ngOnChanges() {
    const full = this.newContent;

    if (!full().startsWith(this.previousContent)) {
      this.previousContent = '';
      this.newChunk = full();
    } else {
      this.newChunk = full().slice(this.previousContent.length);
    }

    if (this.newChunk) {
      setTimeout(() => {
        this.previousContent += this.newChunk;
        this.newChunk = '';
      }, 300);
    }
  }
  toggleExpand() {
    this.isExpanded = !this.isExpanded;
  }
}
