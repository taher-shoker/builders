import { Component, EventEmitter, input, InputSignal, OnInit, Output } from '@angular/core';
import { ProgressInfo } from '../progress-bar/progress-bar.component';
export interface KpiProjectsDetailsModel
{
  project:string;
  actual:number;
  planned:number;
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
  @Output() edit:EventEmitter<KpiProjectsDetailsModel> = new EventEmitter();
  @Output() delete:EventEmitter<KpiProjectsDetailsModel> = new EventEmitter();
  ngOnInit()
  {
    this.data = {
      prefixText: '',
      prefixValue: 0,
      suffixText: '',
      suffixValue: 0,
      // progressValue: this.projectData().progressValue,
      progressValue: 100,
      barColor:'#00C48C',
      bgBarColor:'#00c48c1a',
      indexes: [
        {
          caption: 'Actual',
          value: this.projectData().actual,
          position: 'up',
          actualBarColor:"#009F71",
        },
        {
          caption: `Planned`,
          value: this.projectData().planned,
          position: 'down',
          actualBarColor:"#000000",
        },
      ],
    };
  }
  editProject()
  {
    this.edit.emit(this.projectData())    
  }
  deleteProject()
  {
    this.delete.emit(this.projectData())      
  }
}
