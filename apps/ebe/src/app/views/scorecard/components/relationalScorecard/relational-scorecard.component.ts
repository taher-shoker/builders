import { Component, Input } from '@angular/core';
import { RelationalScorecardModel } from '../../../../models/scorecard.model';
@Component({
  selector: 'stc-apps-relational-scorecard',
  standalone: false,
  templateUrl: './relational-scorecard.component.html',
  styleUrl: './relational-scorecard.component.scss',
})
export class RelationalScorecardComponent {
  @Input({required : true}) relationalScorecardData!:RelationalScorecardModel;
}
