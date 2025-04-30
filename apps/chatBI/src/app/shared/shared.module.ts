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
import { SuggestedQuestionComponent } from './suggested-question/suggestedQuestion.component';
import { ChatInsightCardComponent } from './chat-insight-card/chat-insight-card.component';
import { FormatMessagePipe } from './pipes/formatMessage.pipe';
import { SliderComponent } from './slider/slider.component';
import { SqlHighlightPipe } from './pipes/sqlHighlight.pipe';
import { JsonParsePipe } from './pipes/jsonformat.pipe';

const components = [
  ChatListItemComponent,
  HeaderComponent,
  PopUpImageComponent,
  BarChartComponent,
  PieChartComponent,
  TableChartComponent,
  LineChartComponent,
  ChartControllerComponent,
  SuggestedQuestionComponent,
  ChatInsightCardComponent,
  FormatMessagePipe,
  SliderComponent,
  SqlHighlightPipe,
  JsonParsePipe,
];
const modules = [CommonModule, MatTableModule];

@NgModule({
  declarations: [...components],
  imports: [...modules],
  exports: [...components, ...modules],
})
export class SharedModule {}
