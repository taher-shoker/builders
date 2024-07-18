import { Component, input, InputSignal } from '@angular/core';
import { ProgressInfo } from '../progress-bar/progress-bar.component';
export interface KpiProjectsDetailsModel
{
  id:number;
  title:string;
  actualValue:number;
  plannedValue:number;
}
@Component({
  selector: 'stc-apps-project-card',
  standalone: false,
  templateUrl: './project-card.component.html',
  styleUrl: './project-card.component.scss',
})
export class ProjectCardComponent {
  projectData:InputSignal<KpiProjectsDetailsModel> = input.required<KpiProjectsDetailsModel>();
  data:ProgressInfo = {
    prefixText: '',
    prefixValue: 0,
    suffixText: '',
    suffixValue: 0,
    progressValue: 75,
    barColor:'#00C48C',
    bgBarColor:'#00c48c1a',
    indexes: [
      {
        caption: 'Actual',
        value: 20,
        position: 'up',
      },
      {
        caption: `Planned`,
        value: 30,
        position: 'down',
      },
    ],
  };
}
