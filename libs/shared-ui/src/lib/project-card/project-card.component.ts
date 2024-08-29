import { Component, input, InputSignal, OnInit } from '@angular/core';
import { ProgressInfo } from '../progress-bar/progress-bar.component';
export interface KpiProjectsDetailsModel
{
  id:number;
  title:string;
  actualValue:number;
  plannedValue:number;
  progressValue:number;
}
@Component({
  selector: 'stc-apps-project-card',
  standalone: false,
  templateUrl: './project-card.component.html',
  styleUrl: './project-card.component.scss',
})
export class ProjectCardComponent implements OnInit{
  projectData:InputSignal<KpiProjectsDetailsModel> = input.required<KpiProjectsDetailsModel>();
  data!:ProgressInfo;
  ngOnInit()
  {
    this.data = {
      prefixText: '',
      prefixValue: 0,
      suffixText: '',
      suffixValue: 0,
      progressValue: this.projectData().progressValue,
      barColor:'#00C48C',
      bgBarColor:'#00c48c1a',
      indexes: [
        {
          caption: 'Actual',
          value: this.projectData().actualValue,
          position: 'up',
          actualBarColor:"#000000",
        },
        {
          caption: `Planned`,
          value: this.projectData().plannedValue,
          position: 'down',
          actualBarColor:"#000000",
        },
      ],
    };
  }
}
