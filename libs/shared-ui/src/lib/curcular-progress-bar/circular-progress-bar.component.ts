import { Component , input} from '@angular/core';
@Component({
  selector: 'stc-apps-circular-progress-bar',
  standalone: false,
  templateUrl: './circular-progress-bar.component.html',
  styleUrl: './circular-progress-bar.component.scss',
})
export class CircularProgressBarComponent {
  percentVal = input.required<number>();
}
