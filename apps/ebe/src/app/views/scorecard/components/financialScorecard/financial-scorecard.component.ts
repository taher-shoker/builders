import { Component, input } from '@angular/core';
import { FinancialScorecardModel } from '../../../../models/scorecard.model';
@Component({
  selector: 'stc-apps-financial-scorecard',
  standalone: false,
  templateUrl: './financial-scorecard.component.html',
  styleUrl: './financial-scorecard.component.scss',
})
export class FinancialScorecardComponent {
  // @Input({required : true}) financialScorcardData!:FinancialScorecardModel;
  financialScorcardData = input.required<FinancialScorecardModel>();
}
