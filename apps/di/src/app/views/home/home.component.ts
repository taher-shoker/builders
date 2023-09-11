import { Component } from '@angular/core';
import { DonutChartData, LabelLine, ProgressCircleData } from '@stc-apps/shared-ui';

@Component({
  selector: 'stc-apps-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  data : ProgressCircleData[] = [
    {category: "TECHNOLOGY DI ", value: 100},
    {category: "FU DI", value: 190},
    {category: "CLUSTER DI", value: 400},
  ]

  donutData1 : DonutChartData[] = [
    {category: "TECHNOLOGY DI ", value: 62},
    {category: "FU DI", value: 40},
    {category: "CLUSTER DI", value: 20},
  ]

  donutData2 : DonutChartData[] = [
    {category: "TECHNOLOGY DI ", value: 62},
    {category: "FU DI", value: 40},
    {category: "CLUSTER DI", value: 20},
  ]

  donutData3 : DonutChartData[] = [
    {category: "TECHNOLOGY DI ", value: 62},
    {category: "FU DI", value: 40},
    {category: "CLUSTER DI", value: 20},
  ]

  labels1 : LabelLine[] = [
    {value: "BUs DI", styles: "[bold]", centerY: 90, fontSize: 15},
    {value: "25.77%", styles: "[#00c48c][bold]",  centerY: 27, fontSize: 22},
  ]

  labels2 : LabelLine[] = [
    {value: "FUs DI", styles: "[bold]", centerY: 90, fontSize: 15},
    {value: "25.77%", styles: "[#bb2222][bold]",  centerY: 27, fontSize: 22},
  ]

  labels3 : LabelLine[] = [
    {value: "Technology DI", styles: "[bold]", centerY: 90, fontSize: 14},
    {value: "25.77%", styles: "[#00c48c][bold]",  centerY: 27, fontSize: 22},
  ]

  progressColors = [ '#1cced8', '#a54ee1', '#45006F',]
  donutColors = ['#ff6a39', '#ffdd40', '#1cced8']
}
