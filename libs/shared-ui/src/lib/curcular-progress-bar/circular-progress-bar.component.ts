import { Component , input} from '@angular/core';
@Component({
  selector: 'stc-apps-circular-progress-bar',
  standalone: false,
  templateUrl: './circular-progress-bar.component.html',
  styleUrl: './circular-progress-bar.component.scss',
})
export class CircularProgressBarComponent {
  percentVal = input.required<number>();
  radius = input.required<number>();
  innerCircleColor = input.required<string>();
  outerCircleColor = input.required<string>();
  titleColor = input.required<string>();
  titleFontSize = input.required<number>();
  outerStrokeRadius = input.required<number>();
  innerStrokeRadius = input.required<number>();
}
