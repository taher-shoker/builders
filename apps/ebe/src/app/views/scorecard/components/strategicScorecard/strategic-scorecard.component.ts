import { Component, Input } from '@angular/core';
import { StrategicScorecardModel } from '../../../../models/scorecard.model';
@Component({
  selector: 'stc-apps-strategic-scorecard',
  standalone: false,
  templateUrl: './strategic-scorecard.component.html',
  styleUrl: './strategic-scorecard.component.scss',
})
export class StrategicScorecardComponent {
  @Input({required : true}) strategicScorcardData!:StrategicScorecardModel;
}
