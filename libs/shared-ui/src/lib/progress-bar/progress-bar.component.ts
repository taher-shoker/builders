/* eslint-disable @nx/enforce-module-boundaries */
/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Component, EventEmitter, input, Output } from '@angular/core';

export interface ProgressInfo {
  prefixText: string;
  prefixValue: number | string;
  suffixText: string;
  suffixValue: number | string;
  progressValue: number;
  indexes?: Index[];
  barColor?: string;
  bgBarColor?: string;
  unit?: string;
}

interface Index {
  caption: string;
  value: number;
  progressValue?:number
  // position?: 'up' | 'down';
  position?: 'up' | 'down';
  actualBarColor?:string;
}

@Component({
  selector: 'stc-apps-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss'],
  standalone : false
})
export class ProgressBarComponent {
  data = input.required<ProgressInfo>();
  isProject = input<boolean>(false);
  isPSRProject = input<boolean>(false);
  fontFamily = input<string>('');
  @Output() displayDrilldown:EventEmitter<boolean> = new EventEmitter(false);
  isClicked = false;
  showDrilldown()
  {
    if(this.isPSRProject())
    {
      this.isClicked = !this.isClicked;
      this.displayDrilldown.emit(this.isClicked);
    }
  }

  get unit(): string {
    return this.data().unit || '%';
  }
}
