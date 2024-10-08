import { Component, computed, effect, input, InputSignal } from '@angular/core';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { ProgressInfo } from 'libs/shared-ui/src/lib/progress-bar/progress-bar.component';
@Component({
  selector: 'stc-apps-program-progress-card',
  templateUrl: './program-progress-card.component.html',
  styleUrl: './program-progress-card.component.scss',
})
export class ProgramProgressCardComponent {
  programTitle: InputSignal<string> = input('');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  barData: InputSignal<any> = input();
  progressBarData=computed(()=>{
    return this.barData();
  });
  
}
