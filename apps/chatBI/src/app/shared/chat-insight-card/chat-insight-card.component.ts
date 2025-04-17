import {
  Component,
  ContentChild,
  ElementRef,
  input,
  InputSignal,
} from '@angular/core';

@Component({
  selector: 'stc-apps-chat-insight-card',
  templateUrl: './chat-insight-card.component.html',
  styleUrl: './chat-insight-card.component.scss',
})
export class ChatInsightCardComponent {
  title: InputSignal<string> = input('');
  isExpanded = true;

  toggleExpand() {
    this.isExpanded = !this.isExpanded;
  }
  @ContentChild('projected', { read: ElementRef }) contentRef!: ElementRef;

  ngAfterContentInit() {
    if (this.contentRef) {
      console.log(
        'Projected content:',
        this.contentRef.nativeElement.innerText
      );
    }
  }
}
