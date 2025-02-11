import { Component, input, InputSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressInfo, PSRProjectDetailsModel } from '../../../../models/psr.model';
import { SharedUiModule } from '@stc-apps/shared-ui';

@Component({
  selector: 'stc-apps-mobile-project-card',
  standalone: true,
  imports: [CommonModule , SharedUiModule],
  templateUrl: './mobile-project-card.component.html',
  styleUrl: './mobile-project-card.component.scss',
})
export class MobileProjectCardComponent {
  project:InputSignal<PSRProjectDetailsModel> = input.required<PSRProjectDetailsModel>();
  data!: ProgressInfo;
  ngOnInit()
  {
    const vactual = this.project().vactual;
    const vplanned = this.project().vplanned;
    const difference = Math.abs(vplanned - vactual);
    this.data = {
      prefixText: '',
      prefixValue: 0,
      suffixText: '',
      suffixValue: 0,
      progressValue: vactual,
      barColor:
        (difference >= 0 && difference <= 5) || vactual > vplanned
          ? '#00C48C'
          : difference > 5 && difference <= 10
          ? '#EFC500'
          : '#FF1A1A',
      bgBarColor:
        (difference >= 0 && difference <= 5) || vactual > vplanned
          ? '#00c48c1a'
          : difference > 5 && difference <= 10
          ? 'rgba(239, 197, 0, .2)'
          : 'rgba(255, 26, 26, .2)',
      indexes: [
        {
          caption: 'Actual',
          value: this.project().vactual,
          position: 'up',
          actualBarColor:
            (difference >= 0 && difference <= 5) || vactual > vplanned
              ? '#009F71'
              : difference > 5 && difference <= 10
              ? '#D9B301'
              : '#BC0000',
        },
        {
          caption: `Planned`,
          value: this.project().vplanned,
          position: 'down',
          actualBarColor: '#000000',
        },
      ],
    };
  }
  showDeliverablesTable()
  {
    
  }
}
