/* eslint-disable @nx/enforce-module-boundaries */
/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Component, effect, input } from '@angular/core';

export interface ProgressInfo {
  prefixText: string;
  prefixValue: number | string;
  suffixText: string;
  suffixValue: number | string;
  progressValue: number;
  indexes?: Index[];
  barColor?: string;
  bgBarColor?: string
}

interface Index {
  caption: string;
  value: number;
  position?: 'up' | 'down'
}

@Component({
  selector: 'stc-apps-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss'],
})
export class ProgressBarComponent {
  data = input.required<ProgressInfo>();
  isProject = input<boolean>(false);

  constructor() {
    effect(() => {
      console.log(this.data());
    });
  }
}
