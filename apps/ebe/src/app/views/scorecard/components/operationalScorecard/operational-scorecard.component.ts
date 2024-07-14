import { Component, input } from '@angular/core';
import { OperationalScorecardModel } from '../../../../models/scorecard.model';
@Component({
  selector: 'stc-apps-operational-scorecard',
  standalone: true,
  templateUrl: './operational-scorecard.component.html',
  styleUrl: './operational-scorecard.component.scss',
})
export class OperationalScorecardComponent {
  // @Input({required : true}) operationalScorcardData!:OperationalScorecardModel;
  operationalScorcardData = input.required<OperationalScorecardModel>()
}
