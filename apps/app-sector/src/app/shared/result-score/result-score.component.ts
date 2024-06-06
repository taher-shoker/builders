import { Component, InputSignal, input } from '@angular/core';

@Component({
  selector: 'stc-apps-result-score',
  templateUrl: './result-score.component.html',
  styleUrls: ['./result-score.component.scss'],
})
export class ResultScoreComponent {
  percentage: InputSignal<number> = input(0);
  title: InputSignal<string> = input('');
}
