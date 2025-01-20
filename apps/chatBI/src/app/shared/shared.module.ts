import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatListItemComponent } from './chat-list-item/chat-list-item.component';
import { HeaderComponent } from './header/header.component';
import { PopUpImageComponent } from './pop-up-image/pop-up-image.component';
import { BarChartComponent } from './barChart/barChart.component';
import { PieChartComponent } from './pieChart/pieChart.component';
import { TableChartComponent } from './table/tableChart.component';
import { MatTableModule } from '@angular/material/table';
import { LineChartComponent } from './lineChart/lineChart.component';
import { ChartControllerComponent } from './chart-controller/chartController.component';

const components = [
  ChatListItemComponent,
  HeaderComponent,
  PopUpImageComponent,
];
const modules = [CommonModule, MatTableModule];

@NgModule({
  declarations: [
    ...components,
    BarChartComponent,
    PieChartComponent,
    TableChartComponent,
    LineChartComponent,
    ChartControllerComponent,
  ],
  imports: [...modules],
  exports: [...components, ...modules],
})
export class SharedModule {}
