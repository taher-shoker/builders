import { Component, Input } from '@angular/core';
import { CostModel } from '../../models/scorecard.model';
@Component({
  selector: 'stc-apps-cost-card',
  standalone: false,
  templateUrl: './cost-card.component.html',
  styleUrl: './cost-card.component.scss',
})
export class CostCardComponent {
  @Input({required:true}) costData!:CostModel;
}
