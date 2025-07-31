import { Component, input, InputSignal } from '@angular/core';

@Component({
  selector: 'stc-apps-feedback-issue-card',
  templateUrl: './feedback-issue-card.component.html',
  styleUrl: './feedback-issue-card.component.scss',
})
export class FeedbackIssueCardComponent {
  title: InputSignal<string> = input('');
  count: InputSignal<number> = input(0);
  subTitle: InputSignal<string> = input('');
}
