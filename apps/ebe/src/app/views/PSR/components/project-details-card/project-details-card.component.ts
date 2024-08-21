import { Component, ElementRef, input, InputSignal, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressInfo, PSRProjectDetailsModel } from '../../../../models/psr.model';
import { SharedUiModule } from '@stc-apps/shared-ui';
import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';
export interface ColumnsSchema {
  key: string;
  type: 'text' | 'date' | 'actions' | 'custom';
  label: string;
}
@Component({
  selector: 'stc-apps-project-details-card',
  standalone: true,
  imports: [CommonModule , SharedUiModule , OverlayPanelModule],
  templateUrl: './project-details-card.component.html',
  styleUrl: './project-details-card.component.scss',
})
export class ProjectDetailsCardComponent implements OnInit {
  projectData:InputSignal<PSRProjectDetailsModel> = input.required<PSRProjectDetailsModel>();
  data!:ProgressInfo;
  showPopover = false;
  tableHeader!:ColumnsSchema[];
  @ViewChild('overlayPanel') overlayPanel!: OverlayPanel;
  constructor(private elementRef: ElementRef) {}
  ngOnInit(): void {
    this.data = {
      prefixText: '',
      prefixValue: 0,
      suffixText: '',
      suffixValue: 0,
      progressValue: this.projectData().progressBarData.progressValue,
      barColor:'#00C48C',
      bgBarColor:'#00c48c1a',
      indexes: [
        {
          caption: 'Actual',
          value: this.projectData().progressBarData.actualValue,
          position: 'up',
        },
        {
          caption: `Planned`,
          value: this.projectData().progressBarData.plannedValue,
          position: 'down',
        },
      ],
    };
    this.tableHeader = [
      {
        key : "id",
        type : "text",
        label : "ID"
      },
      {
        key : "majorTitle",
        type : "text",
        label : "Major Activities/Deliverables"
      },
      {
        key : "start",
        type : "text",
        label : "Start"
      },
      {
        key : "duration",
        type : "text",
        label : "Duration"
      },
      {
        key : "completeLevel",
        type : "text",
        label : "Completion Level"
      },
    ]
  }
  displayDrilldown()
  {
    this.overlayPanel.toggle(event);
  }
}
