import { Component } from '@angular/core';
import { ProgressCircleData } from '@stc-apps/shared-ui';

@Component({
  selector: 'stc-apps-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  data : ProgressCircleData[] = [
    {category: "TECHNOLOGY DI ", value: 62},
    {category: "FU DI", value: 40},
    {category: "CLUSTER DI", value: 20},
  ]

  colors = ['#45006F', '#FF6A39']
}
