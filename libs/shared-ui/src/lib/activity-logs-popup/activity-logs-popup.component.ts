import { Component, effect, EventEmitter, input, InputSignal, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';
export interface ColumnsSchema {
  key: string;
  type: 'text' | 'date' | 'actions' | 'custom';
  label: string;
}
export interface ActivityLog
{
  username:string,
  type:string,
  details:string,
  time:string
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
  gotoActivityLogs(){
    console.log('gotoActivityLogs');
  }
}
