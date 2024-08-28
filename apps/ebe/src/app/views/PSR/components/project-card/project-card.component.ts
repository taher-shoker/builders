import { Component, input, InputSignal, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PSRChartDataModel, PSRDataModel } from '../../../../models/psr.model';
import { SharedUiModule } from '@stc-apps/shared-ui';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'stc-apps-psr-project-card',
  standalone: true,
  imports: [CommonModule , SharedUiModule , RouterModule],
  templateUrl: './project-card.component.html',
  styleUrl: './project-card.component.scss',
})
export class PSRProjectCardComponent implements OnChanges {
  project:InputSignal<PSRDataModel> = input.required<PSRDataModel>();
  colors:string[] = ['#4F008C' , '#B999D1'];
  chartData!:PSRChartDataModel;
  ngOnChanges(): void {
    this.chartData = {
      actual : this.project().actual,
      planned : this.project().planned
    }
  }
}
