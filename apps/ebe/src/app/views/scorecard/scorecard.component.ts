import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScorecardTaps } from '../../models/scorecard.model';

@Component({
  selector: 'stc-apps-scorecard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './scorecard.component.html',
  styleUrl: './scorecard.component.scss',
})
export class ScorecardComponent {
  currentClickedTapIndex = 0;
  currentClickedTapData:ScorecardTaps;
  scorecardsTaps:ScorecardTaps[] = [
    {
      id : 1,
      name : "financial"
    },
    {
      id : 2,
      name : "strategic"
    },
    {
      id : 3,
      name : "relational"
    },
    {
      id : 4,
      name : "operational"
    },
    {
      id : 5,
      name : "corporate priorities"
    },
  ];
  constructor(){
    this.currentClickedTapData = this.scorecardsTaps[0];
  }
  toggleTaps(index:number , tap:ScorecardTaps)
  {
    this.currentClickedTapIndex = index;
    this.currentClickedTapData = tap;
  }
}
