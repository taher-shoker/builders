import { Component, input } from '@angular/core';
import { PrioritiesScorecardModel } from '../../../../models/scorecard.model';
@Component({
  selector: 'stc-apps-priorities-scorecard',
  standalone: false,
  templateUrl: './priorities-scorecard.component.html',
  styleUrl: './priorities-scorecard.component.scss',
})
export class PrioritiesScorecardComponent {
  // @Input({required : true}) prioritiesScorcardData!:PrioritiesScorecardModel;
  prioritiesScorcardData = input.required<PrioritiesScorecardModel>()
}
