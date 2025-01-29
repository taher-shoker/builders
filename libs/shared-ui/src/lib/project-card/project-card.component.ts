import { Component, EventEmitter, inject, input, InputSignal, OnInit, Output, ViewChild } from '@angular/core';
import { ProgressInfo } from '../progress-bar/progress-bar.component';
import { OverlayPanel } from 'primeng/overlaypanel';
export interface ColumnsSchema {
  key: string;
  type: 'text' | 'date' | 'actions' | 'custom';
  label: string;
}
export interface ActivityLog
{
  id:number;
    module:string;
    username:string;
    activityType:string;
    activityDetails:string;
    timestamp:string;
    oldValue?:string;
    newValue?:string;
}
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
  @ViewChild('actionsPanel') actionsPanel!: OverlayPanel;
  activityLogsTableHeader = input.required<ColumnsSchema[]>();
  activityLogsTableBody = input.required<ActivityLog[]>();
  projectData:InputSignal<KpiProjectsDetailsModel> = input.required<KpiProjectsDetailsModel>();
  data!:ProgressInfo;
  @Output() edit:EventEmitter<KpiProjectsDetailsModel> = new EventEmitter();
  @Output() delete:EventEmitter<KpiProjectsDetailsModel> = new EventEmitter();
  @ViewChild('overlayPanel') overlayPanel!: OverlayPanel;
  titleArr:string[] = [];
  showActivityLogsPopup = false;
  isAdmin = input<boolean>(false)
  @Output() showLogsBtnClick:EventEmitter<string> = new EventEmitter()
  showActivityLogs()
  {
    // this.activityLogsPanel.toggle(event);
    this.showActivityLogsPopup = !this.showActivityLogsPopup;
    this.showLogsBtnClick.emit(this.projectData().project);
  }
  popupClosed()
  {
    this.showActivityLogsPopup = false;
    this.actionsPanel.hide();
  }
  showActionsPopup()
  {
    this.actionsPanel.toggle(event);
    this.showActivityLogsPopup = false;
  }
  closeAccordion()
  {
    this.actionsPanel.hide();
    this.showActivityLogsPopup = false
  }
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
    this.titleArr = this.projectData().project.split(" ");
  }
  editProject()
  {
    this.edit.emit(this.projectData())    
  }
  deleteProject()
  {
    this.delete.emit(this.projectData())      
  }
  displayDrilldown()
  {
    this.overlayPanel.toggle(event);
  }
}
