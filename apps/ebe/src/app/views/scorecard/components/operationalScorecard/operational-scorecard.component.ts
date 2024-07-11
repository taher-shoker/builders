import { Component, Input } from '@angular/core';
import { OperationalScorecardModel } from '../../../../models/scorecard.model';
@Component({
  selector: 'stc-apps-operational-scorecard',
  standalone: false,
  templateUrl: './operational-scorecard.component.html',
  styleUrl: './operational-scorecard.component.scss',
})
export class OperationalScorecardComponent {
  @Input({required : true}) operationalScorcardData!:OperationalScorecardModel;
}
