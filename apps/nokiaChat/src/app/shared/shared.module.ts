import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { ChatListItemComponent } from './chat-list-item/chat-list-item.component';
import { SliderComponent } from './slider/slider.component';
import { SharedUiModule } from '@stc-apps/shared-ui';
import { ChartControllerComponent } from './chart-controller/chartController.component';
import { ZoomedCardChartComponent } from './zoomed-card-chart/zoomedCardChart.component';
import { SqlHighlightPipe } from './pipes/sqlHighlight.pipe';
const components = [
  HeaderComponent,
  ChatListItemComponent,
  SliderComponent,
  ChartControllerComponent,
  ZoomedCardChartComponent,
  SqlHighlightPipe,
];
const modules = [CommonModule, SharedUiModule];
@NgModule({
  declarations: [...components],
  exports: [...components, ...modules],
  imports: [...modules],
})
export class SharedModule {}
