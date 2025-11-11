import { Component, Input } from '@angular/core';
import { ProgressInfo } from '@stc-apps/shared-ui';

@Component({
  selector: 'stc-apps-vp-summary-cards',
  templateUrl: './summary-cards.component.html',
  styleUrls: ['./summary-cards.component.scss'],
})
export class VpSummaryCardsComponent {
  @Input() cardTitle = 'DI Progress';
  @Input() teamName = '';
  @Input() baselineTitle = 'Baseline';
  @Input() baselineValue?: number = 10;
  @Input() progressData: ProgressInfo = {
        prefixText: '',
        prefixValue: 0,
        suffixText: '',
        suffixValue: 0,
        progressValue: 90,
        indexes: [
          {
            caption: 'Actual',
            value: 90,
            position: 'up',
             actualBarColor:'#00C48C'
          },
          {
            caption: 'Q3 Target',
            value: 80,
            position: 'down',
          },
        ],
        barColor: '#00C48C',
        bgBarColor: '#dcfce7'
      };
  @Input() stcDiScore = 47.5;
  @Input() unitDiScore = 36.25;



}
