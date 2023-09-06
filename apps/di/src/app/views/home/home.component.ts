import { Component } from '@angular/core';
import { ProgressCircleData } from '@stc-apps/shared-ui';

@Component({
  selector: 'stc-apps-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  data : ProgressCircleData[] = [
    {category: "Val 1 ", value: 50},
    {category: "Val 2 ", value: 40},
    {category: "Val 3 ", value: 40},
  ]

  colors = ['#45006F', '#FF6A39']
}
