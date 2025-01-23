import { Component, effect, EventEmitter, input, InputSignal, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';
import { SharedUiModule } from "../../../../../../libs/shared-ui/src/lib/shared-ui.module";
import { ColumnsSchema } from '../../models/psr.model';
@Component({
  selector: 'stc-apps-activity-logs-popup',
  standalone: true,
  imports: [CommonModule, OverlayPanelModule, SharedUiModule],
  templateUrl: './activity-logs-popup.component.html',
  styleUrl: './activity-logs-popup.component.scss',
})
export class ActivityLogsPopupComponent {
  @ViewChild('activityLogsPanel') activityLogsPanel!: OverlayPanel;
  activityLogsTableHeader:InputSignal<ColumnsSchema[]> = input.required<ColumnsSchema[]>();
  activityLogsTableBody:InputSignal<any[]> = input.required<any[]>();
  showPopup:InputSignal<boolean> = input.required<boolean>();
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
