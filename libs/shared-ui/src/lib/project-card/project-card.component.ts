import { Component, input, InputSignal } from '@angular/core';
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
}
