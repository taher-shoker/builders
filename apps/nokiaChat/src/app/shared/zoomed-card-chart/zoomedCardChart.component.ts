import {
  Component,
  EventEmitter,
  input,
  InputSignal,
  Output,
} from '@angular/core';
import { sqlData } from '../../views/chat-view/models/chat-view.model';

@Component({
  selector: 'app-zoomed-card-chart',
  templateUrl: './zoomedCardChart.component.html',
  styleUrl: './zoomedCardChart.component.scss',
})
export class ZoomedCardChartComponent {
  chartType: InputSignal<string> = input('');
  chartData: InputSignal<sqlData> = input({} as sqlData);
  popUpClicked = true;
  @Output() close = new EventEmitter<void>();
  closeImagePopup() {
    this.close.emit();
    this.popUpClicked = false;
  }
}
