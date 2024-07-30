import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedUiModule } from '@stc-apps/shared-ui';
import { TabComponent } from './tabs/tab/tab.component';
import { TabsComponent } from './tabs/tabs.component';
import { ProgressPercentageComponent } from './progress-percentage/progress-percentage.component';
import { ColumnChartComponent } from './column-chart/column-chart.component';
import { RangeSliderComponent } from './range-slider/range-slider.component';
import { MatSliderModule } from '@angular/material/slider';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

const components = [
  TabsComponent,
  TabComponent,
  ProgressPercentageComponent,
  ColumnChartComponent,
  RangeSliderComponent,
];
const modules = [
  CommonModule,
  MatSliderModule,
  ReactiveFormsModule,
  RouterModule,
  FormsModule,
  SharedUiModule,
];

@NgModule({
  declarations: [...components],
  imports: [...modules],
  exports: [...components, ...modules],
})
export class SharedModule {}
