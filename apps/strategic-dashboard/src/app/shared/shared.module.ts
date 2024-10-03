import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedUiModule } from '@stc-apps/shared-ui';
import { TabComponent } from './components/tabs/tab/tab.component';
import { TabsComponent } from './components/tabs/tabs.component';
import { ProgressPercentageComponent } from './components/progress-percentage/progress-percentage.component';
import { ColumnChartComponent } from './components/column-chart/column-chart.component';
import { RangeSliderComponent } from './components/range-slider/range-slider.component';
import { MatSliderModule } from '@angular/material/slider';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CustomLineChartComponent } from './components/custom-line-chart/custom-line-chart.component';
import { BreadcrumbsComponent } from './components/breadcrumbs/breadcrumbs.component';
import { DropdownComponent } from './components/select-dropdown/dropdown.component';

const components = [
  TabsComponent,
  TabComponent,
  ProgressPercentageComponent,
  ColumnChartComponent,
  RangeSliderComponent,
  CustomLineChartComponent,
  BreadcrumbsComponent,
  DropdownComponent
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
