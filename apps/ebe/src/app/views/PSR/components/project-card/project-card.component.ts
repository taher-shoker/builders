import { Component, input, InputSignal, OnChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PSRChartDataModel, PSRDataModel } from '../../../../models/psr.model';
import { SharedUiModule } from "@stc-apps/shared-ui";
import { RouterModule } from '@angular/router';
import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';

@Component({
  selector: 'stc-apps-psr-project-card',
  standalone: true,
  imports: [CommonModule , SharedUiModule , RouterModule , OverlayPanelModule],
  templateUrl: './project-card.component.html',
  styleUrl: './project-card.component.scss',
})
export class PSRProjectCardComponent implements OnChanges {
  maxTextLength = 0;
  @ViewChild('overlayPanel') overlayPanel!: OverlayPanel;
  @ViewChild('overlayPanel2') overlayPanel2!: OverlayPanel;
  project:InputSignal<PSRDataModel> = input.required<PSRDataModel>();
  colors:string[] = ['#4F008C' , '#B999D1'];
  chartData!:PSRChartDataModel;
  ngOnChanges(): void {    
    this.chartData = {
      actual : this.project().actual,
      planned : this.project().planned
    }
    const textArr:string[] = this.project().details?.trim()?.split(' ') ?? [];
    const filteredArray = textArr.filter(item => item !== '');
    this.maxTextLength = filteredArray.length;
    // console.log(filteredArray);
  }
  displayDrilldown()
  {
    this.overlayPanel.toggle(event);
  }
  displayDrilldown2()
  {
    this.overlayPanel2.toggle(event);
  }
}
