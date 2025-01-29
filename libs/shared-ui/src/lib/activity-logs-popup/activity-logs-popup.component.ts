import { Component, effect, EventEmitter, inject, input, InputSignal, Output, ViewChild } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';
import { Router } from '@angular/router';
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
@Component({
  selector: 'stc-apps-activity-logs-popup',
  standalone: false,
  templateUrl: './activity-logs-popup.component.html',
  styleUrl: './activity-logs-popup.component.scss',
})
export class ActivityLogsPopupComponent {
  @ViewChild('activityLogsPanel') activityLogsPanel!: OverlayPanel;
  activityLogsTableHeader:InputSignal<ColumnsSchema[]> = input.required<ColumnsSchema[]>();
  activityLogsTableBody:InputSignal<ActivityLog[]> = input.required<ActivityLog[]>();
  showPopup:InputSignal<boolean> = input.required<boolean>();
  isActionPopup:InputSignal<boolean> = input<boolean>(false);
  isActionPopup2:InputSignal<boolean> = input<boolean>(false);
  isProjectActionPopup:InputSignal<boolean> = input<boolean>(false);
  @Output() popupClosed:EventEmitter<boolean> = new EventEmitter(false);
  router = inject(Router)
  datePipe = inject(DatePipe);
  closeActivityLogsPopup()
  {
    this.activityLogsPanel.hide();
    this.popupClosed.emit(true);
  }
  constructor(){
    effect(() => {
      if(this.showPopup())
      {
        this.activityLogsPanel.show(event);
      } else {
        this.activityLogsPanel.hide();
      }
    })
  }
  transformDate(date:string)
  {
    return this.datePipe.transform(date, 'dd MMM yyyy \'at\' hh:mm a');
  }
  showAllActivityLog()
  {
    this.router.navigateByUrl("/activity-logs");
  }
}
