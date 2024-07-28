import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedUiModule } from '@stc-apps/shared-ui';
import { TopBannerComponent } from './top-banner/top-banner.component';
import { TabComponent } from './tabs/tab/tab.component';
import { TabsComponent } from './tabs/tabs.component';
import { ProgressPercentageComponent } from './progress-percentage/progress-percentage.component';
import { ColumnChartComponent } from './column-chart/column-chart.component';

const components = [
  TopBannerComponent,
  TabsComponent,
  TabComponent,
  ProgressPercentageComponent,
  ColumnChartComponent
];
const modules = [CommonModule, SharedUiModule];

@NgModule({
  declarations: [...components],
  imports: [...modules],
  exports: [...components, ...modules],
})
export class SharedModule {}
